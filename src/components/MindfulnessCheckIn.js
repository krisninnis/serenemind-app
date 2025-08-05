import React, { useState, useEffect, useRef } from "react";
import "./MindfulnessCheckIn.scss";

const BREATH_CYCLE = [
  { label: "Breathe in", duration: 4000 },
  { label: "Hold", duration: 2000 },
  { label: "Breathe out", duration: 6000 },
];

const READY_SET_BREATH = [
  { label: "Ready", duration: 1000 },
  { label: "Set", duration: 1000 },
  { label: "Breathe", duration: 1000 },
];

const QUOTES = [
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
  },
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Breath is the bridge which connects life to consciousness.",
    author: "Thich Nhat Hanh",
  },
];

// Session length options
const SESSION_OPTIONS = [
  { label: "Slow Sloth", duration: 60 }, // 60 seconds
  { label: "Calm Koala", duration: 120 }, // 2 minutes
  { label: "Zen Zebra", duration: 180 }, // 3 minutes
];

function MindfulnessCheckIn() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inReadySetBreath, setInReadySetBreath] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedSession, setSelectedSession] = useState(SESSION_OPTIONS[0]); // default to Slow Sloth
  const [remainingSeconds, setRemainingSeconds] = useState(
    selectedSession.duration
  );

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Advance breath phases logic
  useEffect(() => {
    if (!isRunning) return;

    let phases = inReadySetBreath ? READY_SET_BREATH : BREATH_CYCLE;

    // When finishing ready-set-breath, switch to main breathing cycle
    if (inReadySetBreath && phaseIndex === phases.length) {
      setInReadySetBreath(false);
      setPhaseIndex(0);
      return;
    }

    if (phaseIndex >= phases.length) {
      // Completed one full breath cycle, reset phase and advance quote
      setPhaseIndex(0);
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setPhaseIndex((prev) => prev + 1);
    }, phases[phaseIndex]?.duration || 0);

    return () => clearTimeout(timeoutRef.current);
  }, [phaseIndex, isRunning, inReadySetBreath]);

  // Countdown timer logic
  useEffect(() => {
    if (isRunning && sessionStarted) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            stopSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, sessionStarted]);

  const startSession = () => {
    setSessionStarted(true);
    setIsRunning(true);
    setInReadySetBreath(true);
    setPhaseIndex(0);
    setQuoteIndex(0);
    setRemainingSeconds(selectedSession.duration);
  };

  const pauseSession = () => {
    setIsRunning(false);
    clearTimeout(timeoutRef.current);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const stopSession = () => {
    setIsRunning(false);
    setSessionStarted(false);
    setInReadySetBreath(true);
    setPhaseIndex(0);
    setQuoteIndex(0);
    setRemainingSeconds(selectedSession.duration);
    clearTimeout(timeoutRef.current);
  };

  // Format remainingSeconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Current phase info
  const currentPhase = inReadySetBreath
    ? READY_SET_BREATH[phaseIndex] || { label: "" }
    : BREATH_CYCLE[phaseIndex] || { label: "" };

  return (
    <div className="mindfulness-checkin">
      {!sessionStarted && (
        <div className="intro-screen" aria-live="polite">
          <h2>Daily Mindfulness Check-in</h2>
          <p>Select your breathing session:</p>
          <div
            className="session-selector"
            role="radiogroup"
            aria-label="Select breathing session length"
          >
            {SESSION_OPTIONS.map(({ label, duration }) => (
              <label
                key={label}
                className={`session-option ${
                  selectedSession.label === label ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="sessionLength"
                  value={label}
                  checked={selectedSession.label === label}
                  onChange={() =>
                    setSelectedSession(
                      SESSION_OPTIONS.find((o) => o.label === label)
                    )
                  }
                />
                {label} ({Math.floor(duration / 60)} min)
              </label>
            ))}
          </div>

          <button className="start-btn" onClick={startSession}>
            Start Breathing Session
          </button>

          {/* Quotes box on intro screen */}
          <div
            className="quote-box"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
          >
            <p className="quote-text">"{QUOTES[quoteIndex].text}"</p>
            <p className="quote-author">— {QUOTES[quoteIndex].author}</p>
          </div>
        </div>
      )}

      {sessionStarted && (
        <div className="session-screen" role="region" aria-live="assertive">
          <div className="timer-remaining" aria-label="Time remaining">
            {formatTime(remainingSeconds)}
          </div>
          <h2 className="phase-label">{currentPhase.label}</h2>
          <div className="breathing-visual" aria-hidden="true">
            <div
              className={`breath-circle ${currentPhase.label
                .toLowerCase()
                .replace(" ", "-")}`}
            ></div>
          </div>

          <div className="controls">
            {!isRunning ? (
              <button className="control-btn" onClick={resumeSession}>
                Resume
              </button>
            ) : (
              <button className="control-btn" onClick={pauseSession}>
                Pause
              </button>
            )}
            <button className="control-btn stop-btn" onClick={stopSession}>
              Stop
            </button>
          </div>

          {/* Quotes box */}
          <div
            className="quote-box"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
          >
            <p className="quote-text">"{QUOTES[quoteIndex].text}"</p>
            <p className="quote-author">— {QUOTES[quoteIndex].author}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MindfulnessCheckIn;
