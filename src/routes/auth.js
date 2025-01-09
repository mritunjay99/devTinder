const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validator");
const authRouter = express.Router();

//signup api
authRouter.post("/signup", async (req, res) => {
  //saving data to mongodb
  const { firstName, lastName, emailId, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    validateSignUpData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!!!");
    }

    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 604800000) }); //setting expiration for cookie
      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid credentials!!!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
