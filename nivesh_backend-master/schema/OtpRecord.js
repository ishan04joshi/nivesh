const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const OtpSchema = new Schema(
  {
    phone: { type: Number, trim: true },
    email: { type: String, trim: true },
    emailOtp: { type: Number, trim: true },
    phoneOtp: { type: Number, trim: true },
    createdAt: { type: Date, expires: "60s", default: Date.now },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
    
    
  },
  {
    timestamps: true,
  },
  {
    strictQuery: true,
  }
);

const OTP = mongoose.model("otp", OtpSchema);

module.exports = OTP;
