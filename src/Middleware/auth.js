const cookieparser = require("cookie-parser");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Authanticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token Not Valid");
    }
    const Decodedata = await jwt.verify(token, "DevTinder@123");
    const { _id } = Decodedata;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Find");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
};
module.exports = {
  Authanticate,
};
