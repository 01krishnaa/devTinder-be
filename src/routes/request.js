const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Request } = require("../models/connectionRequest.model");
const { User } = require("../models/user.model");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const { status, toUserId } = req.params;

    const ALLOWED_STATUS = ["ignored", "interested"];
    if (!ALLOWED_STATUS.includes(status)) throw new Error("Wrong status");

    const isUserExists = await User.findById(toUserId);
    if (!isUserExists) throw new Error("Can not send any request");

    const existingConnectionRequest = await Request.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) throw new Error("request already exists");

    const connectionRequest = new Request({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({ message: "request sent", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/request/review/:status/:requestId",userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { status, requestId } = req.params;
    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!ALLOWED_STATUS.includes(status)) throw new Error("Wrong status !!");

    const connectionRequest = await Request.findOne({
      fromUserId: requestId,
      toUserId: user._id,
      status: "interested",
    });

    if (!connectionRequest) throw new Error("Can not find connection request");

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({ message: "request " + status, data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
