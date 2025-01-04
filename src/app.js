const express = require("express");
const { userAuth, adminAuth } = require("./middleware");
const app = express();

app.get("/users", (req, res) => {
  try {
    throw new Error("Not valid!!");
  } catch (err) {
    res.status(401).send("Not valid!!");
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
