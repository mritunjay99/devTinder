const express = require("express");
const { connectDb } = require("./config/database");
const app = express();

connectDb()
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database"+err);
  });
