const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingRegistrationSchema = new Schema(
  {
    phone: { type: Number, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    createdAt: { type: Date, expires: "1d", default: Date.now },
  },
  {
    timestamps: true,
  }
);

const pending_registration = mongoose.model(
  "pending_registration",
  PendingRegistrationSchema
);
module.exports = pending_registration;
