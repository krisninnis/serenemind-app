import React, { useState, useEffect } from "react";
import { getBreathingLevel } from "../helpers/getBreathingLevel";
import "./MeditationSession.scss"; // style this however you want

function MeditationSession() {
  const [level, setLevel] = useState("sloth");
  const [breathingVideo, setBreathingVideo] = useState("");
  const [meditationVideo, setMeditationVideo] = useState("");

  useEffect(() => {
    const selected = getBreathingLevel(); // "sloth", "koala", or "zebra"
    setLevel(selected);
    setBreathingVideo(`/media/breathing/${selected}/breathing.mp4`);
    setMeditationVideo(`/media/meditation/${selected}/meditation.mp4`);
  }, []);

  return (
    <div className="meditation-session App">
      <header className="App-header">
        <h1>Your {level.charAt(0).toUpperCase() + level.slice(1)} Session</h1>
        <p>Relax and enjoy your breathing + meditation time 🧘‍♂️</p>
      </header>

      <main>
        <section>
          <h2>Breathing Exercise</h2>
          <video src={breathingVideo} controls width="100%" />
        </section>

        <section>
          <h2>Guided Meditation</h2>
          <video src={meditationVideo} controls width="100%" />
        </section>
      </main>
    </div>
  );
}

export default MeditationSession;
