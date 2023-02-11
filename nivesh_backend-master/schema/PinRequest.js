const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PinRequestSchema = new Schema(
  {
    phone: { type: String, trim: true },
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

const PinRequest = mongoose.model("pin_requests", PinRequestSchema);

module.exports = PinRequest;
