const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fund: {
      type: Schema.Types.ObjectId,
      ref: "Fund",
    },
    plan: {
      type: String,
    },
    subscription: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ["one-time", "recurring"],
    },
    status: {
      type: String,
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    alloted: {
      type: Number,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    id: {
      type: String,
    },
    assigned: {
      type: Boolean,
      default: false,
    },
    logs: [
      {
        status: String,
        timestamp: Number,
        orderId: String,
        amountPaid: Number,
        subscriptionId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
