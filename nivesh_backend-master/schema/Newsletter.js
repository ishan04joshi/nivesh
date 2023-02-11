const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsletterSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        isSubscribed: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const newsletter = mongoose.model("newsletter", NewsletterSchema);
module.exports = newsletter;
