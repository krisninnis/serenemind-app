const express = require("express");
const jwt = require("jsonwebtoken");
const Mood = require("../models/Mood");

const router = express.Router();

// Middleware to verify token and extract user
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

// Create a new mood entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { mood, suggestion } = req.body;
    if (!mood) return res.status(400).json({ message: "Mood is required" });

    const newMood = new Mood({
      user: req.user.userId,
      mood,
      suggestion:
        suggestion || "Take a deep breath and try a short meditation.",
    });

    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all mood entries for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
