const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const passport = require("passport");

router.post("/login", authControllers.loginWithEmail);

router.post(
  "/login/facebook",
  passport.authenticate("facebook-token"),
  authControllers.loginwithFBorGG
);

router.post(
  "/login/google",
  passport.authenticate("google-token"),
  authControllers.loginwithFBorGG
);

module.exports = router;
