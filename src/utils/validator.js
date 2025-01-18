const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Require full name!!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email!!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong!!");
  }
};

const validateEditProfileData = (data) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photoURL",
    "about",
    "gender",
    "skills",
    "age"
  ];
  const isValidEdit = Object.keys(data).every((key) => {
    return ALLOWED_UPDATES.includes(key);
  });
  return isValidEdit;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
