const express = require("express");
const jwt = require("jsonwebtoken");
const JournalEntry = require("../models/JournalEntry");

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

// Create a new journal entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, time, text } = req.body;
    if (!date || !time || !text)
      return res.status(400).json({ message: "Missing fields" });

    // Validate date format (e.g., YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD" });

    // Validate time format (e.g., HH:MM:SS)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time))
      return res
        .status(400)
        .json({ message: "Invalid time format. Use HH:MM:SS" });

    const newEntry = new JournalEntry({
      user: req.user.userId,
      date,
      time,
      text,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all entries for logged-in user for a specific date
router.get("/:date", authMiddleware, async (req, res) => {
  try {
    const date = req.params.date;
    const entries = await JournalEntry.find({
      user: req.user.userId,
      date,
    }).sort({ time: 1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an entry by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.user.toString() !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await entry.remove();
    res.json({ message: "Entry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
