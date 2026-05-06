const express = require("express");
const authrouter = express.Router();
const bcrypt = require("bcrypt");
const { validatesignupdata } = require("../utils/validate");
const User = require("../model/user");
const cookieparser = require("cookie-parser");
const { toDate } = require("validator");
const upload = require("../Middleware/upload");
const cloudinary = require("../config/cloudinary");

authrouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    let photoUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      photoUrl = result.secure_url;
    }

    // Parse skills
    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];

    const { firstName, lastName, emailId, password, age, gender } = req.body;

    // Validate
    validatesignupdata(req);

    // Hash password
    const passwordhash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
      skills,
      age,
      gender,
      photoUrl,
    });

    await user.save();

    res.send("Signup Successfully");
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparepassword(password);

    if (isPasswordValid) {
      const token = user.getjwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.send(user);
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

authrouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
  });
  res.send("Loguout Successfully");
});

module.exports = authrouter;
