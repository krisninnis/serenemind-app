import React, { useState } from "react";
import "./App.scss";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Assuming AuthContext is set up

function MoodTracker({ setView }) {
  const [mood, setMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const { token } = useAuth(); // Get token from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return;

    let suggestionText = "Take a deep breath and try a short meditation.";
    if (mood === "anxious")
      suggestionText = "Try a 5-minute breathing exercise.";
    if (mood === "sad")
      suggestionText = "Write down something you’re grateful for.";
    setSuggestion(suggestionText);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/mood/",
        { mood, suggestion: suggestionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Mood saved:", response.data);
    } catch (err) {
      console.error("Failed to save mood:", err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mood Tracker</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>How do you feel?</label>
            <select
              name="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
            >
              <option value="">Select Mood</option>
              <option value="happy">Happy</option>
              <option value="anxious">Anxious</option>
              <option value="sad">Sad</option>
              <option value="calm">Calm</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
        {suggestion && <p>Suggestion: {suggestion}</p>}
        <button onClick={() => setView("home")} className="back-button">
          Back
        </button>
      </header>
    </div>
  );
}

export default MoodTracker;
