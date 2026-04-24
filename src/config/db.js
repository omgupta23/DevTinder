const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://guptaomg23:12345@cluster0.klzizf6.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;
