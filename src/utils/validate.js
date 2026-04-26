const validator = require("validator");

const validatesignupdata = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name Is not Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email Is Not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password Is Inavlid");
  }
};
module.exports = { validatesignupdata };
