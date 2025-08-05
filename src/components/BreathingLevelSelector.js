import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelected(option.id);
    // Save choice locally (expand to backend later)
    localStorage.setItem("breathingLevel", option.id);
    localStorage.setItem("breathingDuration", option.duration);
    // After short delay, navigate to Home
    setTimeout(() => {
      navigate("/home");
    }, 600); // 0.6 seconds for UX feedback
  };

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
