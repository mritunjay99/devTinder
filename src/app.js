const express = require("express");
require("./models/user");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); //acts as a middleware for converting the incoming req' json object to js object

app.post("/signup", async (req, res) => {
  //saving data to mongodb
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(401).send("Could not save user details!");
  }
});

connectDb()
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database" + err);
  });
