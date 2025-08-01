const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_SECRET = process.env.EMAIL_SECRET;
const BASE_URL = process.env.BASE_URL;

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register new user and send verification email
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await user.save();

    // Generate verification token
    const emailToken = jwt.sign({ id: user._id }, EMAIL_SECRET, {
      expiresIn: "1d",
    });
    const url = `${BASE_URL}/api/auth/verify/${emailToken}`;

    // Send verification email
    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email for SereneMind",
      html: `<p>Click the link to verify your email:</p><a href="${url}">${url}</a>`,
    });

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(400).json({ message: "Invalid token or user" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified. You can now log in." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login only if email is verified
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", err });
  }
};
