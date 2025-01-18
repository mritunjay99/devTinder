const express = require("express");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middleware");
const User = require("../models/user");

const USER_SAFEDATA = "firstName lastName about skills gender photoURL age";

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
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        //you can not directly compare mongoose id using equal operator
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

//api to get the feed for a particular user
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    //we should only show those user with whom the connection request does not exist
    //if the connection request is accepted/rejected we should not show it
    //the user should not see himself in the feed api response

    //getting all the requests which the user has sent or received
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");
    // console.log(connectionRequests);

    const hideUsers = new Set();
    connectionRequests.forEach((req) => {
      hideUsers.add(req.fromUserId);
      hideUsers.add(req.toUserId);
    });
    // console.log(hideUsers);

    //getting all the users who doesn't exist in "hideUsers" set
    const users = await User.find({
      _id: { $nin: Array.from(hideUsers) },
    })
      .select(USER_SAFEDATA)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
