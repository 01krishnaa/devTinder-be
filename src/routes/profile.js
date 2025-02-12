const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user.model");
const {
  validateEditData,
  validatePasswordData,
} = require("../utils/validation");
const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "User profile data", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isDataValid = validateEditData(req);
    if (isDataValid.success == false)
      throw new Error(isDataValid.error.errors[0].message);

    console.log(user._id);
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body);

    res.status(200).json({ message: "User profile data updated", updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isPasswordValid = await user.validatePassword(
      req.body.currentPassword
    );
    if (!isPasswordValid) throw new Error("Wrong current password");

    const isDataValid = validatePasswordData(req);
    if (isDataValid.success == false)
      throw new Error(isDataValid.error.errors[0].message);

    user.password = req.body.newPassword;
    user.save();

    // const updatedUser = await User.findByIdAndUpdate(user._id, {
    //   password: req.body.newPassword,
    // });

    res.status(200).json({ message: "User password updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
