const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json()); //acts as a middleware for converting the incoming req' json object to js object
app.use(cookieParser())

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

//login api
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!!!");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      res.cookie("token", "dgcbydbfmsdfchdckjdcbasjhdcvdnc");
      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid credentials!!!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", (req, res) => {
  console.log(req.cookies);
  res.send("Welcome to profile page");
});

app.post("/signup", async (req, res) => {
  //saving data to mongodb
  const { firstName, lastName, emailId, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    validateSignUpData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});
//delete api
app.delete("/user", async (req, res) => {
  const userId = req.body.Id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//update user api
app.patch("/user", async (req, res) => {
  const userId = req.body.Id;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "lastName",
      "age",
      "about",
      "skills",
      "photoURL",
      "password",
    ];
    const isallowedUpdate = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });
    if (!isallowedUpdate) {
      throw new Error("Cannot update email!!");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("Updated user successfully!!");
  } catch (err) {
    res.status(400).send("Update failed " + err.message);
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
