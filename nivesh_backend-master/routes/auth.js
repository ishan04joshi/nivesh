"use-strict";
const router = require("express").Router();
const { sendNoReplyVerificationEmail, sendEmailOtp } = require("../helpers/mailer");
const { verifyToken, requireAdmin, requireSuperAdmin } = require("../middlewares/tokenVerification");
const assignCookies = require("../middlewares/assignCookies");
const Joi = require("joi");
const User = require("../schema/User");
const bcrypt = require("bcrypt");
const OTP = require("../schema/OtpRecord");
const jwt = require("jsonwebtoken");
const { upload } = require("../helpers/multer");
const { decodeBase64Image, sendToAdmins } = require("../helpers");
const path = require("path");
const axios = require("axios");
const { sendSMSOtp, sendPinOverSMS } = require("../helpers/sms");
const fs = require("fs");
const { v4 } = require("uuid");
const PendingRegistration = require("../schema/PendingRegistration");
const PinRequest = require("../schema/PinRequest");
const { genId } = require("../middlewares/generateId");

// NEW USER ROUTE
router.put(
  "/update/registration",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "aadharFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "bankDocument", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      firstName,
      lastName,
      country,
      city,
      state,
      address,
      zip,
      bankName,
      bankAccountNo,
      bankIfsc,
      bankBranch,
      bankAccountType,
      pan,
      aadhar,
      nomineeName,
      nomineeRelation,
      nomineeDOB,
    } = req.body;
    console.log(req.body);
    const validation = Joi.object({
      firstName: Joi.string().max(40).required(),
      lastName: Joi.string().required(),
      country: Joi.string().max(40).required(),
      city: Joi.string().max(40).required(),
      state: Joi.string().max(40).required(),
      address: Joi.string().max(150).required(),
      zip: Joi.number().max(999999).required(),
      bankName: Joi.string().max(60).required(),
      bankAccountNo: Joi.number().max(99999999999999).required(),
      bankIfsc: Joi.string().max(10).required(),
      bankBranch: Joi.string().max(30).required(),
      bankAccountType: Joi.string().max(10).required(),
      pan: Joi.string().max(15).required(),
      aadhar: Joi.string().max(15).required(),
      nominee: Joi.object({
        name: Joi.string().max(40).required(),
        relationship: Joi.string().max(40).required(),
        dob: Joi.string().max(150).required(),
      }).required(),
    });

    const { error } = validation.validate({
      firstName,
      lastName,
      country,
      city,
      state,
      address,
      zip,
      bankName,
      bankAccountNo,
      bankIfsc,
      bankBranch,
      bankAccountType,
      pan,
      aadhar,
      nominee: {
        name: nomineeName,
        relationship: nomineeRelation,
        dob: nomineeDOB,
      },
    });
    if (error)
      return res.status(200).json({
        status: false,
        error: true,
        message: error.details[0].message,
      });

    // if (!req.files.aadharFile || !req.files.panFile || !req.files.bankDocument)
    //   return res.status(200).json({
    //     status: false,
    //     error: true,
    //     message: "Please upload all the documents.",
    //   });

    try {
      const userExists = await User.findOne({
        email: req.user.email,
        phone: req.user.phone,
      });
      if (!userExists)
        return res.status(200).json({
          status: false,
          error: true,
          message: "User doesn't Exists. Please Contact Administrator.",
        });

      if (userExists.firstName !== firstName && firstName !== "") {
        userExists.firstName = firstName;
      }
      if (userExists.lastName !== lastName && lastName !== "") userExists.lastName = lastName;
      if (userExists.country !== country && country !== "") userExists.country = country;
      if (userExists.city !== city && city !== "") userExists.city = city;
      if (userExists.state !== state && state !== "") userExists.state = state;
      if (userExists.address !== address && address !== "") userExists.address = address;
      if (userExists.zip !== zip && zip !== 0) userExists.zip = zip;

      if (req.files.bankDocument)
        userExists.bankAccount = {
          document: req.files.bankDocument[0].filename,
        };
      if (req.files.aadharFile)
        userExists.aadhar = {
          file: req.files.aadharFile[0].filename,
        };
      if (req.files.panFile)
        userExists.pan = {
          file: req.files.panFile[0].filename,
        };
      if (userExists.bankAccount.type !== bankAccountType && bankAccountType !== "") userExists.bankAccount.type = bankAccountType;
      if (userExists.bankAccount.name !== bankName && bankName !== "") userExists.bankAccount.name = bankName;
      if (userExists.bankAccount.accountNo !== bankAccountNo && bankAccountNo !== 0) userExists.bankAccount.accountNo = bankAccountNo;
      if (userExists.bankAccount.ifsc !== bankIfsc && bankIfsc !== "") userExists.bankAccount.ifsc = bankIfsc;
      if (userExists.nominee.name !== nomineeName && nomineeName !== "") {
        userExists.nominee.name = nomineeName;
      }
      if (userExists.nominee.relationship !== nomineeRelation && nomineeRelation !== "") {
        userExists.nominee.relationship = nomineeRelation;
      }
      if (userExists.nominee.dob !== nomineeDOB && nomineeDOB !== "" && nomineeDOB) {
        userExists.nominee.dob = nomineeDOB;
      }

      if (userExists.bankAccount.branch !== bankBranch && bankBranch !== "") userExists.bankAccount.branch = bankBranch;
      if (userExists.pan.id !== pan && pan !== "") userExists.pan.id = pan;
      if (userExists.aadhar.id !== aadhar && aadhar !== "") userExists.aadhar.id = aadhar;
      if (req.files.avatar) userExists.avatar = req.files.avatar[0].filename;

      userExists.authenticated = false;
      userExists.verified = false;
      userExists.status = "pending";
      userExists.mailbox.push({
        title: "KYC Verification",
        message: "Your KYC Verification is pending.",
      });
      await userExists.save();

      // userExists.status = "pending";
      // await PendingRegistration.deleteOne({ email, phone });
      const updatedRecords = await User.findOne({
        email: req.user.email,
        phone: req.user.phone,
      }).select("-pin");
      sendToAdmins({
        title: "Profile Update Verification",
        message: `User with Mobile: ${userExists.phone} and Name: ${userExists.firstName} ${userExists.lastName} made changes to his profile. Please verify the changes.`,
      });
      res.status(200).json({
        status: true,
        error: false,
        message: "Profile Updated Successfully.",
        data: updatedRecords,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: false,
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);
// REGISTRATION SEND-OTP
router.post("/register/send-otp", async (req, res) => {
  let { phone, email } = req.body;

  const validation = Joi.object({
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
  });

  const { error } = validation.validate({
    email,
    phone,
  });
  if (error)
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });

  if (!phone.includes("+91")) {
    if (phone.length < 10)
      return res.status(200).json({
        error: true,
        status: false,
        message: "Invalid Phone Number",
      });
  }
  if (phone.includes("+91")) {
    if (phone.length < 13)
      return res.status(200).json({
        error: true,
        status: false,
        message: "Invalid Phone Number",
      });
    phone = String(phone).replace("+91", "");
  }
  const phoneOtp = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const emailOtp = Math.floor(Math.random() * (999999 - 100000) + 100000);
  console.warn({ phone, emailOtp, phoneOtp });
  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(200).json({ error: true, message: "Email Already Exists", status: false });
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(200).json({ error: true, message: "Phone Already Exists", status: false });

    const exists = await OTP.findOne({ phone, email });
    if (exists)
      return res.status(200).json({
        error: true,
        status: false,
        message: "An OTP is already generated for this number or email, Please Wait 1 minute before requesting new.",
      });
    // exists.phoneOtp = phoneOtp;
    // exists.emailOtp = emailOtp;
    // await exists.save();

    await OTP.create({ phone, phoneOtp, email, emailOtp });

    sendSMSOtp(phone.replace("+91", ""), phoneOtp);
    sendEmailOtp(email, emailOtp);

    res.status(200).json({
      status: true,
      error: false,
      message: "Otp Sent Successfully!",
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
// LOGIN OTP
router.post("/login/send-otp", async (req, res) => {
  const { id, pin } = req.body;

  const validation = Joi.object({
    pin: Joi.number().required(),
    id: Joi.string().required(),
  });

  const { error } = validation.validate({
    pin,
    id,
  });
  if (error)
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });
  try {
    let userExists;
    if (isNaN(id)) userExists = await User.findOne({ id });
    if (!isNaN(id)) userExists = await User.findOne({ phone: +id });

    if (!userExists) return res.status(200).json({ status: false, error: true, message: "User Not Found." });

    if (userExists.status === "rejected" || userExists.status === "blocked")
      return res.status(200).json({
        status: false,
        error: true,
        message: "User is Blocked or Rejected. Please Contact Admin!",
      });
    const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    console.warn(otp);

    // if (userExists.status === "pending")
    //   return res.status(200).json({
    //     status: false,
    //     error: true,
    //     message: "User is Pending. Please Wait for Admin Approval!",
    //   });

    const exists = await OTP.findOne({
      phone: userExists.phone,
      email: userExists.email,
    });
    if (exists)
      return res.status(200).json({
        error: true,
        status: false,
        message: "An OTP is already generated for this number or email, Please Wait 1 minute before requesting new.",
      });
    // exists.phoneOtp = otp;
    // exists.emailOtp = otp;
    // await exists.save();

    await OTP.create({
      phone: userExists.phone,
      phoneOtp: otp,
      email: userExists.email,
      emailOtp: otp,
    });

    sendSMSOtp(userExists.phone, otp);
    sendEmailOtp(userExists.email, otp);

    res.status(200).json({
      status: true,
      error: false,
      message: "Otp Sent on Phone & Email.",
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
// REGISTRATION VERIFY-OTP
router.post("/register/verify-otp", genId, async (req, res) => {
  const { phone, phoneOtp, email, emailOtp } = req.body;
  const validation = Joi.object({
    phone: Joi.number().required(),
    phoneOtp: Joi.number().required(),
    email: Joi.string().email().required(),
    emailOtp: Joi.number().required(),
  });

  const { error } = validation.validate({
    phone,
    phoneOtp,
    email,
    emailOtp,
  });
  if (error)
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });

  try {
    const userExists = await User.findOne({
      phone,
      email,
      // status: { $ne: "rejected" },
    });
    if (userExists)
      return res.status(200).json({
        error: true,
        status: false,
        message: "User is already registered with this mobile or email. Please Login using same.",
      });

    const record = await OTP.findOne({ phone, email });
    if (!record)
      return res.status(200).json({
        error: true,
        status: false,
        message: `No OTP Generated For ${phone} & ${email}. Please Regenerate.`,
      });

    if (record.phoneOtp !== parseInt(phoneOtp))
      return res.status(200).json({
        error: true,
        status: false,
        message: "Invalid Phone Number OTP Provided.",
      });
    if (record.emailOtp !== parseInt(emailOtp))
      return res.status(200).json({
        error: true,
        status: false,
        message: "Invalid Email OTP Provided.",
      });
    let id = v4().split("-")[0] + v4().split("-")[1];
    const pin = Math.floor(1000 + Math.random() * 9999);
    const encryptedPin = pin;
    await OTP.deleteOne({ phone, email });
    // await PendingRegistration.create({ phone, email });
    const user = await User.create({
      phone: phone.replace("+91", ""),
      email,
      id,
      _id: req._id,
      pin: encryptedPin,
    });
    user.mailbox.push({
      title: "Registration successful",
      message: "Your registration is successful. Please complete your profile to begin your journey.",
    });
    sendToAdmins({
      title: "New User Onboard",
      message: `User with Mobile: ${phone} and Email: ${email} has been onboard.`,
    });
    await user.save();

    await assignCookies(req, res, user._id);
    sendPinOverSMS(phone.replace("+91", ""), pin);
    res.status(200).json({
      status: true,
      error: false,
      message: "OTP Verified Successfully!",
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

// LOGIN VERIFY-OTP
router.post("/login", async (req, res) => {
  const { id, pin, otp } = req.body;
  const validation = Joi.object({
    id: Joi.string().required(),
    pin: Joi.number().required(),
    otp: Joi.number().required(),
  });
  const { error } = validation.validate({
    id,
    pin,
    otp,
  });
  if (error)
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });

  try {
    let user;
    if (isNaN(id)) user = await User.findOne({ id });
    if (!isNaN(id)) user = await User.findOne({ phone: +id });

    if (!user) return res.status(200).json({ status: false, error: true, message: "User Not Found." });

    if (user.status === "rejected" || user.status === "blocked")
      return res.status(200).json({
        status: false,
        error: true,
        message: "User is Blocked or Rejected. Please Contact Admin.",
      });
 
    const otpDetails = await OTP.findOne({
      phone: user.phone,
      email: user.email,
    });
    if (!otpDetails)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid Request. OTP not generated for this User.",
      });
    if (otpDetails.phoneOtp !== parseInt(otp))
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid  OTP Provided.",
      });
    const isMatch = pin.toString() === user.pin.toString();
    console.log(isMatch);
    if (!isMatch)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Invalid UserID or Pin Provided.",
      });

    await assignCookies(req, res, user._id);
    await OTP.deleteOne({ phone: user.phone, email: user.email });
    const userDetailsWithoutPin = await User.findOne({
      id,
      status: { $ne: "rejected" },
    }).select("-pin");
    res.status(200).json({
      status: true,
      error: false,
      message: "Login Successful",
      data: userDetailsWithoutPin,
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

router.get("/user", verifyToken, async (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please Login Again!",
      });
    const userDetails = await User.findOne({ _id: req.user._id })
      .select("-pin")
      .populate({
        path: "funds",
        populate: {
          path: "id",
        },
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "User Found!",
      data: userDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

//update user mailboxes
router.put("/user/mailbox", verifyToken, async (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please Login Again!",
      });
    const { mailbox } = req.body;
    const validation = Joi.object({
      mailbox: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          message: Joi.string().required(),
        })
      ),
    });
    const { error } = validation.validate({
      mailbox,
    });
    if (error)
      return res.status(200).json({
        status: false,
        error: true,
        message: error.details[0].message,
      });
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { mailbox }, { new: true });
    res.status(200).json({
      status: true,
      error: false,
      message: "Mailbox Updated Successfully!",
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

//discard user mailbox
router.put("/user/mailbox/discard", verifyToken, async (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please Login Again!",
      });
    const { index } = req.body;
    const validation = Joi.object({
      index: Joi.number().required(),
    });
    const { error } = validation.validate({
      index,
    });
    if (error)
      return res.status(200).json({
        status: false,
        error: true,
        message: error.details[0].message,
      });
    const user = await User.findOne({ _id: req.user._id });
    user.mailbox.splice(index, 1);
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Mailbox Discarded Successfully!",
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

//empty user mailbox
router.put("/user/mailbox/empty", verifyToken, async (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please Login Again!",
      });
    const user = await User.findOne({ _id: req.user._id });
    user.mailbox = [];
    await user.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "Mailbox Emptied Successfully!",
      data: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/request/pin/:phone", async (req, res) => {
  try {
    if (!req.params.phone) return res.status(200).json({ status: false, error: true, status: "No Phone Parameter." });
    let exists = await PinRequest.findOne({ phone: req.params.phone });
    if (exists)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Pin Request Already Exists. Please retry after 1 minute.",
      });
    await PinRequest.create({ phone: req.params.phone });
    let user;
    if (isNaN(req.params.phone)) user = await User.findOne({ id: req.params.phone });
    if (!isNaN(req.params.phone)) user = await User.findOne({ phone: req.params.phone });

    if (!user) return res.status(200).json({ status: false, error: true, message: "User Not Found." });
    sendPinOverSMS(user.phone, user.pin).catch((e) => {
      console.log(e);
    });
    sendToAdmins({
      title: "PIN Request",
      message: `User with Mobile: ${req.params.phone} requested his or her PIN.`,
    });
    res.status(200).json({
      status: true,
      error: false,
      message: "Pin Requested Successfully.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/logout", verifyToken, async (req, res) => {
  try {
    if (!req.user)
      return res.status(200).json({
        status: false,
        error: true,
        message: "Please Login Again!",
      });
    res.clearCookie("auth");
    res.clearCookie("refresh");
    res.status(200).json({
      status: true,
      error: false,
      message: "Logged Out Successfully!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: true,
      status: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
