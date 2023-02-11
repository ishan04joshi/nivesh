const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WatchlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fund: [{
            type: Schema.Types.ObjectId,
            ref: "Fund",
        }]
    },
    {
        timestamps: true,
    }
);

const watchlist = mongoose.model("Watchlist", WatchlistSchema);
module.exports = watchlist;
