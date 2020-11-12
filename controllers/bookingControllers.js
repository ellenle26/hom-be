const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const emailHelper = require("../helpers/email");
const bookingControllers = {};

bookingControllers.addBooking = async (req, res) => {
  //        room: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
  //     checkIn: { type: Date, required: true },
  //     checkOut: { type: Date, required: true },
  //     revenue: { type: Number, required: false },
  //     user: {
  try {
    const { id, price, checkIn, checkOut, userId } = req.body;
    const user = await User.findById(userId);
    let booking;
    const d = new Date();
    let checkInDate = new Date(checkIn);
    if (checkInDate.getDate() == d.getDate() && user.authLevel === "staff") {
      booking = await Booking.create({
        room: id,
        checkIn: checkIn,
        checkOut: checkOut,
        totalStay: (checkOut - checkIn) / (1000 * 3600 * 24),
        revenue: ((checkOut - checkIn) / (1000 * 3600 * 24)) * price,
        bookingPrice: price,
        user: userId,
        bookedBy: user.authLevel,
        status: "paid at counter",
      });
    } else {
      booking = await Booking.create({
        room: id,
        checkIn: checkIn,
        checkOut: checkOut,
        totalStay: (checkOut - checkIn) / (1000 * 3600 * 24),
        revenue: ((checkOut - checkIn) / (1000 * 3600 * 24)) * price,
        bookingPrice: price,
        user: userId,
        bookedBy: user.authLevel,
      });
    }
    res.status(200).json({
      status: "success",
      data: booking,
      message: "Successfully add booking",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.getBookingByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ user: userId }).populate("room");
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Successfully get your bookings",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.payment = async (req, res) => {
  try {
    const { bookingIdList, bookingContact, userNote, promoCode } = req.body;

    const bookingNo = Math.round(Math.random() * 10000000);
    const bookings = await Booking.updateMany(
      { _id: { $in: bookingIdList } },
      {
        status: "processing",
        bookingNo: bookingNo,
        bookingContact: bookingContact,
        userNote: userNote,
        promoCode: promoCode,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Successfully get your bookings",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort([
        ["createdAt", -1],
        ["bookingNo", "descending"],
      ])
      .populate("room")
      .populate("user");
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Successfully get all bookings",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.updateStatus = async (req, res) => {
  try {
    const { email, num, paid } = req.body;
    await Booking.updateMany(
      { bookingNo: num },
      { status: paid },
      { new: true }
    );
    emailHelper.sendBookingConfirmEmail(email, num);
    const bookings = await Booking.find()
      .sort([
        ["createdAt", -1],
        ["bookingNo", "descending"],
      ])
      .populate("room")
      .populate("user");
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Succesffully update booking status",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.changeStatus = async (req, res) => {
  try {
    const { selectedRoomId, date, stat } = req.body;
    console.log(selectedRoomId, date, stat);
    const bookingFilter = await Booking.aggregate([
      {
        $addFields: {
          stringDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$checkIn" },
          },
        },
      },
      { $match: { stringDate: date } },
      { $project: { stringDate: 0 } },
    ]);
    if (bookingFilter.length == 0) {
      throw new Error("There's no booking today");
    }
    const bookingId = bookingFilter.find((item) => item.room == selectedRoomId);
    const booking = await Booking.findByIdAndUpdate(
      { _id: bookingId._id },
      { status: stat },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: booking,
      message: "Successfully update booking",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.cancelPendingBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;
    await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    const bookings = await Booking.find({
      user: userId,
      status: "pending",
    })
      .populate("room")
      .populate("user")
      .exec();
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Successfully update booking",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.getPendingBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({
      user: userId,
      status: "pending",
    })
      .populate("room")
      .populate("user")
      .exec();
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Successfully update booking",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.cancelEBooking = async (req, res) => {
  try {
    const { bookingNo } = req.body;
    await Booking.updateMany(
      { bookingNo: bookingNo },
      { status: "cancelled" },
      { new: true }
    );
    const bookings = await Booking.find()
      .sort([
        ["createdAt", -1],
        ["bookingNo", "descending"],
      ])
      .populate("room")
      .populate("user");
    res.status(200).json({
      status: "success",
      data: bookings,
      message: "Succesffully update booking status",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

bookingControllers.searchBooking = async (req, res) => {
  try {
    const { bookingNo, date } = req.body;
    let bookings = [];
    if (date === null) {
      let bookingNo2 = parseInt(bookingNo);
      let newBookingNo = bookingNo2.toString();
      console.log(newBookingNo);
      if (newBookingNo.length == 9 && newBookingNo.startsWith("9" || "1")) {
        bookings = await Booking.find({
          bookingContact: bookingNo2,
        })
          .populate("room")
          .populate("user");
        res.status(200).json({
          status: "success",
          data: bookings,
          message: "Successfully get your bookings",
        });
      } else {
        bookings = await Booking.find({ bookingNo: bookingNo })
          .populate("room")
          .populate("user");
      }
      res.status(200).json({
        status: "success",
        data: bookings,
        message: "Successfully get your bookings",
      });
    } else if (bookingNo === null) {
      const bookingFilter = await Booking.aggregate([
        {
          $addFields: {
            stringDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$checkIn" },
            },
          },
        },
        { $match: { stringDate: date } },
        { $project: { stringDate: 0 } },
      ]);
      let idList = [];
      for (let i = 0; i < bookingFilter.length; i++) {
        idList.push(bookingFilter[i]._id);
      }
      bookings = await Booking.find({ _id: { $in: idList } })
        .populate("room")
        .populate("user");
      res.status(200).json({
        status: "success",
        data: bookings,
        message: "Successfully get your bookings",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = bookingControllers;
