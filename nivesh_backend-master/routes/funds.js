const router = require("express").Router();
const { generateId, createFolder, sendToAdmins } = require("../helpers");
const { verifyToken, requireAdmin } = require("../middlewares/tokenVerification");
const { fundUpload, fundUpdateUpload } = require("../helpers/multer");
const Fund = require("../schema/Fund");
const csvToJson = require("csvtojson");
const Joi = require("joi");
const moment = require("moment");
const PaytmCheckSum = require("paytmchecksum");
const axios = require("axios");
const { exec } = require("child_process");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../schema/Order");
const User = require("../schema/User");
const Plan = require("../schema/Plan");
const Subscription = require("../schema/Subscription");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

// @route POST /new/fund
// @desc Create new fund
router.post(
  "/new/fund",
  verifyToken,
  requireAdmin,
  generateId,
  createFolder,
  fundUpload.fields([
    { name: "dailyChangeFile", maxCount: 1 },
    { name: "fundGraphFile", maxCount: 1 },
    { name: "fundImageFile", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, shortDescription, description, riskCategory, trending, minimumInvestment, duration } = req.body;
    const cagr = JSON.parse(req.body.cagr);
    const shares = JSON.parse(req.body.shares);
    const returns = JSON.parse(req.body.returns);

    try {
      const validation = Joi.object().keys({
        name: Joi.string().required(),
        duration: Joi.string().required(),
        shares: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              allocation: Joi.number().required(),
            })
          )
          .required(),
        shortDescription: Joi.string().required(),
        description: Joi.string().required(),
        cagr: Joi.object({
          oneYear: Joi.number().required(),
          threeYears: Joi.number().required(),
          fiveYears: Joi.number().required(),
        }).required(),
        returns: Joi.object({
          threeMonths: Joi.number().required(),
          sixMonths: Joi.number().required(),
          oneYear: Joi.number().required(),
          threeYears: Joi.number().required(),
          fiveYears: Joi.number().required(),
        }).required(),
        riskCategory: Joi.string().required(),
        minimumInvestment: Joi.number().required().min(1),
      });
      const { error } = validation.validate({
        name,
        shortDescription,
        description,
        cagr,
        returns,
        riskCategory,
        shares,
        minimumInvestment,
        duration,
      });
      if (error)
        return res.status(200).json({
          status: false,
          error: true,
          message: error.details[0].message,
        });

      const dailyChangeFile = req.files.dailyChangeFile[0];
      const fundGraphFile = req.files.fundGraphFile[0];
      const fundImageFile = req.files.fundImageFile[0];

      if (dailyChangeFile) {
        var dailyChange = await csvToJson().fromFile(dailyChangeFile.path);
        console.log(dailyChange);
        const validation = Joi.object({
          dailyChange: Joi.array()
            .items(
              Joi.object({
                x: Joi.string().required(),
                y: Joi.number().required(),
              })
            )
            .required(),
        });
        const { error } = validation.validate({
          dailyChange,
        });
        if (error)
          return res.status(200).json({
            status: false,
            error: true,
            message: error.details[0].message,
          });
      }
      if (fundGraphFile) {
        var fundGraph = await csvToJson().fromFile(fundGraphFile.path);
        console.log(fundGraph);
        const validation = Joi.object({
          fundGraph: Joi.array()
            .items(
              Joi.object({
                x: Joi.string().required(),
                y: Joi.number().required(),
              })
            )
            .required(),
        });
        const { error } = validation.validate({
          fundGraph,
        });
        if (error)
          return res.status(200).json({
            status: false,
            error: true,
            message: error.details[0].message,
          });
      }
      if (fundImageFile) {
        const validation = Joi.object({
          fundImageFile: Joi.string().required(),
        });
        const { error } = validation.validate({
          fundImageFile: fundImageFile.filename,
        });
        if (error)
          return res.status(200).json({
            status: false,
            error: true,
            message: error.details[0].message,
          });
      }

      const fund = await Fund.create({
        _id: req._id,
        name,
        // plan: plan.id,
        shortDescription,
        description,
        duration,
        cagr,
        returns,
        riskCategory,
        trending: trending || false,
        minimumInvestment,
        dailyChange: dailyChangeFile ? dailyChange : null,
        fundGraph: fundGraphFile ? fundGraph : null,
        shares,
        fundGraphFile: fundGraphFile ? fundGraphFile.filename : null,
        dailyChangeFile: dailyChangeFile ? dailyChangeFile.filename : null,
        fundImageFile: fundImageFile ? fundImageFile.filename : null,
      });

      return res.status(200).json({
        status: true,
        error: false,
        message: "Fund created successfully",
        data: fund,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
    }
  }
);

