const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = Schema(
  {
    room: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
