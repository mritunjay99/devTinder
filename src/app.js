const express = require("express");
require("./models/user");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); //acts as a middleware for converting the incoming req' json object to js object

//get user by email id
app.get("/user", async (req, res) => {
  const userFirstName = req.body.firstName;
  try {
    const user = await User.findOne({ firstName: userFirstName }); //if condition is not passed it will return any arbitary documents
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//feed api -get all the users

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

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
