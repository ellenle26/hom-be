const express = require("express");
const router = express.Router();
const roomControllers = require("../controllers/roomControllers");

router.get("/", roomControllers.getRooms);

router.post("/", roomControllers.addRoom);

router.post("/status", roomControllers.changeStat);

module.exports = router;
