const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const authControllers = {};

authControllers.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "+password");
    if (!user) {
      throw new Error("User doesn't exist, please register");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password!");
    }
    accessToken = await user.generateToken();
    res.status(200).json({
      status: "success",
      data: { user, accessToken },
      message: "Login successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

authControllers.loginwithFBorGG = async (req, res, next) => {
  try {
    let profile = req.user;
    profile.email = profile.email.toLowerCase();
    let user = await User.findOne({ email: profile.email });
    const randomPassword = "" + Math.floor(Math.random() * 10000000);
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(randomPassword, salt);
    if (user) {
      if (!user.emailVerified) {
        user = await User.findByIdAndUpdate(
          user._id,
          { emailVerified: true, avatarUrl: profile.avatarUrl },
          { new: true }
        );
      } else {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: { avatarUrl: profile.avatarUrl },
          },
          { new: true }
        );
      }
    } else {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: newPassword,
        avatarUrl: profile.avatarUrl,
      });
      // await user.save();
    }
    const accessToken = await user.generateToken();
    res.status(200).json({
      status: "success",
      data: { user, accessToken },
      message: "Log in successful",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
    console.log(err.message);
  }
};

module.exports = authControllers;
