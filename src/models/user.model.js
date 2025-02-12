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
      default:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/38400b68-0138-4eb2-879a-2c77e55c6b67/dgtk0im-71b11417-5f5c-4f1a-ab80-3b3fb4b236d6.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM4NDAwYjY4LTAxMzgtNGViMi04NzlhLTJjNzdlNTVjNmI2N1wvZGd0azBpbS03MWIxMTQxNy01ZjVjLTRmMWEtYWI4MC0zYjNmYjRiMjM2ZDYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.NX1DyVMujLIh2rni2cqCu842UrduY5W_LUMh70LqfLc",
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
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
