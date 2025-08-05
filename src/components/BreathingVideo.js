import React, { useEffect, useState, useRef } from "react";
import "./BreathingVideo.scss";

const BREATH_CYCLE = [
  { text: "Breathe in", duration: 4000 },
  { text: "Hold", duration: 2000 },
  { text: "Breathe out", duration: 6000 },
];
const TOTAL_CYCLE_DURATION = BREATH_CYCLE.reduce(
  (sum, phase) => sum + phase.duration,
  0
);
const TOTAL_DURATION_MS = 3 * 60 * 1000; // 3 minutes

export default function BreathingVideo({ onExit }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const intervalRef = useRef(null);

  // Calculate which phase text to show based on elapsedMs mod cycle length
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedMs((prev) => {
        if (prev >= TOTAL_DURATION_MS) {
          clearInterval(intervalRef.current);
          onExit();
          return prev;
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [onExit]);

  useEffect(() => {
    // Calculate current phase based on elapsedMs % TOTAL_CYCLE_DURATION
    const cycleElapsed = elapsedMs % TOTAL_CYCLE_DURATION;
    let cumulative = 0;
    for (let i = 0; i < BREATH_CYCLE.length; i++) {
      cumulative += BREATH_CYCLE[i].duration;
      if (cycleElapsed < cumulative) {
        setCurrentPhaseIndex(i);
        break;
      }
    }
  }, [elapsedMs]);

  const progressPercent = Math.min((elapsedMs / TOTAL_DURATION_MS) * 100, 100);

  return (
    <div className="breathing-video-overlay">
      <video
        className="breathing-video"
        src="https://cdn.serenemind.app/videos/breathing-session-3min.mp4"
        autoPlay
        muted
        playsInline
        // loop intentionally left off, we handle timing in JS
      />
      <div className="breathing-text">
        <h1>{BREATH_CYCLE[currentPhaseIndex].text}</h1>
      </div>

      <div
        className="progress-bar-container"
        aria-label="Breathing session progress"
      >
        <div
          className="progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <button
        className="exit-button"
        onClick={() => {
          clearInterval(intervalRef.current);
          onExit();
        }}
        aria-label="Exit breathing session"
      >
        ✕ Skip
      </button>
    </div>
  );
}
