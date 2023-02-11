const jwt = require("jsonwebtoken");
const User = require("../schema/User");
const assignCookies = require("../middlewares/assignCookies");

async function verifyToken(req, res, next) {
  try {
    // const bearerToken = req.headers.authorization;
    // console.log(req.cookies);
    // console.log("signed", req.signedCookies);
    const { auth, refresh } = req.signedCookies;
    if (!auth && !refresh)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized Code: 1", status: false });
    if (!auth) {
      if (!refresh)
        return res.status(401).json({
          error: true,
          message: "Unauthorized Code: 2",
          status: false,
        });
    }
    if (auth) {
      console.warn("Checking Authentication Token");
      const authDecoded = jwt.verify(auth, process.env.JWT_SECRET);
      if (authDecoded) {
        req.user = await User.findById(authDecoded._id).select("-pin");
        if (!req.user)
          res.status(401).json({
            status: false,
            error: true,
            message: "Invalid User.Code: 3",
          });
        next();
      }
    }
    if (!req.user || !auth) {
      console.warn("Checking Refresh Token");
      const refreshDecoded = jwt.verify(refresh, process.env.JWT_SECRET);
      if (!refreshDecoded)
        return res.status(401).json({
          error: true,
          message: "Unauthorized Code: 4",
          status: false,
        });
      req.user = await User.findById(refreshDecoded._id).select("-pin");
      if (!req.user)
        res.status(401).json({
          status: false,
          error: true,
          message: "Invalid User. Code: 5",
        });
      await assignCookies(req, res, req.user._id);
      next();
    }
    if (!req.user)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized Code: 6", status: false });
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid Token");
  }
}

function requireAdmin(req, res, next) {
  if (req.user.isAdmin) return next();

  return res.status(403).json({
    error: true,
    status: false,
    message: "Not Authorized as Administrator.",
  });
}

function requireSuperAdmin(req, res, next) {
  if (req.user.isSuperAdmin) return next();

  return res.status(403).json({
    error: true,
    status: false,
    message: "Not Authorized as Administrator.",
  });
}

function requireVerified(req, res, next) {
  if (req.user.verified) return next();

  return res.status(200).json({
    error: true,
    status: false,
    message: "Please Verify your account first.",
  });
}


function checkProfile(req, res, next) {
  if (req.user.status === "pending") {
    return res.status(200).json({
      error: true,
      status: false,
      message: "Please Complete your profile first.",
    });
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  requireSuperAdmin,
  requireVerified,
  checkProfile
};
