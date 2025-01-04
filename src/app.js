const express = require("express");
const { userAuth, adminAuth } = require("./middleware");
const app = express();

app.use("/admin", adminAuth);

// app.use("/user", userAuth);
app.get("/admin/getAllData", (req, res) => {
  res.status(200).send("Sent all data");
});

app.delete("/admin/deleteData", (req, res) => {
  res.status(200).send("Deleted data");
});

//alternatively auth middleware can be used like this
app.get("/user/profile", userAuth, (req, res) => {
  res.status(200).send("User Profile");
});

app.post("/user/save", userAuth, (req, res) => {
  res.status(200).send("User Saved");
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
