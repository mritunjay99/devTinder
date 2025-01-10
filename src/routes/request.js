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
      console.log("before saving");
      const data = await connectionRequest.save();
      console.log("after saving");
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
