const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    facilities: { type: Array, required: true },
    capacity: { type: Number, required: true },
    roomImages: { type: Array, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "ready" },
    ratingCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true } },
  { timestamps: true }
);

roomSchema.virtual("booking", {
  ref: "Booking",
  localField: "_id",
  foreignField: "room",
  justOne: false,
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
