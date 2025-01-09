const User = require("./models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decoded = await jwt.verify(token, "devTinder@7896");
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Invalid user");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
