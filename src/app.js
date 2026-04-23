const express = require("express");
const app = express();

app.use("/user", [
  (req, res, next) => {
    console.log("Route Handler 1");
    next();
    // res.send("Fetched 1");
  },
  (req, res, next) => {
    console.log("Route Handler 2");
    next();
    // res.send("Fetched 2");
  },

  (req, res, next) => {
    console.log("Route Handler 3");
    res.send("Fetched 3");
  },
]);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
