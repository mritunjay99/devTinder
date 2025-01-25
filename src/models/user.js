const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //these validators will ony run when new documents or records are created by default, if we want to run validator while updating too , will have to set runValidators to true.
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    about: {
      type: String,
      default: "This is about me!!!",
    },
    skills: {
      type: [String],
      maxLength: 10,
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  //don't use arrow function, as you can't access "this" keyword inside this
  const user = this;
  const token = await jwt.sign({ id: user._id },process.env.JWT_SECRET, {
    expiresIn: "7d", //setting expiry for token
  });
  return token;
};

userSchema.methods.validatePassword = async function (passWordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isValidPassword = await bcrypt.compare(
    passWordInputByUser,
    hashedPassword
  );
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
