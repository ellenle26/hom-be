const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = Schema(
  {
    room: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalStay: { type: Number, required: false },
    revenue: { type: Number, required: false },
    bookingPrice: { type: Number, required: false },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, default: "pending" },
    bookingNo: { type: String, default: "" },
    bookingContact: { type: Number, default: 0 },
    userNote: { type: String, default: "" },
    promoCode: { type: String, default: "" },
    bookedBy: { type: String, default: "user" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
