const express = require("express");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middleware");

const USER_SAFEDATA = "firstName lastName about skills gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFEDATA);
    // populate("fromUserId",["firstName","lastName"]);    //we can use either of line no. 12 & 13

    res.json({
      status: "success",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Errror: " + err.message);
  }
});

//api to get the connection requests which are accepted
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFEDATA)
      .populate("toUserId", USER_SAFEDATA);

    const data = requests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {  //you can not directly compare mongoose id using equal operator
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
