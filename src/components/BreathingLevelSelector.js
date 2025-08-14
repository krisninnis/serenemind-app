import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BreathingLevelSelector.scss";

const options = [
  {
    id: "slow-sloth",
    name: "Slow Sloth",
    duration: 60,
    description:
      "Beginner-friendly, super slow & chill breathing for 1 minute.",
    emoji: "🦥",
  },
  {
    id: "calm-koala",
    name: "Calm Koala",
    duration: 120,
    description:
      "Intermediate level breathing, calming and soothing for 2 minutes.",
    emoji: "🐨",
  },
  {
    id: "zen-zebra",
    name: "Zen Zebra",
    duration: 180,
    description: "Pro level breathing session for total zen in 3 minutes.",
    emoji: "🦓",
  },
];

function BreathingLevelSelector() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch current user preference on mount
  useEffect(() => {
    async function fetchPreference() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to select your breathing level.");
        setLoading(false);
        return;
      }

      if (token === "dev-bypass-token") {
        // For bypass user, load from localStorage only
        const localLevel = localStorage.getItem("breathingLevel");
        setSelected(localLevel || null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/user-preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelected(res.data.breathingSessionLevel || null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load your breathing preference."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPreference();
  }, []);

  // Handle user clicking an option
  const handleSelect = async (option) => {
    setSelected(option.id);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to save preferences.");
      return;
    }

    // Map breathing level to route
    const levelToRoute = {
      "slow-sloth": "/sloth-home",
      "calm-koala": "/koala-home",
      "zen-zebra": "/zebra-home",
    };

    // Update userData in localStorage to reflect selected breathing level
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    userData.breathingLevel = option.id;
    localStorage.setItem("userData", JSON.stringify(userData));

    if (token === "dev-bypass-token") {
      // Save locally only for bypass user
      localStorage.setItem("breathingLevel", option.id);
      localStorage.setItem("breathingDuration", option.duration);
      setTimeout(() => {
        navigate(levelToRoute[option.id] || "/");
      }, 600);
      return;
    }

    try {
      // Save to backend
      await axios.put(
        "/api/user-preferences",
        { breathingSessionLevel: option.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save locally for quick access
      localStorage.setItem("breathingLevel", option.id);
      localStorage.setItem("breathingDuration", option.duration);

      // Navigate after short delay
      setTimeout(() => {
        navigate(levelToRoute[option.id] || "/");
      }, 600);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save breathing preference."
      );
    }
  };

  if (loading) return <p>Loading your breathing preferences...</p>;

  return (
    <div className="breathing-level-selector App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1>Choose Your Breathing Buddy</h1>
        <p>Select an animal to start your mindful journey.</p>
      </header>

      {error && <p className="error-message">{error}</p>}

      <main>
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option.id}
              className={`option-card ${
                selected === option.id ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelect(option);
              }}
            >
              <div className="emoji" aria-label={option.name}>
                {option.emoji}
              </div>
              <h2>{option.name}</h2>
              <p>{option.description}</p>
              <small>
                {Math.floor(option.duration / 60)} minute
                {option.duration > 60 ? "s" : ""}
              </small>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BreathingLevelSelector;
