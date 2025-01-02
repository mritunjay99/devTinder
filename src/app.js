const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req, res) => {
  console.log(req.params);
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

app.get("/users", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
