const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WithdrawlSchema = new Schema(
  {
    fund: {
      type: Schema.Types.ObjectId,
      ref: "Fund",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
      required: true,
    },
    utr: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const withdrawls = mongoose.model("Withdrawls", WithdrawlSchema);
module.exports = withdrawls;
