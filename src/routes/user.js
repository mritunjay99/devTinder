const express = require("express");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middleware");

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName skills");
    // populate("fromUserId",["firstName","lastName"]);    //we can use either of line no. 12 & 13

    res.json({
      status: "success",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Errror: " + err.message);
  }
});

module.exports = userRouter;
