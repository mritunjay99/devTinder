const express = require("express");

const app = express();

//we can have multiple route handlers in one middleware
app.use(
  "/users",
  (req, res, next) => {       //route handler
    console.log("Response1!!");
    // res.send("hello world!");  // if you send the response right now it won't be able to send the response in 2nd handler.
    next(); // for calling the next route handler we have to use next() function.
  },
  (req, res) => {
    console.log("Response2!!");
    res.send("hello world2!");
  }
);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
