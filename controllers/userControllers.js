const User = require("../models/userModel");
const userControllers = {};
const bcrypt = require("bcryptjs");

userControllers.createUser = async (req, res) => {
  let { name, email, password, avatarUrl } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exist, please log in");
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({
      name,
      email,
      password,
      avatarUrl,
    });
    const accessToken = await user.generateToken();
    res.status(200).json({
      status: "success",
      data: { user, accessToken },
      message: "User successfully created",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

userControllers.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
      message: "Successfully get user",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

userControllers.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
      message: "Successfully get all data",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

userControllers.changeAuth = async (req, res) => {
  try {
    const { authLevel, userId } = req.body;
    await User.findByIdAndUpdate(
      userId,
      { authLevel: authLevel },
      { new: true }
    );
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
      message: "Successfully change authLevel",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = userControllers;
