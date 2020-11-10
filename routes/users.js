const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authentication = require("../middleware/authentication");
const bookingControllers = require("../controllers/bookingControllers");

//register user
router.post("/register", userControllers.createUser);

//get current user
router.get("/", authentication.loginRequired, userControllers.getCurrentUser);

//get all booking by user
router.get(
  "/bookings",
  authentication.loginRequired,
  bookingControllers.getBookingByUser
);

//get all user
router.get(
  "/all",
  authentication.loginRequired,
  authentication.checkAuth,
  userControllers.getUsers
);

//change authlevel
router.put("/auth", userControllers.changeAuth);

module.exports = router;
