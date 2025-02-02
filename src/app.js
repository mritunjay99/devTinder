const express = require("express");
require("dotenv").config();
require("./utils/scheduleEmail");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

var options = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(options));

app.use(express.json()); //acts as a middleware for converting the incoming req' json object to js object
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

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

const server = http.createServer(app);
initializeSocket(server);

connectDb()
  .then(() => {
    console.log("Connected to database");
    server.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database" + err);
  });
