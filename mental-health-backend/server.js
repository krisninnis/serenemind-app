require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userPreferencesRoutes = require("./routes/userPreferences"); // new import

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/api/user-preferences", userPreferencesRoutes); // new route mount

// Root route
app.get("/", (req, res) => {
  res.send("Mental Health Backend API is running ✅");
});

// MongoDB connection and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));
