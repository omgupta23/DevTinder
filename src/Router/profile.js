const express = require("express");
const profilerouter = express.Router();
const { Authanticate } = require("../Middleware/auth");
const { validateprofileedit } = require("../utils/validate");
const bcrypt = require("bcrypt");

profilerouter.get("/profile/view", Authanticate, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profilerouter.patch("/profile/edit", Authanticate, async (req, res) => {
  try {
    if (!validateprofileedit(req)) {
      return res.status(400).send("Invalid Edit");
    }

    const loggedInUser = req.user;

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
});

profilerouter.patch("/profile/password", Authanticate, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      throw new Error("Write an Upadted Password");
    }
    const updatedhash = await bcrypt.hash(password, 10);
    req.user.password = updatedhash;
    req.user.save();
    res.send(`Upadted Password Successfully`);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profilerouter;
