const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    eventContent: { type: String, required: true },
    posterUrl: { type: String, required: true },
    fee: { type: Number, default: 0 },
    status: { type: String, default: "pending" },
    attendees: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
