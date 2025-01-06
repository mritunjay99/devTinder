const express = require("express");
require("./models/user")
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/user/save",async(req,res)=>{   //saving data to mongodb
 const user=new User({
  firstName:"Mritunjay",
  lastName:"Yadav",
  emailId:"binshuyadav123@gmail.com",
  age:24,
  gender:"Male",
 })

 await user.save();
 res.send("User saved successfully");
})

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
