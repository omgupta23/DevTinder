const express = require("express");
const userrouter = express.Router();
const { Authanticate } = require("../Middleware/auth");
const ConnectionRequest = require("../model/connectionrequest");
const User = require("../model/user");
const SAFE_USER_DATA = "firstName lastName age gender photoUrl about skills";

userrouter.get("/user/request/recieved", Authanticate, async (req, res) => {
  try {
    const loginuser = req.user;
    const connectionrequest = await ConnectionRequest.find({
      toUserId: loginuser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);
    res.json({
      message: "Request Fetch Successfully",
      data: connectionrequest,
    });
  } catch (err) {
    res.status(400).send("Error:", +err.message);
  }
});

userrouter.get("/user/connection", Authanticate, async (req, res) => {
  try {
    const loginUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loginUser._id, status: "accepted" },
        { fromUserId: loginUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loginUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data: data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userrouter.get("/feed", Authanticate, async (req, res) => {
  //Feed Not Contain - Send , Recieved , Own
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loginUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }],
    }).select("fromUserId toUserId");

    const hideusersformfeed = new Set();
    connectionRequest.forEach((req) => {
      hideusersformfeed.add(req.fromUserId.toString());
      hideusersformfeed.add(req.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideusersformfeed) } },
        { _id: { $ne: loginUser._id } },
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userrouter;
