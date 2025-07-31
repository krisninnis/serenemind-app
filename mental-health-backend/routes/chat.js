const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

// Use OpenRouter base URL here:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // <-- important!
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // try this model or any from OpenRouter
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
