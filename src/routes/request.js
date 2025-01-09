const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware");

// send connection request
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(req.user.firstName + " sent the connection request!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
