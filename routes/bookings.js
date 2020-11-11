const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const bookingControllers = require("../controllers/bookingControllers");

//onwer get all booking
router.get("/", bookingControllers.getBookings);
//owner update payment status
router.post("/", bookingControllers.updateStatus);
//cancel booking
router.put(
  "/pending",
  authentication.loginRequired,
  bookingControllers.cancelPendingBooking
);

//staff update checkin/out status
router.post("/status", bookingControllers.changeStatus);

//user add booking
router.post("/user", bookingControllers.addBooking);

router.post("/payment", bookingControllers.payment);

router.get(
  "/user",
  authentication.loginRequired,
  bookingControllers.getPendingBooking
);

router.put("/entirely", bookingControllers.cancelEBooking);

router.post("/search", bookingControllers.searchBooking);

module.exports = router;
