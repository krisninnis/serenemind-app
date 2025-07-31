// routes/chat.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ OpenAI API Error:");
    console.dir(error, { depth: null }); // Log full error object

    res.status(500).json({
      message: "Something went wrong with OpenAI",
      error: error.message || "Unknown error",
    });
  }
});

module.exports = router;
