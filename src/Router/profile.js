const express = require("express");
const profilerouter = express.Router();
const { Authanticate } = require("../Middleware/auth");
const { validateprofileedit } = require("../utils/validate");
const bcrypt = require("bcrypt");
const upload = require("../Middleware/upload");
const cloudinary = require("../config/cloudinary");
const User = require("../model/user");

profilerouter.get("/profile/view", Authanticate, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profilerouter.patch(
  "/profile/edit",
  Authanticate,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!validateprofileedit(req)) {
        return res.status(400).send("Invalid Edit");
      }

      const loggedInUser = req.user;

      // Upload image if present
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        loggedInUser.photoUrl = result.secure_url;
      }

      // Parse skills array
      if (req.body.skills) {
        req.body.skills = JSON.parse(req.body.skills);
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });

      await loggedInUser.save();

      res.status(200).json({
        message: "Updated successfully",
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

profilerouter.patch("/forgot-password", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Please fill all fields");
    }

    const user = await User.findOne({
      emailId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordhash = await bcrypt.hash(password, 10);

    user.password = passwordhash;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profilerouter;
