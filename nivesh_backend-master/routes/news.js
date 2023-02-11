const express = require("express");
const router = express.Router();
const News = require("../schema/News");
const Joi = require("joi");
const { verifyToken, requireAdmin, requireSuperAdmin } = require("../middlewares/tokenVerification");
const { newsUpload } = require("../helpers/multer");

//Retrieve list of all the news
router.get("/", async (req, res) => {
  try {
    const news = await News.find();
    if (news.length === 0) {
      return res.status(200).json({
        status: false,
        error: true,
        message: "No news found",
      });
    }
    res.status(200).json({
      status: true,
      error: false,
      message: "All News",
      data: news,
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

//Retrieve list of all the news with pagination
router.get("/all_news_paged", verifyToken, requireAdmin, async (req, res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 10;
  const limit = parseInt(size);
  const skip = (page - 1) * limit;
  try {
    const news = await News.find().limit(limit).skip(skip);
    if (news.length === 0) return res.status(200).json({ status: false, error: true, message: "No News Created!" });
    const count = await News.countDocuments();
    return res.status(200).json({
      status: true,
      error: false,
      message: "News fetched successfully",
      data: news,
      count,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went Wrong.", error: true, status: false });
  }
});

// Retrieve a news on the basis of its id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const news = await News.findOne({ _id: id });
    if (!news)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No news found with this id",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "News",
      data: news,
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

//Add a news
router.post("/add", newsUpload.single("image"), async (req, res) => {
  try {
    const { heading, description, category, id, edit } = req.body;
    console.log({ heading, description, category, id, edit });
    if (edit) {
      const validation = Joi.object({
        heading: Joi.string(),
        description: Joi.string(),
        category: Joi.string(),
        id: Joi.string().required(),
      });
      const { error } = validation.validate({
        heading,
        description,
        category,
        id,
      });
      if (error)
        return res.status(200).json({
          status: false,
          error: true,
          message: error.details[0].message,
        });
    } else {
      const validation = Joi.object({
        heading: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
      });
      const { error } = validation.validate({
        heading,
        description,
        category,
      });
      if (error)
        return res.status(200).json({
          status: false,
          error: true,
          message: error.details[0].message,
        });
      if (!req.file)
        return res.status(200).json({
          status: false,
          error: true,
          message: "Please upload an news image!",
        });
    }

    if (edit) {
      if (!id) return res.status(200).json({ status: false, error: true, message: "Please provide news id!" });
      const news = await News.findOne({ _id: id });
      if (!news) return res.status(200).json({ status: false, error: true, message: "No news found with this id!" });
      if (heading && heading.trim() && heading !== news.heading) news.heading = heading;
      if (description && description.trim() && description !== news.description) news.description = description;
      if (category && category.trim() && category !== news.category) news.category = category;

      if (req.file) news.image = req.file.filename;
      await news.save();
      return res.status(200).json({ status: true, error: false, message: "News updated successfully!" });
    }
    const news = new News({
      heading,
      description,
      category,
      image: req.file.filename,
    });
    await news.save();
    res.status(200).json({
      status: true,
      error: false,
      message: "News added successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

//Delete a news
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({ _id: id });
    if (!news)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No news found with this id",
      });
    await news.delete();
    res.status(200).json({
      status: true,
      error: false,
      message: "News deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({
      status: false,
      error: true,
      message: e.message,
    });
  }
});

module.exports = router;
