const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const ratingControllers = require("../controllers/ratingControllers");

router.get("/", ratingControllers.getRatings);

router.post("/", authentication.loginRequired, ratingControllers.review);

module.exports = router;
