const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubsCriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    subscriptions: [
      {
        plan: { type: String },
        subscription: { type: String },
        endDate: String,
        fund: { type: Schema.Types.ObjectId, ref: "Fund" },
        status: { type: String },
        paidCounts: { type: Number },
        remainingCounts: { type: Number },
        amount: { type: Number },
        transactions: [
          {
            status: { type: String },
            subscription: { type: String },
            amountPaid: { type: Number },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const subscription = mongoose.model("subscription", SubsCriptionSchema);
module.exports = subscription;
