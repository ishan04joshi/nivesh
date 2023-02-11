const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupportSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const support = mongoose.model("Support", SupportSchema);
module.exports = support;
