const express = require('express');
const router = express.Router();
const Watchlist = require('../schema/Watchlist');
const Joi = require("joi");
const {
    verifyToken,
    requireAdmin,
    requireSuperAdmin,
} = require("../middlewares/tokenVerification");

//Retrieve list of all the users' watchlist with pagination
router.get('/all_paged', verifyToken, requireAdmin, async (req, res) => {
    let { page, size } = req.query;
    if (!page) page = 1;
    if (!size) size = 10;
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    try {
        const news = await Watchlist.find().limit(limit).skip(skip);
        if (news.length === 0)
            return res
                .status(200)
                .json({ status: false, error: true, message: "No Watchlist Found!" });
        return res.status(200).json({
            status: true,
            error: false,
            message: "News fetched successfully",
            data: news,
        });
    } catch (e) {
        console.log(e);
        res
            .status(200)
            .json({ status: false, error: true, message: "Something went wrong!" });
    }
})

module.exports = router;