// @route GET /funds
// @desc Get all funds
router.get("/funds", async (req, res) => {
  let { page, size } = req.query;

  if (!page) page = 1;
  if (!size) size = 10;

  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    const funds = await Fund.find().limit(limit).skip(skip);
    const count = await Fund.countDocuments();
    if (funds.length === 0) return res.status(200).json({ status: false, error: true, message: "No Funds Created!" });
    return res.status(200).json({
      status: true,
      error: false,
      message: "Funds fetched successfully",
      data: funds,
      count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

router.post("/new/plan/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
});

// @route GET /funds/:id
// @desc Get fund by id
router.get("/fund/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No fund id provided",
    });
  try {
    const fund = await Fund.findById(req.params.id);
    if (!fund) return res.status(200).json({ status: false, error: true, message: "Fund not found!" });
    return res.status(200).json({
      status: true,
      error: false,
      message: "Fund fetched successfully",
      data: fund,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// @route POST /funds/:id/update
// @desc Update fund
router.post(
  "/update/fund",
  verifyToken,
  requireAdmin,
  fundUpdateUpload.fields([
    {
      name: "dailyChangeFile",
      maxCount: 1,
    },
    {
      name: "fundGraphFile",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    const { todayValue, _id, name, shortDescription, description, riskCategory, trending, minimumInvestment, duration } = req.body;
    const cagr = JSON.parse(req.body.cagr);
    const shares = JSON.parse(req.body.shares);
    const returns = JSON.parse(req.body.returns);
    const todayDate = moment().format("YYYY-MM-DD");

    const validation = Joi.object({
      _id: Joi.string().required(),
      duration: Joi.string(),
      todayValue: Joi.number(),
      name: Joi.string(),
      shares: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          allocation: Joi.number().required(),
          _id: Joi.string(),
        })
      ),
      shortDescription: Joi.string(),
      description: Joi.string(),
      cagr: Joi.object({
        oneYear: Joi.number().required(),
        threeYears: Joi.number().required(),
        fiveYears: Joi.number().required(),
      }),
      returns: Joi.object({
        threeMonths: Joi.number().required(),
        sixMonths: Joi.number().required(),
        oneYear: Joi.number().required(),
        threeYears: Joi.number().required(),
        fiveYears: Joi.number().required(),
      }),
      riskCategory: Joi.string(),
      minimumInvestment: Joi.number().min(1),
      trending: Joi.boolean(),
    });
    const { error } = validation.validate({
      _id,
      todayValue,
      name,
      shortDescription,
      description,
      cagr,
      returns,
      riskCategory,
      minimumInvestment,
      trending,
      shares,
      duration,
    });
    if (error)
      return res.status(200).json({
        status: false,
        error: true,
        message: error.details[0].message,
      });

    console.log({
      _id,
      todayValue,
      name,
      shortDescription,
      description,
      cagr,
      returns,
      riskCategory,
      minimumInvestment,
      trending,
      shares,
    });
    try {
      let fund = await Fund.findById(_id);
      if (!fund)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Fund not found!",
        });
      let foundDate = false;
      fund.dailyChange.map((dailyChange) => {
        if (moment(dailyChange.x).format("YYYY-MM-DD") === todayDate) {
          console.log(moment(dailyChange.x).format("YYYY-MM-DD"), todayDate);
          dailyChange.y = +todayValue;
          foundDate = true;
        }
      });
      if (!foundDate) fund.dailyChange.push({ x: todayDate, y: +todayValue });

      if (req.files) {
        if (req.files.dailyChangeFile) {
          const dailyChangeFile = req.files.dailyChangeFile[0];
          if (dailyChangeFile) {
            var dailyChange = await csvToJson().fromFile(dailyChangeFile.path);
            const validation = Joi.object({
              dailyChange: Joi.array()
                .items(
                  Joi.object({
                    x: Joi.string().required(),
                    y: Joi.number().required(),
                  })
                )
                .required(),
            });
            const { error } = validation.validate({
              dailyChange,
            });
            if (error)
              return res.status(200).json({
                status: false,
                error: true,
                message: error.details[0].message,
              });
            fund.dailyChange = dailyChange;
            fund.dailyChangeFile = dailyChangeFile.filename;
          }
        }
        if (req.files.fundGraphFile) {
          const fundGraphFile = req.files.fundGraphFile[0];
          if (fundGraphFile) {
            var fundGraph = await csvToJson().fromFile(fundGraphFile.path);
            console.log(fundGraph);
            const validation = Joi.object({
              fundGraph: Joi.array()
                .items(
                  Joi.object({
                    x: Joi.string().required(),
                    y: Joi.number().required(),
                  })
                )
                .required(),
            });
            const { error } = validation.validate({
              fundGraph,
            });
            if (error)
              return res.status(200).json({
                status: false,
                error: true,
                message: error.details[0].message,
              });
            fund.fundGraph = fundGraph;
            fund.fundGraphFile = fundGraphFile.filename;
          }
        }
        if (req.files.fundImageFile) {
          const fundImageFile = req.files.fundImageFile[0];
          if (fundImageFile) {
            fund.fundImageFile = fundImageFile.filename;
          }
          const validation = Joi.object({
            fundImageFile: Joi.string().required(),
          });
          const { error } = validation.validate({
            fundImageFile: fundImageFile.filename,
          });
          if (error)
            return res.status(200).json({
              status: false,
              error: true,
              message: error.details[0].message,
            });
        }
      }
      if (fund.name !== name && name !== "") fund.name = name;
      if (fund.duration !== duration && duration !== "") fund.duration = duration;
      if (fund.shortDescription !== shortDescription && shortDescription !== "") fund.shortDescription = shortDescription;
      if (fund.description !== description && description !== "") fund.description = description;
      if (fund.riskCategory !== riskCategory && riskCategory !== "") fund.riskCategory = riskCategory;
      if (fund.minimumInvestment !== minimumInvestment && minimumInvestment > 0) fund.minimumInvestment = minimumInvestment;
      fund.shares = shares;
      fund.cagr = cagr;
      fund.returns = returns;
      fund.trending = trending;

      await fund.save();
      res.status(200).json({
        status: true,
        error: false,
        message: "Fund updated successfully",
        data: fund,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
    }
  }
);

// @route POST /buy
// @desc buy fund
router.post("/buy", verifyToken, async (req, res) => {
  let { id, amount, purchaseType, endDate } = req.body;
  if (!id || !amount || !purchaseType)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Fund id, Purchase Amount and Purchase Type is required",
    });
  const validation = Joi.object({
    id: Joi.string().required(),
    amount: Joi.number().required(),
    purchaseType: Joi.string().required(),
  });
  const { error } = validation.validate({
    amount,
    purchaseType,
    id,
  });
  if (error)
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });
  try {
    const fund = await Fund.findById(id);
    if (!fund) return res.status(200).json({ status: false, error: true, message: "Invalid FUnd ID." });

    if (amount < fund.minimumInvestment)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Minimum Investment is ₹" + fund.minimumInvestment,
      });
    if (purchaseType === "recurring") {
      const userSubs = await Subscription.findOne({
        user: req.user._id,
      });
      if (userSubs) {
        const exists = userSubs.subscriptions.find((s) => s.fund.toString() === id);
        if (exists) {
          if (exists.status === "active")
            return res.status(200).json({
              status: false,
              error: true,
              message: "You have already subscribed to this fund. Please Pay using One time payment.",
            });
        }
      }
      if (amount % fund.minimumInvestment !== 0)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Amount should be multiple of ₹" + fund.minimumInvestment,
        });
      let plansOfUser = await Plan.findOne({ user: req.user._id });
      if (!plansOfUser) plansOfUser = new Plan({ user: req.user._id });
      if (plansOfUser) {
        if (plansOfUser.plans) {
          const planExistsForFund = plansOfUser.plans.find((p) => p.fund === fund._id);
          if (planExistsForFund)
            return res.status(200).json({
              status: false,
              error: true,
              message: "You already have a plan for this fund",
            });
        }
      }
      const plan = await instance.plans.create({
        period: "monthly",
        interval: 1,
        item: {
          name: fund.name,
          amount: +amount * 100,
          currency: "INR",
          description: "Invest in " + fund.name,
        },
        notes: {
          fund: fund._id,
          user: req.user._id,
        },
      });
      if (!plan)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Something went wrong | Plan Creation Failed.",
        });
      if (!plansOfUser) plansOfUser.plans = [];
      plansOfUser.plans.push({
        plan: plan.id,
        fund: fund._id,
        amount: +amount,
      });
      await plansOfUser.save();
      const today = moment().format("YYYY-MM-DD");
      if (!endDate) endDate = moment("2099-12-30").format("YYYY-MM-DD");
      const months = moment(endDate).diff(today, "months");
      if (!months) throw new Error("Invalid End Date");

      const subscription = await instance.subscriptions.create({
        plan_id: plan.id,
        total_count: months,
        expire_by: Math.floor(new Date(endDate).getTime() / 1000),
        customer_notify: 1,
        addons: [
          {
            item: {
              name: "Authorization Charges",
              amount: 100,
              currency: "INR",
              description: "Authorization Charges",
            },
          },
        ],
        notes: {
          fund: fund._id.toString(),
          user: req.user._id.toString(),
          plan: plan.id,
        },
      });
      if (!subscription)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Something went wrong | Subscription Creation Failed.",
        });
      let userSubscription = await Subscription.findOne({
        user: req.user._id,
      });
      if (!userSubscription) {
        userSubscription = new Subscription({
          user: req.user._id,
        });
      }
      const fundExists = userSubscription.subscriptions.find((s) => s.fund.toString() === fund._id.toString());
      if (fundExists) {
        const newSubscriptions = userSubscription.subscriptions.map((s) => {
          if (s.fund.toString() === fund._id.toString()) {
            s.subscription = subscription.id;
            s.endDate = endDate;
            s.status = subscription.status;
            s.amount = +amount;
          }
        });
        userSubscription.subscriptions = newSubscriptions;
      } else {
        userSubscription.subscriptions.push({
          subscription: subscription.id,
          plan: plan.id,
          fund: fund._id,
          endDate: endDate,
          status: subscription.status,
          amount: +amount,
        });
      }
      await userSubscription.save();

      const orderCreation = await Order.create({
        fund: id,
        amount,
        purchaseType,
        user: req.user._id,
        plan: plan.id,
        subscription: subscription.id,
      });
      if (!orderCreation)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Order Creation Failed",
        });

      await orderCreation.save();
      return res.status(200).json({
        status: true,
        error: false,
        recurring: true,
        message: "SIP Order Created.",
        subscription,
        key: process.env.RAZORPAY_API_KEY,
      });
    }
    // !! ONE-TIME FLOW
    const orderCreation = await Order.create({
      fund: id,
      amount,
      purchaseType,
      user: req.user._id,
    });
    if (!orderCreation)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Order Creation Failed",
      });
    console.log(+amount * 100);
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      reciept: orderCreation._id,
    };
    const order = await instance.orders.create(options);
    if (!order)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Order Creation Failed",
      });
    orderCreation.id = order.id;
    await orderCreation.save();
    res.status(200).json({
      status: true,
      error: false,
      recurring: false,
      message: "Order Created.",
      order,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// @route PUT /cancel/:id
// @desc cancel subscription

router.post("/subscription/cancel", verifyToken, async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Subscription ID is required",
    });
  try {
    const subscriptions = await Subscription.findOne({
      user: req.user._id,
    });
    if (!subscriptions)
      return res.status(200).json({
        status: false,
        error: true,
        message: "INo Subscriptions Found.",
      });
    const userData = await User.findById(req.user._id);
    const subscription = subscriptions.subscriptions.find((s) => s.subscription.toString() === id.toString());
    if (!subscription) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });

    const subscription_id = subscription.subscription;
    var total = 0;
    const invoices = await instance.invoices.all({
      subscription_id: subscription_id,
    });
    // if (!invoices)
    //   return res.status(200).json({
    //     status: false,
    //     error: true,
    //     message: "Invoices not found",
    //   });
    for (const invoice of invoices.items) {
      if (invoice.status === "paid") {
        total += invoice.amount_paid / 100;
      }
    }

    const updatedFunds = userData.funds.map((f) => {
      if (f.id.toString() === subscription.fund.toString()) {
        f.invested += total;
        f.recurringTotal = 0;
        total = 0;
        return f;
      }
      return f;
    });
    userData.funds = updatedFunds;
    const updatedSubscriptions = subscriptions.subscriptions.filter((s) => s.subscription.toString() !== id.toString());
    subscriptions.subscriptions = updatedSubscriptions;

    const cancelled = await instance.subscriptions.cancel(id);
    if (!cancelled)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Cancellation Failed.",
      });
    const success = cancelled.status === "cancelled";
    if (!success)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Cancellation Failed.",
      });
    await userData.save();
    await subscriptions.save();
    sendToAdmins({
      title: "Subscription Cancelled",
      message: `User with Mobile: ${userData.phone} has cancelled his subscription for fund: ${subscription.fund} with subscription ID: ${subscription_id}`,
    });

    return res.status(200).json({
      status: true,
      error: false,
      message: "Subscription Cancelled.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

router.post("/subscription/pause", verifyToken, async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Subscription ID is required",
    });
  try {
    const subscriptions = await Subscription.findOne({
      user: req.user._id,
    });
    if (!subscriptions) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    const userData = await User.findById(req.user._id);
    const subscription = subscriptions.subscriptions.find((s) => s.subscription === id);
    if (!subscription) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    if (subscription.status === "created")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Subscription is created, only cancel operation is allowed until it gets active.",
      });
    const paused = await instance.subscriptions.pause(id, {
      pause_at: "now",
    });
    if (!paused)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Pausing Failed.",
      });
    const success = paused.status === "paused";
    if (!success)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Pausing Failed.",
      });
    // const updatedSubscription = subscriptions.subscriptions.filter(
    //   (s) => s.subscription !== id
    // );
    // subscriptions.subscriptions = updatedSubscription;
    // await subscriptions.save();
    sendToAdmins({
      title: "Subscription Paused",
      message: `User with Mobile: ${userData.phone} has cancelled his subscription for fund: ${subscription.fund} with subscription ID: ${id}`,
    });
    return res.status(200).json({
      status: true,
      error: false,
      message: "Subscription Paused.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

router.post("/subscription/resume", verifyToken, async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Subscription ID is required",
    });
  try {
    const subscriptions = await Subscription.findOne({
      user: req.user._id,
    });
    if (!subscriptions) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    const userData = await User.findById(req.user._id);
    const subscription = subscriptions.subscriptions.find((s) => s.subscription === id);
    if (!subscription) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    if (subscription.status === "created")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Subscription is created, only cancel operation is allowed until it gets active.",
      });
    const resumed = await instance.subscriptions.resume(id, {
      resume_at: "now",
    });
    if (!resumed)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Resuming Failed.",
      });
    const success = resumed.status === "active";
    if (!success)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Resuming Failed.",
      });
    // const updatedSubscription = subscriptions.subscriptions.filter(
    //   (s) => s.subscription !== id
    // );
    // subscriptions.subscriptions = updatedSubscription;
    // await subscriptions.save();
    sendToAdmins({
      title: "Subscription Resumed",
      message: `User with Mobile: ${userData.phone} has cancelled his subscription for fund: ${subscription.fund} with subscription ID: ${id}`,
    });
    return res.status(200).json({
      status: true,
      error: false,
      message: "Subscription Resumed.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

router.post("/subscription/sync", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Subscription ID is required",
      });
    const userData = await User.findOne({ _id: req.user._id });
    const subscriptions = await Subscription.findOne({ user: req.user._id });
    if (!subscriptions) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    const subscription = subscriptions.subscriptions.find((s) => s.subscription === id);
    if (!subscription) return res.status(200).json({ status: false, error: true, message: "Invalid Subscription" });
    const updatedSubscription = await instance.subscriptions.fetch(id);
    if (!updatedSubscription)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Something went wrong | Subscription Sync Failed.",
      });
    subscription.status = updatedSubscription.status;
    subscription.paidCounts = updatedSubscription.paid_count;
    subscription.remainingCounts = updatedSubscription.remaining_count;
    let total = 0;
    const invoices = await instance.invoices.all({
      subscription_id: id,
    });
    if (!invoices)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invoices not found",
      });
    for (const invoice of invoices.items) {
      if (invoice.status === "paid") {
        total += invoice.amount_paid / 100;
      }
    }

    const updatedFunds = userData.funds.map((f) => {
      if (f.id.toString() === subscription.fund.toString()) {
        f.recurringTotal = total;
        return f;
      }
      return f;
    });
    userData.funds = updatedFunds;
    await userData.save();
    await subscriptions.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Subscription Synced.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

