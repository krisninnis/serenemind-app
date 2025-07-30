const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

const router = express.Router();

// Register route with email verification
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, dateOfBirth } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token (random hex string)
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Create the user with token and isVerified false
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      isVerified: false,
      verifyToken,
    });

    await newUser.save();

    // Prepare verification URL
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

    // Send verification email
    const message = `
      <h1>Email Verification</h1>
      <p>Hi ${username},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `;

    await sendEmail({
      to: email,
      subject: "SereneMind Journey - Verify Your Email",
      html: message,
    });

    res
      .status(201)
      .json({ message: "User registered. Verification email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Email verification route
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with matching verification token
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    // Mark user as verified and remove token
    user.isVerified = true;
    user.verifyToken = undefined; // or null
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error during email verification." });
  }
});

// Login route (unchanged, but you may want to check isVerified before allowing login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if user is verified
    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
