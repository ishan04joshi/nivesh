const { default: axios } = require("axios");

const router = require("express").Router();

router.get("/send/notification", async (req, res) => {
  try {
    res.send("done");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
