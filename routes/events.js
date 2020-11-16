const express = require("express");
const router = express.Router();
const eventControllers = require("../controllers/eventControllers");

router.post("/", eventControllers.addEvent);

router.get("/", eventControllers.getEvents);

router.put("/", eventControllers.editEvent);

router.post("/date", eventControllers.getEventByDate);

module.exports = router;
