const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, required: false, default: "" },
    password: { type: String, required: true, select: false },
    authLevel: { type: String, required: true, default: "user" },
    phone: { type: Number, required: true, default: 0 },
    // ============================================================
    emailVerificationCode: { type: String, select: false, required: false },
    emailVerified: { type: Boolean, require: false, default: false },
  },
  { toJSON: { virtuals: true } },
  { timestamps: true }
);

userSchema.virtual("rating", {
  ref: "Rating",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
