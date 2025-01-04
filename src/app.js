const express = require("express");

const app = express();

//we can have multiple route handlers in one middleware
app.use(
  "/users",
  (req, res, next) => {
    //route handler
    console.log("Response1!!");
    // res.send("hello world!");  // if you send the response right now it won't be able to send the response in 2nd handler.
    next(); // for calling the next route handler we have to use next() function.
  },
  (req, res) => {
    console.log("Response2!!");
    res.send("hello world2!");
  }
);

//wrapping the route handlers inside array won't impact the response , it will remain the same as earlier
app.use("/routes", [
  (req, res, next) => {
    console.log("Route handler 1");
    // res.send("Hello from route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Route handler 2");
    // res.send("Hello from route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("Route handler 3");
    // res.send("Hello from route handler 3");
    next();
  },
  (req, res) => {
    console.log("Route handler 4");
    res.send("Hello from route handler 4");
  },
]);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
