const express = require("express");
const authrouter = express.Router();
const bcrypt = require("bcrypt");
const { validatesignupdata } = require("../utils/validate");
const User = require("../model/user");
const cookieparser = require("cookie-parser");
const { toDate } = require("validator");

authrouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills } = req.body;
    //validate the signup credential
    validatesignupdata(req);
    //password encrypt form mai convert kareage

    const passwordhash = await bcrypt.hash(password, 10);

    //new insatnce create kiya hai database mai
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
      skills,
    });

    await user.save();
    res.send("SignUp Succesfully");
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Details");
    }

    const isPasswordValid = await user.comparepassword(password);

    if (isPasswordValid) {
      const token = user.getjwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Succesfully");
    } else {
      throw new Error("Password is Not correct");
    }
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

authrouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
  });
  res.send("Loguout Successfully");
});

module.exports = authrouter;
