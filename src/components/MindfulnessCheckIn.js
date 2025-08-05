// src/MindfulnessCheckIn.js
import React, { useState } from "react";
import BreathingVideo from "./components/BreathingVideo";
import "./MindfulnessCheckIn.scss";

export default function MindfulnessCheckIn() {
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [gratitude, setGratitude] = useState("");
  const [savedGratitude, setSavedGratitude] = useState(null);

  const handleGratitudeSave = () => {
    if (gratitude.trim()) {
      setSavedGratitude(gratitude.trim());
      setGratitude("");
    }
  };

  return (
    <div className="mindfulness-checkin App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1>Daily Mindfulness Check-in</h1>
        <p>Take a moment to relax and focus today.</p>
      </header>

      <main>
        {!isBreathingActive ? (
          <>
            <section className="breathing-exercise">
              <h2>4-2-6 Breathing Exercise</h2>
              <button
                className="start-breathing-btn"
                onClick={() => setIsBreathingActive(true)}
              >
                Start Breathing Session
              </button>
            </section>

            <section className="gratitude-prompt">
              <h2>Gratitude Prompt</h2>
              <p>What are you grateful for today?</p>
              <textarea
                rows="4"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Write your gratitude here..."
              />
              <br />
              <button onClick={handleGratitudeSave}>Save</button>
              {savedGratitude && (
                <p className="saved-confirmation">
                  Your gratitude has been saved. 💜
                </p>
              )}
            </section>
          </>
        ) : (
          <BreathingVideo onExit={() => setIsBreathingActive(false)} />
        )}
      </main>
    </div>
  );
}
