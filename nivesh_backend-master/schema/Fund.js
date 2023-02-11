const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FundSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      lowercase: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      default: "SHORT",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      lowercase: true,
    },
    cagr: {
      oneYear: { type: Number, default: 0 },
      threeYears: { type: Number, default: 0 },
      fiveYears: { type: Number, default: 0 },
    },
    returns: {
      threeMonths: { type: Number },
      sixMonths: { type: Number },
      oneYear: { type: Number },
      threeYears: { type: Number },
      fiveYears: { type: Number },
    },

    dailyChange: [{ x: { type: Date }, y: { type: Number } }],
    minimumInvestment: {
      type: Number,
      required: true,
    },
    riskCategory: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    shares: [
      {
        name: {
          type: String,
          trim: true,
          // minlength: 3,
        },
        allocation: {
          type: Number,
        },
      },
    ],
    fundGraph: [
      {
        x: { type: Date },
        y: { type: Number },
      },
    ],
    trending: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
    },
    enrolled: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dailyChangeFile: {
      type: String,
    },
    fundGraphFile: {
      type: String,
    },
    fundImageFile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Fund = mongoose.model("Fund", FundSchema);
module.exports = Fund;
