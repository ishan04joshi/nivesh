const express = require("express");
const router = express.Router();
const Withdrawal = require("../schema/Withdrawal");
const User = require("../schema/User");
const Joi = require("joi");
const {
  verifyToken,
  requireAdmin,
  requireSuperAdmin,
  checkProfile,
} = require("../middlewares/tokenVerification");
const { newsUpload } = require("../helpers/multer");
const { sendToAdmins } = require("../helpers");

//Retrieve list of all the withdrawals with pagination
router.get("/", verifyToken, checkProfile, async (req, res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 10;
  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    let news;
    if (req.user.isAdmin)
      news = await Withdrawal.find()
        .limit(limit)
        .skip(skip)
        .populate({
          path: "user",
          select: "firstName lastName email pan",
        })
        .populate({
          path: "fund",
          select: "name",
        })
        .sort({ createdAt: -1 });
    else
      news = await Withdrawal.find({
        user: req.user._id,
      })
        .limit(limit)
        .skip(skip)
        .populate({
          path: "user",
          select: "firstName lastName email pan",
        })
        .populate({
          path: "fund",
          select: "name",
        })
        .sort({ createdAt: -1 });
    if (news.length === 0)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Withdrawal Found!",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawals fetched successfully",
      data: news,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went Wrong.", error: true, status: false });
  }
});

//Delete a withdrawal
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await Withdrawal.findOne({ _id: id });
    if (!news)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No withdrawal found with this id",
      });
    await news.delete();
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawal deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

router.put("/approve", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No withdrawal id provided",
      });
    const withdrawal = await Withdrawal.findOne({ _id: id });
    if (!withdrawal)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No withdrawal found with this id",
      });
    const userDetails = await User.findOne({ _id: withdrawal.user });
    if (!userDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No user found with this id",
      });
    if (withdrawal.status === "approved")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already approved",
      });
    if (withdrawal.status === "rejected")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already rejected",
      });
    const fundDetails = userDetails.funds.find(
      (fund) => fund.id.toString() === withdrawal.fund.toString()
    );
    if (!fundDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No fund found with this id",
      });
    if (fundDetails.marketValue < withdrawal.amount)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Insufficient fund",
      });
    // const prevValue = fundDetails.marketValue;
    fundDetails.marketValue = fundDetails.marketValue - withdrawal.amount;
    // fundDetails.invested = fundDetails.marketValue;
    withdrawal.status = "approved";
    await userDetails.save();
    await withdrawal.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawal approved successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

router.put("/complete", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id, utr } = req.body;
    if (!utr || !id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "UTR & ID of withdrawal is required",
      });
    const withdrawal = await Withdrawal.findOne({ _id: id });
    if (!withdrawal)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No withdrawal found with this id",
      });

    if (withdrawal.status === "pending")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal is pending!",
      });
    if (withdrawal.status === "completed")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already completed",
      });
    if (withdrawal.status === "rejected")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already rejected",
      });
    withdrawal.status = "completed";
    withdrawal.utr = utr;
    await withdrawal.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawal completed successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});
router.put("/rejected", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal is required",
      });
    const withdrawal = await Withdrawal.findOne({ _id: id });
    if (!withdrawal)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No withdrawal found with this id",
      });

    if (withdrawal.status === "completed")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already completed",
      });
    if (withdrawal.status === "rejected")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Withdrawal already rejected",
      });
    withdrawal.status = "rejected";
    await withdrawal.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawal Rejected Successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

//create a withdrawal
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { fund, amount } = req.body;

    const fundDetails = req.user.funds.find(
      (f) => f.id.toString() === fund.toString()
    );
    if (!fundDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Funds not purchase yet",
      });
    if (fundDetails.marketValue < amount)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Insufficient fund",
      });
    const withdrawal = new Withdrawal({
      user: req.user._id,
      fund,
      amount,
      status: "pending",
    });
    await withdrawal.save();
    sendToAdmins({
      title: "New Withdrawal Request",
      message: `User with Mobile: ${req.user.phone} has requested a withdrawal for fund: ${fundDetails.id} of amount: ${amount}.`,
    });
    res.status(200).json({
      status: true,
      error: false,
      message: "Withdrawal created successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

module.exports = router;
