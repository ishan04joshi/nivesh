const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { sendNewsLetter } = require("../helpers/mailer");
const Newsletter = require("../schema/Newsletter");
const { verifyToken, requireAdmin, requireSuperAdmin } = require("../middlewares/tokenVerification");

//Retrieve list of all the newsletter subscribers
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    let { page, size } = req.query;
    if (!page) page = 1;
    if (!size) size = 10;

    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    const subscribers = await Newsletter.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const count = await Newsletter.countDocuments();
    if (subscribers.length === 0)
      return res.status(200).json({
        message: "No subscribers found",
        error: true,
        status: false,
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Subscribers Fetched!",
      data: subscribers,
      count,
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

// Retrieve a user on the basis of its email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No subscriber found with this email",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Subscriber",
      data: subscriber,
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

//Unsubscribe the newsletter
router.get("/unsubscribe/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No subscriber found with this email",
      });
    await Newsletter.deleteOne({ email });
    res.status(200).json({
      status: true,
      error: false,
      message: "Newsletter subscription updated",
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

// Add a user for newsletter
router.post("/add_user", async (req, res) => {
  try {
    const { email } = req.body;
    if (isNaN(email)) {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(200).json({
          status: false,
          error: true,
          message: error.details[0].message,
        });
    } else {
      if (String(email).length !== 10)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Invalid mobile number or Please Don't include country code",
        });
      const schema = Joi.object({
        email: Joi.number().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(200).json({
          status: false,
          error: true,
          message: error.details[0].message,
        });
    }

    const subscriber = await Newsletter.findOne({ email });
    if (subscriber)
      return res.status(200).json({
        status: false,
        error: true,
        message: "This email is already subscribed!",
      });
    await Newsletter.create({ email });
    res.status(200).json({
      status: true,
      error: false,
      message: "Newsletter subscription updated",
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

router.post("/send", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please provide subject and message",
      });
    sendNewsLetter(subject, message);
    res.status(200).json({
      status: true,
      error: false,
      message: "Newsletter sent successfully!",
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
