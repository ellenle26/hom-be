const Room = require("../models/roomModel");
const roomControllers = {};

roomControllers.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("booking").populate("rating");
    res.status(200).json({
      status: "success",
      data: rooms,
      message: "Successfully get all rooms",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// name: { type: String, required: true },
//     description: { type: String, required: true },
//     facilities: { type: Array, required: true },
//     capacity: { type: Number, required: true },
//     roomImages: { type: Array, required: true },
//     price: { type: Number, required: true },

roomControllers.addRoom = async (req, res) => {
  try {
    const {
      name,
      description,
      facilities,
      capacity,
      roomImages,
      price,
    } = req.body;
    const room = await Room.create({
      name,
      description,
      facilities,
      capacity,
      roomImages,
      price,
    });
    res.status(200).json({
      status: "success",
      data: room,
      message: "Successfully created room",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

roomControllers.changeStat = async (req, res) => {
  try {
    const { stat, roomId } = req.body;

    await Room.findByIdAndUpdate(
      { _id: roomId },
      { status: stat },
      { new: true }
    );
    const rooms = await Room.find().populate("booking");
    res.status(200).json({
      status: "success",
      data: rooms,
      message: "Successfully update room status",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

roomControllers.deleteRoom = async (req, res) => {
  try {
    const id = req.body.id;
    const room = await Room.findByIdAndUpdate({ _id: id }, { isDeleted: true });
    res.status(200).json({
      status: "success",
      data: room,
      message: "Successfully deleted room",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

roomControllers.editRoom = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      facilities,
      capacity,
      roomImages,
      price,
    } = req.body;
    const room = await Room.findByIdAndUpdate(
      { _id: id.id },
      { name, description, facilities, capacity, roomImages, price }
    );
    res.status(200).json({
      status: "success",
      data: room,
      message: "Successfully edited room",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = roomControllers;
