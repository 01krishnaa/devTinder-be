const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak");
        }
      },
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      //   enum: ["male", "female", "others"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },

    photoURL: {
      type: String,
      default: process.env.IMAGE_URL,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },

    about: {
      type: String,
      default: "this is default about",
    },

    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function (stringPassword) {
  return await bcrypt.compare(stringPassword, this.password);
};

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
