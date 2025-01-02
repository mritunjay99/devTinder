const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

app.post("/user", (req, res) => {
  console.log("Saved user successfully!!");
  res.send("User saved successfully");
});

app.delete("/user", (req, res) => {
  console.log("User deleted successfully!!");
  res.send("User deleted!!");
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
