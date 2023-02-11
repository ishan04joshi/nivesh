const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
function genId(req, res, next) {
  const id = String(new mongoose.Types.ObjectId());
  req._id = id;
  fs.mkdirSync(path.join(__dirname, "../", "uploads", "users", id));
  next();
}

module.exports = { genId };
