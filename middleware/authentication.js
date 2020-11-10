const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authentication = {};
const User = require("../models/userModel");

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) {
      throw new Error("Login required");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new Error("Token expired");
        } else {
          throw new Error("Token is invalid");
        }
      }
      // console.log(payload);
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authentication.checkAuth = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.authLevel === "user") {
      throw new Error("Only staff or owner can see this information");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