router.get("/subscription/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Subscription ID is required",
    });
  try {
    const subscription = await instance.subscriptions.fetch(id);
    if (!subscription)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Subscription not found",
      });
    const plan = await instance.plans.fetch(subscription.plan_id);
    res.status(200).json({ status: true, data: subscription, error: false, plan });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

router.get("/subscription/invoices/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "Subscription ID is required",
    });
  try {
    const invoices = await instance.invoices.all({
      subscription_id: id,
    });
    if (!invoices)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invoices not found",
      });
    res.status(200).json({ status: true, data: invoices, error: false });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong.", error: true, status: false });
  }
});

// @route POST /verification
// @desc payment verification
router.post("/verification", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    if (razorpay_subscription_id) {
      const order = await Order.findOne({
        subscription: razorpay_subscription_id,
      });
      if (!order)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Invalid Order ID",
        });
      const body = razorpay_payment_id + "|" + order.subscription;

      const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APT_SECRET).update(body.toString()).digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) return res.status(200).json({ status: false, error: true, message: "Invalid Signature" });

      const subscription = await instance.subscriptions.fetch(order.subscription);
      console.log({ subscription });

      if (!subscription)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Invalid Subscription ID",
        });
      const plan = await instance.plans.fetch(subscription.plan_id);
      order.status = subscription.status;
      order.logs.push({
        status: subscription.status,
        timestamp: subscription.start_at,
        subscriptionId: subscription.id,
      });
      let userData = await User.findOne({
        _id: order.user,
      });
      if (!userData) return res.status(400).send("User not found");
      const userSubscription = await Subscription.findOne({
        user: userData._id,
      });
      if (!userSubscription) return res.status(400).send("User Subscription not found");
      const found = userData.funds.find((f) => f.id.toString() === order.fund.toString());
      if (!found) {
        userData.funds.push({
          id: order.fund,
          recurringTotal: subscription.paid_count * (plan.item.amount / 100),
        });
      } else {
        console.warn("should run this");
        const updatedFunds = userData.funds.map((f) => {
          if (f.id.toString() === order.fund.toString()) {
            f.recurringTotal = (plan.item.amount / 100) * subscription.paid_count;
          }
          return f;
        });
        userData.funds = updatedFunds;
      }
      userData.logs.push({
        status: subscription.status,
        subscription: order.subscription,
        amountPaid: +order.amount,
      });
      const updatedSubscriptions = userSubscription.subscriptions.map((s) => {
        if (s.subscription.toString() === order.subscription.toString()) {
          s.transactions.push({
            status: subscription.status,
            subscription: order.subscription,
            amountPaid: +order.amount,
          });
          s.status = subscription.status;
        }
        return s;
      });
      userData.subscriptions = updatedSubscriptions;
      await userSubscription.save();
      await userData.save();
      await order.save();
      sendToAdmins({
        title: "New Recurring Purchase",
        message: `User with Mobile: ${userData.phone} has made a one-time purchase of ${order.amount} for fund ${order.fund} with subscription ID: ${order.subscription}`,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/success/${order._id}`);
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APT_SECRET).update(body.toString()).digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic)
      return res.status(200).json({
        status: false,
        message: "Invalid Signature",
        error: true,
      });
    const order = await Order.findOne({
      id: razorpay_order_id,
    });
    if (!order)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Order ID",
      });
    const razorpayOrder = await instance.orders.fetch(razorpay_order_id);
    if (!razorpayOrder)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Order ID",
      });
    const userData = await User.findOne({
      _id: order.user,
    });
    const fundExists = userData.funds.find((f) => f.id.toString() === order.fund.toString());
    if (!fundExists) {
      userData.funds.push({
        id: order.fund,
        invested: +order.amount,
      });
    } else {
      const updatedFunds = userData.funds.map((f) => {
        if (f.id.toString() === order.fund.toString()) {
          f.invested = +order.amount;
        }
        return f;
      });
      userData.funds = updatedFunds;
    }

    order.status = razorpayOrder.status;
    order.logs.push({
      status: razorpayOrder.status,
      timestamp: razorpayOrder.created_at,
      orderId: razorpayOrder.id,
      amountPaid: razorpayOrder.amount_paid,
    });
    await order.save();
    await userData.save();
    sendToAdmins({
      title: "New One-Time Purchase",
      message: `User with Mobile: ${userData.phone} has made a one-time purchase of ${order.amount} for fund ${order.fund}`,
    });

    res.redirect(`${process.env.FRONTEND_URL}/success/${order._id}`);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    console.log(req.body);
    console.log(JSON.stringify(req.body, null, 2));
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ status: false, error: true });
    const { fund, user, plan } = payload.subscription.entity.notes;
    if (!fund || !user || !plan) return res.status(400).json({ status: false });
    const fundExists = await Fund.findOne({ _id: fund });
    const userExists = await User.findOne({ _id: user });
    const planExists = await instance.plans.fetch(plan);
    const orderExists = await Order.findOne({
      subscription: payload.subscription.entity.id,
    });
    const userSubscriptions = await Subscription.findOne({ user: user });
    if (!fundExists || !planExists || !userExists || !orderExists || !userSubscriptions) return res.status(400).json({ status: false });
    userExists.logs.push({
      status: payload.subscription.entity.status,
      subscription: payload.subscription.entity.id,
      amountPaid: orderExists.amount,
    });

    const updatedFunds = userExists.funds.map((f) => {
      if (f.id.toString() === fund.toString()) {
        f.recurringTotal = payload.subscription.entity.paid_count * (planExists.item.amount / 100);
      }
      return f;
    });
    userExists.funds = updatedFunds;
    userSubscriptions.subscriptions.map((s) => {
      if (s.subscription.toString() === payload.subscription.entity.id.toString()) {
        s.transactions.push({
          status: payload.subscription.entity.status,
          subscription: payload.subscription.entity.id,
          amountPaid: +orderExists.amount,
        });

        return s;
      }
    });

    console.log({ updatedFunds }, userExists.funds);
    await userExists.save();
    await userSubscriptions.save();
    res.status(200).json({ status: true });
  } catch (e) {
    console.error(e);
    return res.json({ status: false, error: true });
  }
});

router.post("/sync-payments", verifyToken, async (req, res) => {
  try {
    const userSubscriptions = await Subscription.findOne({
      user: req.user._id,
    });
    if (!userSubscriptions)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Subscriptions Found.",
      });
    const userData = await User.findOne({ _id: req.user._id });
    for (const subscription of userSubscriptions.subscriptions) {
      const fund = subscription.fund;
      const subscription_id = subscription.subscription;
      let total = 0;
      const invoices = await instance.invoices.all({
        subscription_id: subscription_id,
      });
      if (!invoices)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Invoices not found",
        });
      for (const invoice of invoices.items) {
        if (invoice.status === "paid") {
          total += invoice.amount_paid / 100;
        }
      }

      const updatedFunds = userData.funds.map((f) => {
        if (f.id.toString() === fund.toString()) {
          f.recurringTotal = total;
          return f;
        }
        return f;
      });
      userData.funds = updatedFunds;
    }
    await userData.save();
    res.status(200).json({ status: true, message: "Success", error: false });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: false, error: true, message: e.message });
  }
});

// router.post("/recurring/verification")

// @route GET /orders
// @desc get all orders
router.get("/orders", verifyToken, requireAdmin, async (req, res) => {
  try {
    let { page, size } = req.query;

    if (!page) page = 1;
    if (!size) size = 10;

    const limit = parseInt(size);
    const skip = (page - 1) * limit;

    const orders = await Order.find({}).populate("fund").populate("user").skip(skip).limit(limit).sort({ createdAt: -1 });

    for (let order of orders) {
      if (order.subscription && order.assigned === false) {
        const subscriptionDetails = await instance.subscriptions.fetch(order.subscription);
        const orderDetails = await Order.findOne({ _id: order._id });
        orderDetails.status = subscriptionDetails.status;
        await orderDetails.save();
        if (subscriptionDetails.paid_count > 0) {
          const userDetails = await User.findOne({ _id: order.user._id });
          const fund = userDetails.funds.find((f) => f.id.toString() === order.fund._id.toString());
          if (fund) {
            fund.recurringTotal = subscriptionDetails.paid_count * order.amount;
          }
          await userDetails.save();
        }
      }
    }

    const count = orders.length;
    res.status(200).json({
      status: true,
      error: false,
      message: "Orders Fetched Successfully",
      data: orders,
      count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// @route GET /orders/:id
// @desc get order by id
router.get("/order/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Order ID is required",
      });
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Order ID",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Order Fetched Successfully",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// @route POST /assign/order
// @desc assign order to user
router.post("/assign/order", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { orderId, allotment } = req.body;
    if (!orderId || !allotment)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Order ID and allotment is required",
      });
    const validation = Joi.object({
      orderId: Joi.string().required(),
      allotment: Joi.number().required(),
    });
    const { error } = validation.validate({
      orderId,
      allotment,
    });
    if (error)
      return res.status(200).json({
        status: false,
        error: true,
        message: error.details[0].message,
      });
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Order ID",
      });
    // if (order.status !== "paid" && order.status !== "created")
    //   return res.status(200).json({
    //     status: false,
    //     error: true,
    //     message: "Order is not paid",
    //   });
    if (order.assigned)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Order is already allotted",
      });
    const user = await User.findById(order.user);
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid User ID",
      });
    const fund = await Fund.findById(order.fund);
    if (!fund)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Fund ID",
      });
    if (!fund.enrolled.includes(user._id)) {
      fund.enrolled.push(user._id);
    }
    const fundDetails = user.funds.find((fund) => fund.id.toString() === order.fund.toString());
    if (!fundDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No fund found with this id",
      });
    fundDetails.marketValue += +allotment;
    // fundDetails.invested += +order.amount;

    user.logs.push({
      status: order.status,
      order: order._id,
      amountPaid: order.amount,
    });
    user.mailbox.push({
      title: "Funds Allotted Successfully.",
      message: `You have been allotted ${allotment} for ${fund.name} at ${moment(fund.createdAt).format("DD-MM-YYYY-HH:mm:ss")}`,
    });
    order.alloted = allotment;
    order.assigned = true;
    await order.save();
    await user.save();
    await fund.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Order Allotted Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// find all subscriptions
router.get("/subscriptions", verifyToken, async (req, res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 10;

  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    if (req.user.isAdmin) {
      const subscriptions = await Subscription.find({})
        .populate({
          path: "subscriptions",
          populate: {
            path: "fund",
          },
        })
        .populate("user")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const count = await Subscription.countDocuments();

      return res.status(200).json({
        status: true,
        error: false,
        message: "Subscriptions Fetched Successfully",
        data: subscriptions,
        count,
      });
    }
    const subscriptions = await Subscription.findOne({
      user: req.user._id,
    }).populate({
      path: "subscriptions",
      populate: {
        path: "fund",
      },
    });
    if (!subscriptions)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Subscriptions Found!",
      });
    const userDetails = await User.findById(req.user._id);
    for (let sub of subscriptions.subscriptions) {
      const subDetails = await instance.subscriptions.fetch(sub.subscription);
      const planDetails = await instance.plans.fetch(subDetails.plan_id);

      sub.status = subDetails.status;
      sub.paidCounts = subDetails.paid_count;
      sub.remainingCounts = subDetails.remaining_count;
      sub.amount = planDetails.item.amount / 100;
      const fundExists = userDetails.funds.find((f) => f.id.toString() === sub.fund._id.toString());
      if (!fundExists) {
        userDetails.funds.push({
          id: sub.fund._id,
          marketValue: 0,
          recurringTotal: +subDetails.paid_count * (planDetails.item.amount / 100),
        });
      } else {
        fundExists.recurringTotal = +subDetails.paid_count * (planDetails.item.amount / 100);
      }
    }
    await userDetails.save();
    await subscriptions.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Subscriptions Fetched Successfully",
      data: subscriptions,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

router.get("/market-values", verifyToken, requireAdmin, async (req, res) => {
  try {
    let { page, size } = req.query;
    if (!page) page = 1;
    if (!size) size = 10;

    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    const userDetails = await User.find()
      .select("funds firstName lastName pan")
      .skip(skip)
      .limit(limit)
      .populate({
        path: "funds",
        populate: {
          path: "id",
        },
      });
    const count = await User.countDocuments();
    if (userDetails.length === 0)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Users Found",
      });

    res.status(200).json({
      status: true,
      error: false,
      message: "Market Values Fetched Successfully",
      data: userDetails,
      count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});
router.put("/market-value", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { user, fund, value } = req.body;
    console.log(req.body);
    if (!user || !fund || isNaN(value))
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Data",
      });
    const userDetails = await User.findById(user);
    if (!userDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid User ID",
      });
    userDetails.funds.forEach((d) => {
      console.log(d.id.toString(), fund, d.id.toString() === fund);
      if (d.id.toString() === fund) {
        d.marketValue = value;
      }
    });
    await userDetails.save();
    // let fundDetails = userDetails.funds.find(
    //   (fund) => fund.id.toString() === fund
    // );

    // console.log(fundDetails);
    // if (!fundDetails)
    //   return res.status(200).json({
    //     status: false,
    //     error: true,
    //     message: "Invalid Fund ID",
    //   });
    // fundDetails.marketValue = value;
    // await userDetails.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Market Value Updated Successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Something went Wrong.",
    });
  }
});

module.exports = router;
