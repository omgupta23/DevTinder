const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const User = require("./model/user");
const { validatesignupdata } = require("./utils/validate");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Authanticate } = require("./Middleware/auth");
const app = express();

app.use(express.json());
app.use(cookieparser());
app.delete("/user/", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const UPDATE_ALLOW = [
      "firstName",
      "lastName",
      "age",
      "password",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      UPDATE_ALLOW.includes(key),
    );

    if (!isUpdateAllowed) {
      throw new Error("You can't update these fields");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("Data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const Useremail = req.body.emailId;

  try {
    console.log(Useremail);
    const user = await User.find({ emailId: Useremail });
    if (user.length == 0) {
      res.status(400).send("Usr Not find");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something Went Worng");
  }
});

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Details");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await jwt.sign({ _id: user._id }, "DevTinder@123", {
        expiresIn: "7d",
      });
      //jwt cookie send kareage
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

app.get("/profile", Authanticate, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
