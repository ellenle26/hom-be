const Event = require("../models/eventModel");
const eventControllers = {};

eventControllers.addEvent = async (req, res) => {
  // name: { type: String, required: true },
  // startDate: { type: Date, required: true },
  // endDate: { type: Date, required: true },
  // eventContent: { type: String, required: true },
  try {
    const { name, eventContent, startDate, endDate, posterUrl } = req.body;
    let event = await Event.create({
      name,
      eventContent,
      startDate,
      endDate,
      posterUrl,
    });
    res.status(200).json({
      status: "success",
      data: event,
      message: "Successfully create event",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

eventControllers.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });
    res.status(200).json({
      status: "success",
      data: events,
      message: "Successfully get all events",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

eventControllers.getEventByDate = async (req, res) => {
  try {
    const { date } = req.body;
    console.log(date);
    const events = await Event.aggregate([
      {
        $addFields: {
          stringDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" },
          },
        },
      },
      { $match: { stringDate: date } },
      { $project: { stringDate: 0 } },
    ]);
    console.log(events);
    res.status(200).json({
      status: "success",
      data: events,
      message: "Successfully get events by date",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

eventControllers.editEvent = async (req, res) => {
  try {
    const { id, name, eventContent, startDate, endDate, posterUrl } = req.body;
    console.log(id);
    let event = await Event.findByIdAndUpdate(
      { _id: id.id },
      {
        name,
        eventContent,
        startDate,
        endDate,
        posterUrl,
      }
    );
    res.status(200).json({
      status: "success",
      data: event,
      message: "Successfully edit event",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = eventControllers;
