const router = require("express").Router();
const {
  verifyToken,
  requireAdmin,
} = require("../middlewares/tokenVerification");
const User = require("../schema/User");

router.get("/users", verifyToken, requireAdmin, async (req, res) => {
  let { page, size } = req.query;

  if (!page) page = 1;
  if (!size) size = 10;

  const limit = parseInt(size);
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().limit(limit).skip(skip).select("-pin");
    const count = await User.countDocuments();
    if (users.length === 0)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Users Found.",
      });
    res.status(200).json({
      status: true,
      error: false,
      data: users,
      count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.post("/user", verifyToken, requireAdmin, async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No User ID Found.",
    });
  try {
    const user = await User.findById(_id)
      .select("-pin")
      .populate({
        path: "funds",
        populate: {
          //populate the fund with the fund schema
          path: "id",
          model: "Fund",
        },
      });
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });

    res.status(200).json({
      status: true,
      error: false,
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/users/pending", verifyToken, requireAdmin, async (req, res) => {
  let { page, size } = req.query;

  if (!page) page = 1;
  if (!size) size = 10;

  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    const users = await User.find({ status: "pending" })
      .limit(limit)
      .skip(skip)
      .select("-pin")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      error: false,
      data: users,
      message: "Users Fetched.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.put("/user/verified", verifyToken, requireAdmin, async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No User ID Found.",
    });
  try {
    const user = await User.findById(_id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    user.status = "approved";
    user.mailbox.push({
      title: "Account Verified",
      message: "Your account has been verified by the admin.",
    });
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.put("/user/reject", verifyToken, requireAdmin, async (req, res) => {
  const { _id, reason } = req.body;
  console.log(req.body);

  if (!_id || !reason)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No User ID Found.",
    });
  try {
    const user = await User.findById(_id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    user.status = "rejected";
    user.reason = ` User with Phone: ${user.phone} & Email: ${user.email} got rejected with Reason: ${reason}`;
    user.phone = 000000000;
    user.email = "rejected";
    await user.save();
    // SEND REJECTION REASON EMAIL
    res.status(200).json({
      status: true,
      error: false,
      message: "User Rejected.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});
router.put("/user/block", verifyToken, requireAdmin, async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No User ID Found.",
    });
  try {
    const user = await User.findById(_id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    user.verified = false;
    user.status = "blocked";
    user.reason = `User with Phone: ${user.phone} & Email: ${user.email} got blocked`;
    await user.save();
    // SEND REJECTION REASON EMAIL
    res.status(200).json({
      status: true,
      error: false,
      message: "User Blocked.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});
router.put("/user/unblock", verifyToken, requireAdmin, async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(200).json({
      status: false,
      error: true,
      message: "No User ID Found.",
    });
  try {
    const user = await User.findById(_id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    if (user.status === "rejected")
      return res.status(200).json({
        status: false,
        error: true,
        message: "User is Rejected and can't be Unblocked.",
      });
    user.status = "approved";
    user.reason = "";
    user.verified = true;
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "User Unblocked.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    res.status(200).json({
      status: true,
      error: false,
      data: user.mailbox,
      message: "Notifications Fetched.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});
router.delete("/notification/:id", verifyToken, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Notification ID Found.",
      });
    const user = await User.findById(req.user._id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    const notifications = user.mailbox.filter(
      (noti) => noti._id.toString() !== req.params.id.toString()
    );
    user.mailbox = notifications;
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Notification Cleared!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});
router.delete("/notifications", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-pin");
    if (!user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No User Found.",
      });
    user.mailbox = [];
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Notifications Cleared!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
