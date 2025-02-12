const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "User profile data", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
