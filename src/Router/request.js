const express = require("express");
const { Authanticate } = require("../Middleware/auth");
const requestrooter = express.Router();
const ConnectionRequest = require("../model/connectionrequest");
const User = require("../model/user");

requestrooter.post(
  "/request/send/:status/:toUserId",
  Authanticate,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid Status Type: ${status}` });
      }
      const touser = await User.findById(toUserId);
      if (!touser) {
        throw new Error("User Not found in db");
      }
      const exestingrequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (exestingrequest) {
        return res.status(400).json({ message: "Request already sent" });
      }
      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await newRequest.save();

      res.status(200).json({
        message:
          req.user.firstName +
          " Send Request " +
          status +
          " to " +
          touser.firstName,
      });
    } catch (err) {
      console.log("ERROR:", err);
      return res.status(400).json({ error: err.message });
    }
  },
);

requestrooter.post(
  "/request/review/:status/:requestId",
  Authanticate,
  async (req, res) => {
    try {
      const loginUser = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loginUser,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "Request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      if (data) {
        res.status(200).json({ message: "Request " + status });
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  },
);
module.exports = requestrooter;
