const router = require("express").Router();
const {
  sendNoReplyVerificationEmail,
  sendEmailOtp,
} = require("../helpers/mailer");
const {
  verifyToken,
  verifyAdmin,
} = require("../middlewares/tokenVerification");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const OTP = require("../schema/OtpRecord");
const jwt = require("jsonwebtoken");
const { upload } = require("../helpers/multer");
const { generateId, uploadEmployee } = require("../helpers");
const path = require("path");
const axios = require("axios");
const { sendSMSOtp } = require("../helpers/sms");
const fs = require("fs");

router.post(
  "/employee",
  generateId,
  upload.fields(uploadEmployee),
  async (req, res) => {}
);
