const express = require("express");
const router = express.Router();
const roomControllers = require("../controllers/roomControllers");
const authentication = require("../middleware/authentication");

router.get("/", roomControllers.getRooms);

router.post("/", authentication.checkAuth, roomControllers.addRoom);

router.post("/status", roomControllers.changeStat);

module.exports = router;
