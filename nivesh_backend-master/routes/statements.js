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
const Statements = require("../schema/Statement");

//Retrieve list of all the withdrawals with pagination
router.get("/", verifyToken, checkProfile, async (req, res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 10;
  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    let statements;
    if (req.user.isAdmin)
      statements = await Statements.find()
        .limit(limit)
        .skip(skip)
        .populate({
          path: "user",
          select: "firstName lastName id email pan",
        })
        .sort({ createdAt: -1 });
    else
      statements = await Statements.find({
        user: req.user._id,
      })
        .limit(limit)
        .skip(skip)
        .populate({
          path: "user",
          select: "firstName lastName id email pan",
        })
        .populate({
          path: "requested",
          populate: {
            path: "fund",
          },
        })
        .sort({ createdAt: -1 });
    if (statements.length === 0)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Statement's Requested!",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Requested Statements fetched!",
      data: statements,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went Wrong.", error: true, status: false });
  }
});

router.put("/rejected", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res
        .status(200)
        .json({ message: "Invalid Statement ID.", error: true, status: false });
    const statement = await Statements.findById(id);
    if (!statement)
      return res
        .status(200)
        .json({ message: "Invalid Statement ID.", error: true, status: false });
    if (statement.status !== "pending")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Statement is not Pending!",
      });

    statement.status = "rejected";
    await statement.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Statement Rejected Successfully",
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Something went Wrong.", error: true, status: false });
  }
});
router.put("/completed", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res
        .status(200)
        .json({ message: "Invalid Statement ID.", error: true, status: false });
    const statement = await Statements.findById(id);
    if (!statement)
      return res
        .status(200)
        .json({ message: "Invalid Statement ID.", error: true, status: false });

    if (statement.status !== "pending")
      return res.status(200).json({
        status: false,
        error: true,
        message: "Statement is not Pending!",
      });

    statement.status = "completed";
    await statement.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Statement Completed Successfully",
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Something went Wrong.", error: true, status: false });
  }
});

//create a withdrawal
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { requested } = req.body;
    if (!requested)
      return res.status(200).json({
        message: "All fields are required",
        error: true,
        status: false,
      });
    if (requested.length === 0)
      return res.status(200).json({
        message: "All fields are required",
        error: true,
        status: false,
      });
    let error = false;
    requested.forEach((item) => {
      const { fund, dateType, date } = item;
      if (!fund || !dateType) return (error = true);
      if (dateType === "custom") {
        if (!date) return (error = true);
        if (!date.from || !date.to) return (error = true);
      }
    });
    if (error)
      return res.status(200).json({
        message: "All fields are required",
        error: true,
        status: false,
      });
    const statement = new Statements({
      user: req.user._id,
      requested,
    });
    await statement.save();
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
