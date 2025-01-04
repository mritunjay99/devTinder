const express = require("express");

const app = express();

//Auth middleware

app.use("/admin", (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyzc";
  if (!isAdminAuthorized) {
    res.status(401).send("Admin not authorized!");
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  res.status(200).send("Sent all data");
});

app.delete("/admin/deleteData", (req, res) => {
  res.status(200).send("Deleted data");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
