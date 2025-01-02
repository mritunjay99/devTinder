const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello World");
// });
app.use("/hello/2", (req, res) => {
  res.send("Abra ka dabra!!!!");
});

app.use("/hello", (req, res) => {
  res.send("Hello World");
});

app.use("/test", (req, res) => {
  res.send("This is a test");
});

app.use("/hello", (req, res) => {
  res.send("Hello");
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
