require("dotenv").config();
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
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://dev-connect-ui-c6zq.vercel.app"],
    credentials: true,
  }),
);
app.use("/", authrouter);
app.use("/", profilerouter);
app.use("/", requestrooter);
app.use("/", userrooter);

connectDB()
  .then(() => {
    console.log("database connection established");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
