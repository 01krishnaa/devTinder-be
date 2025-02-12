const { User } = require("../models/user.model");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");
const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const isDataValid = validateSignupData(req);
    if (!isDataValid.success)
      throw new Error(isDataValid.error.errors[0].message);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new Error("User already exists");

    const user = new User(req.body);
    await user.save();

    const token = user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const isDataValid = validateLoginData(req);
    if (isDataValid.success == false)
      throw new Error(isDataValid.error.errors[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValidated = await user.validatePassword(req.body.password);
    if (!isPasswordValidated) throw new Error("Invalid Credentials");

    const token = user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "User loggedin successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
