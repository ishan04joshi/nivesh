const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailBoxSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const MailBox = mongoose.model("mailbox", MailBoxSchema);
module.exports = MailBox;
