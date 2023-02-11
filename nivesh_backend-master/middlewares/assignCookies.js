const jwt = require("jsonwebtoken");

const assignCookies = async (req, res, id) => {
  try {
    const accessToken = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const refreshToken = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("auth", accessToken, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: process.env.HTTP_ONLY,
      secure: process.env.SECURE_LOGIN,
      signed: process.env.SIGNED,
      //   sameSite: process.env.SAME_SITE,
      //   path: "/",
      //   domain: process.env.FRONTEND_DOMAIN,
    });
    res.cookie("refresh", refreshToken, {
      expires: new Date(Date.now() + 86400000 * 7),
      httpOnly: process.env.HTTP_ONLY,
      secure: process.env.SECURE_LOGIN,
      signed: process.env.SIGNED,
      //   sameSite: process.env.SAME_SITE,
      //   path: "/",
      //   domain: process.env.FRONTEND_DOMAIN,
    });
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
module.exports = assignCookies;
