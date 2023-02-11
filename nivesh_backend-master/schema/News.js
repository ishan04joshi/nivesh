const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        image:{
            type: String,
        },
        category: {
            type: String,
            enum: ["Market News", "Important Announcement"],
            default: "Market News",
        },
        date:{
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const news = mongoose.model("news", NewsSchema);
module.exports = news;
