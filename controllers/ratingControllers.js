const Rating = require("../models/ratingModel");
const ratingControllers = {};

ratingControllers.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("room").populate("user");
    res.status(200).json({
      status: "success",
      data: ratings,
      message: "Successfully get ratings",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

ratingControllers.review = async (req, res) => {
  //        room: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
  //     user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  //     rating: { type: Number, required: true },
  //     review: { type: String, default: "" },
  try {
    const userId = req.userId;
    const { roomId, rating, review } = req.body;
    const reviewCreated = await Rating.create({
      room: roomId,
      user: userId,
      rating,
      review,
    });
    res.status(200).json({
      status: "success",
      data: reviewCreated,
      message: "Successfully reviewed",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = ratingControllers;
