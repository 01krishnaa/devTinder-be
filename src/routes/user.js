const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Request } = require("../models/connectionRequest.model");
const { User } = require("../models/user.model");
const router = express.Router();

const SAFE_DATA = [
  "firstName",
  "lastName",
  "skills",
  "about",
  "age",
  "gender",
  "photoURL",
];

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connections = await Request.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      status: "accepted",
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    if (!connections) throw new Error("No connections");

    res.status(200).json({ message: "All Connections", connections });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const receivedRequests = await Request.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);

    if (!receivedRequests) throw new Error("No Requests");

    res.status(200).json({ message: "All requests", receivedRequests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const requestsOfUser = await Request.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    });

    const hiddenUsers = new Set();

    requestsOfUser.forEach((user) => {
      hiddenUsers.add(user.fromUserId);
      hiddenUsers.add(user.toUserId);
    });

    const usersFeed = await User.find({
      _id: { $nin: Array.from(hiddenUsers) },
    })
      .skip(skip)
      .limit(limit);
    if (!usersFeed) throw new Error("No feed");

    res.status(200).json({ message: "User feed", usersFeed });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
