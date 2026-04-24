const express = require("express");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("./config/db");

const app = express();

const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //new insatnce create kiya hai database mai
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Saved In DB");
  } catch (err) {
    res.status(400).send("Eroor In DB");
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
