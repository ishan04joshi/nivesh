const express = require("express");
const app = express();
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 8012;
const { verifyToken } = require("./middlewares/tokenVerification");
const { connectDB } = require("./init_mongodb");
const { createFolders } = require("./helpers/index");
const cookieParser = require("cookie-parser");
require("./helpers/cron");
createFolders();
connectDB();

const whitelist = ["http://localhost:3000", "http://localhost:3001"];
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(morgan("dev"));

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'))
      // }
    },
  })
);

app.use(
  "/assets",
  // verifyToken,
  express.static(path.join(__dirname, "uploads", "users"))
);
app.use(
  "/api/v1",
  // verifyToken,
  express.static(path.join(__dirname, "uploads", "funds"))
);

app.use(
  "/assets",
  // verifyToken,
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1", require("./routes/users"));
app.use("/api/v1", require("./routes/funds"));
app.use("/api/v1/newsletter", require("./routes/newsletter"));
app.use("/api/v1/news", require("./routes/news"));
app.use("/api/v1/withdrawals", require("./routes/withdrawal"));
app.use("/api/v1/watchlist", require("./routes/watchlist"));
app.use("/api/v1/statements", require("./routes/statements"));
app.use("/api/v1/support", require("./routes/support"));

app.get("/", async (req, res) => {
  res.status(200).json({
    error: false,
    status: true,
    message: "HRMS / Route",
  });
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server ${process.pid} Up on ${PORT}`);
});
