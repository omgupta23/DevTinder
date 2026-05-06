const cookieparser = require("cookie-parser");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const Authanticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decodedData = jwt.verify(token, "DevTinder@123");
    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  Authanticate,
};
