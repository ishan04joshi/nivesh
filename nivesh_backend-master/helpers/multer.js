const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      !fs.existsSync(
        path.join(__dirname, "../", "uploads", "users", req.user._id.toString())
      )
    ) {
      fs.mkdirSync(
        path.join(__dirname, "../", "uploads", "users", req.user._id.toString())
      );
    }
    return cb(
      null,
      path.join(__dirname, "../", "uploads", "users", req.user._id.toString())
    );
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "-" +
        Date.now() +
        file.originalname.replace(/\s+/g, "").split(" ").join("")
    );
  },
});

const fundStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(
      null,
      path.join(__dirname, "../", "uploads", "funds", req._id.toString())
    ),
  filename: function (req, file, cb) {
    cb(
      null,
      "-" +
        Date.now() +
        file.originalname.replace(/\s+/g, "").split(" ").join("")
    );
  },
});

const fundUpdate = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(
      null,
      path.join(__dirname, "../", "uploads", "funds", req.body._id.toString())
    ),
  filename: function (req, file, cb) {
    cb(
      null,
      "-" +
        Date.now() +
        file.originalname.replace(/\s+/g, "").split(" ").join("")
    );
  },
});

const newsStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(
      null,
      path.join(__dirname, "../", "uploads")
    ),
  filename: function (req, file, cb) {
    cb(
      null,
      "-" +
        Date.now() +
        file.originalname.replace(/\s+/g, "").split(" ").join("")
    );
  },
});
const upload = multer({ storage: storage });
const fundUpload = multer({ storage: fundStorage });
const fundUpdateUpload = multer({ storage: fundUpdate });
const newsUpload = multer({ storage: newsStorage });

module.exports = { upload, fundUpload, fundUpdateUpload,newsUpload };
