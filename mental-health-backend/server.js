require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/chat", chatRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Mental Health Backend API is running ✅");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
