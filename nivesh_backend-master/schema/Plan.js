const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    plans: [
      {
        fund: { type: Schema.Types.ObjectId, ref: "Fund" },
        amount: { type: Number },
        plan: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const plan = mongoose.model("plan", PlanSchema);
module.exports = plan;
