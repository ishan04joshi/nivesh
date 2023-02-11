const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, trim: true, lowercase: true },
    lastName: { type: String, trim: true, lowercase: true },
    // dob: { type: Date, required: true },
    phone: { type: Number, required: true, trim: true, unique: true },
    avatar: { type: String, trim: true },
    id: { type: String, trim: true, required: true },
    address: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true, lowercase: true },
    state: { type: String, trim: true, lowercase: true },
    zip: { type: Number, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    aadhar: {
      id: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
      },
      file: { type: String, trim: true },
    },
    pan: {
      id: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
      },
      file: {
        type: String,
        trim: true,
      },
    },
    bankAccount: {
      type: { type: String, trim: true, lowercase: true },
      name: { type: String, trim: true, lowercase: true },
      accountNo: { type: Number, trim: true },
      ifsc: { type: String, trim: true },
      branch: { type: String, trim: true },
      document: { type: String, trim: true },
    },
    verified: { type: Boolean, default: false },
    authenticated: { type: Boolean, default: false },
    pin: { type: Number, trim: true },
    resetPin: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
    reason: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mailbox: [
      {
        title: { type: String, trim: true, lowercase: true },
        message: { type: String, trim: true, lowercase: true },
        date: { type: Date, default: Date.now },
      },
    ],
    funds: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Fund",
        },
        marketValue: { type: Number, default: 0 },
        invested: { type: Number, default: 0 },
        recurringTotal: { type: Number, default: 0 },
      },
    ],
    logs: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        order: {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
        subscription: String,
        amountPaid: Number,
      },
    ],
    nominee: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ["Father", "Mother", "Spouse", "Brother", "Sister", "Other"],
      },
      dob: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
