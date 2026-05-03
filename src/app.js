const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const connectDB = require("./config/db");
const cookieparser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieparser());

const authrouter = require("./Router/auth");
const profilerouter = require("./Router/profile");
const requestrooter = require("./Router/request");
const userrooter = require("./Router/user");

app.use("/", authrouter);
app.use("/", profilerouter);
app.use("/", requestrooter);
app.use("/", userrooter);

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
