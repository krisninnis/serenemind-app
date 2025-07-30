const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }, // now required

    // For email verification
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
