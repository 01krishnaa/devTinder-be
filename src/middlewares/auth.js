const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("No token");

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) throw new Error("Wrong token");
    const { id } = decodedToken;

    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { userAuth };
