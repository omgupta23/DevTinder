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

const validateprofileedit = (req) => {
  const Useralllowedfield = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "about",
    "skills",
    "gender",
  ];
  const UserAllow = Object.keys(req.body).every((field) =>
    Useralllowedfield.includes(field),
  );
  return UserAllow;
};
module.exports = { validatesignupdata, validateprofileedit };
