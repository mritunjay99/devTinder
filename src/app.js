const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
const cors = require("cors");

var options = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials:true
};
app.use(cors(options));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(express.json()); //acts as a middleware for converting the incoming req' json object to js object
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//get user by email id
// app.get("/user", async (req, res) => {
//   const userFirstName = req.body.firstName;
//   try {
//     const user = await User.findOne({ firstName: userFirstName }); //if condition is not passed it will return any arbitary documents
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

//feed api -get all the users

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

//delete api
// app.delete("/user", async (req, res) => {
//   const userId = req.body.Id;
//   try {
//     await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong" + err.message);
//   }
// });

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
