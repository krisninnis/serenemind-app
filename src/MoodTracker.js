import React, { useState } from "react";
import "./styles/themes/App.scss";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

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
        {/* 👇 Logo added here */}
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />

        <h1>Mood Tracker</h1>
        <p>Select your current mood and get a suggestion.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mood">How do you feel? </label>
            <select
              id="mood"
              name="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              <option value="">Select Mood</option>
              <option value="happy">Happy</option>
              <option value="anxious">Anxious</option>
              <option value="sad">Sad</option>
              <option value="calm">Calm</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit">Submit</button>
          </div>
        </form>

        {suggestion && <p>Suggestion: {suggestion}</p>}

        <div className="button-group">
          <button className="link-button" onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      </header>
    </div>
  );
}

export default MoodTracker;
