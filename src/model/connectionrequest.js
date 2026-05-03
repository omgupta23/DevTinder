const mongoose = require("mongoose");
const User = require("./user");
const ConnectionShema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: ` Invalid Satutus `,
    },
  },
});
ConnectionShema.pre("save", async function () {
  if (!this.fromUserId || !this.toUserId) {
    throw new Error("Missing user IDs");
  }

  if (this.fromUserId.toString() === this.toUserId.toString()) {
    throw new Error("Can't send request to yourself");
  }
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  ConnectionShema,
);

module.exports = ConnectionRequestModel;
