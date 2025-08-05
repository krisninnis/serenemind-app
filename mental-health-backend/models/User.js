const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    sessionPreferences: {
      type: {
        breathingSessionLevel: { type: String, default: "Slow Sloth" },
        // Add more preferences here if needed later
      },
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
