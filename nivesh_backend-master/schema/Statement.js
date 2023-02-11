const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatementSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    requested: [
      {
        fund: {
          type: Schema.Types.ObjectId,
          ref: "Fund",
        },
        dateType: {
          type: String,
          enum: [
            "custom",
            "Last 1 Month",
            "Last 3 Months",
            "Last 6 Months",
            "Last 1 Year",
          ],
        },
        date: {
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Statements = mongoose.model("statements", StatementSchema);
module.exports = Statements;
