const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middleware");

// send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //checking whether if the user to whom request is sent,exists in db or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("Invalid user!");
      }

      //checking for appropriate status
      const ALLOWED_STATUS = ["interested", "ignored"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status!");
      }

      //checking whether the connection request exists
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Request already exists");
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      // console.log("before saving");
      const data = await connectionRequest.save();
      // console.log("after saving");
      const message =
        status == "interested"
          ? `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} ignored ${toUser.firstName}`;
      res.json({
        message,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

//accept or reject a connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      // checking whether the logged in user is the same to whom the request is sent.
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Request " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("error: " + err.message);
    }
  }
);

module.exports = requestRouter;
