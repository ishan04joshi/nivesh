const express = require("express");
const router = express.Router();
const Support = require("../schema/Support");
const Joi = require("joi");
const {
  verifyToken,
  requireAdmin,
  requireSuperAdmin,
} = require("../middlewares/tokenVerification");

//Retrieve list of all the supports with pagination
router.get("/all_paged", verifyToken, requireAdmin, async (req, res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 10;
  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    const support = await Support.find().limit(limit).skip(skip).sort({
      createdAt: -1,
    });
    if (support.length === 0)
      return res
        .status(200)
        .json({ status: false, error: true, message: "No News Created!" });
    return res.status(200).json({
      status: true,
      error: false,
      message: "Supports fetched successfully",
      data: support,
    });
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .json({ status: false, error: true, message: "Something went wrong!" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message)
      return res.status(200).json({
        status: false,
        error: true,
        message: "All fields are required!",
      });
    if (String(phone).length < 10)
      return res.status(200).json({
        status: false,
        error: true,
        message: "All fields are required!",
      });
    const support = new Support({
      name,
      email,
      phone,
      message,
    });
    await support.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Support created successfully",
    });
  } catch (e) {
    console.error(e);
    res
      .status(200)
      .json({ status: false, error: true, message: "Something went wrong!" });
  }
});
router.put("/complete", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Request ID is required!",
      });
    const support = await Support.findById(id);
    if (!support)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Support ID not found!",
      });
    support.status = "completed";
    await support.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Support completed successfully",
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ status: false, error: true, message: "Something went wrong!" });
  }
});

module.exports = router;
