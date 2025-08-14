import React, { useState, useEffect, useRef } from "react";
import "./KoalaCheckIn.scss";

const BREATHING_CYCLE = [
  { label: "Breathe in", duration: 4 },
  { label: "Hold", duration: 2 },
  { label: "Breathe out", duration: 6 },
];

const KOALA_QUOTES = [
  "“The best way out is always through.” – Robert Frost",
  "“Almost everything will work again if you unplug it for a few minutes, including you.” – Anne Lamott",
  "“Stillness is where creativity and solutions are found.” – Eckhart Tolle",
  "“Peace comes from within. Do not seek it without.” – Buddha",
];

function KoalaCheckIn({ userData: passedUserData }) {
  const [userData, setUserData] = useState(passedUserData || null);
  const [phase, setPhase] = useState("intro");
  const [instruction, setInstruction] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(3);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(600);
  const [pulse, setPulse] = useState(false);

  const intervalRef = useRef(null);
  const quoteIntervalRef = useRef(null);
  const breathingVideoRef = useRef(null);
  const meditationVideoRef = useRef(null);
  const containerRef = useRef(null);

  // --------------------------
  // SCORING & STREAK SYSTEM
  // --------------------------
  const [score, setScore] = useState(() =>
    parseInt(localStorage.getItem("koalaScore") || "0")
  );
  const [streak, setStreak] = useState(() =>
    parseInt(localStorage.getItem("koalaStreak") || "0")
  );
  const [lastActiveDate, setLastActiveDate] = useState(
    () => localStorage.getItem("koalaLastActiveDate") || null
  );
  const [status, setStatus] = useState(
    () => localStorage.getItem("koalaStatus") || "Koala"
  );

  // Save scoring/streak/status
  useEffect(() => {
    localStorage.setItem("koalaScore", score);
    localStorage.setItem("koalaStreak", streak);
    localStorage.setItem("koalaLastActiveDate", lastActiveDate || "");
    localStorage.setItem("koalaStatus", status);
  }, [score, streak, lastActiveDate, status]);

  // Load user data
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (!userData && savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, [userData]);

  // Rotate quotes every 20s
  useEffect(() => {
    quoteIntervalRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % KOALA_QUOTES.length);
    }, 20000);
    return () => clearInterval(quoteIntervalRef.current);
  }, []);

  // Update daily streak
  const updateDailyStreak = () => {
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      if (lastActiveDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActiveDate === yesterday.toDateString()) {
          setStreak((prev) => prev + 1);
        } else {
          setStreak(1);
        }
      } else setStreak(1);
      setLastActiveDate(today);
    }
  };

  // Check for Zen Zebra upgrade
  const checkRankUpgrade = () => {
    if (streak >= 10 || score >= 120) {
      setStatus("Zen Zebra");
    }
  };

  // Pulse animation trigger
  const triggerPulse = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  // Handle session completions
  const handleBreathingCompletion = () => {
    setScore((prev) => prev + 10);
    updateDailyStreak();
    checkRankUpgrade();
    triggerPulse();
    setPhase("done");
  };

  const handleMeditationCompletion = () => {
    setScore((prev) => prev + 20);
    updateDailyStreak();
    checkRankUpgrade();
    triggerPulse();
    setPhase("done");
  };

  // Pre-breathing countdown
  useEffect(() => {
    if (phase === "pre-breathing" && prepCountdown > 0) {
      const timer = setTimeout(
        () => setPrepCountdown((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (phase === "pre-breathing" && prepCountdown === 0) {
      startBreathingSession();
    }
  }, [phase, prepCountdown]);

  // Pre-meditation countdown
  useEffect(() => {
    if (phase === "pre-meditation" && prepCountdown > 0) {
      const timer = setTimeout(
        () => setPrepCountdown((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (phase === "pre-meditation" && prepCountdown === 0) {
      setPhase("meditation");
    }
  }, [phase, prepCountdown]);

  // Breathing session logic
  useEffect(() => {
    if (phase !== "breathing" || isPaused || timeLeft <= 0) return;

    if (breathingVideoRef.current && breathingVideoRef.current.paused) {
      breathingVideoRef.current.play().catch(() => {});
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        const nextIndex = (cycleIndex + 1) % BREATHING_CYCLE.length;
        setCycleIndex(nextIndex);
        setInstruction(BREATHING_CYCLE[nextIndex].label);
        return BREATHING_CYCLE[nextIndex].duration;
      });
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [phase, isPaused, cycleIndex, timeLeft]);

  // Pause/resume breathing video
  useEffect(() => {
    if (!breathingVideoRef.current) return;
    if (isPaused) {
      breathingVideoRef.current.pause();
    } else if (phase === "breathing") {
      breathingVideoRef.current.play().catch(() => {});
    }
  }, [isPaused, phase]);

  // End breathing session
  useEffect(() => {
    if (timeLeft === 0 && phase === "breathing") {
      handleBreathingCompletion();
      breathingVideoRef.current?.pause();
    }
  }, [timeLeft, phase]);

  // Meditation timer
  useEffect(() => {
    if (phase !== "meditation" || !meditationVideoRef.current) return;

    setMeditationTimeLeft(600);

    const handleTimeUpdate = () => {
      if (!meditationVideoRef.current) return;
      const remaining = Math.ceil(
        meditationVideoRef.current.duration -
          meditationVideoRef.current.currentTime
      );
      setMeditationTimeLeft(Math.max(remaining, 0));
    };

    meditationVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      meditationVideoRef.current?.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );
    };
  }, [phase]);

  // Autoplay meditation video
  useEffect(() => {
    if (phase === "meditation" && meditationVideoRef.current) {
      meditationVideoRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Spacebar toggle for videos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (phase === "breathing" && breathingVideoRef.current) {
          if (breathingVideoRef.current.paused) {
            breathingVideoRef.current.play();
            setIsPaused(false);
          } else {
            breathingVideoRef.current.pause();
            setIsPaused(true);
          }
        } else if (phase === "meditation" && meditationVideoRef.current) {
          if (meditationVideoRef.current.paused) {
            meditationVideoRef.current.play();
          } else {
            meditationVideoRef.current.pause();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startBreathing = () => {
    setPrepCountdown(3);
    setPhase("pre-breathing");
  };

  const startBreathingSession = () => {
    setPhase("breathing");
    setInstruction(BREATHING_CYCLE[0].label);
    setCountdown(BREATHING_CYCLE[0].duration);
    setCycleIndex(0);
    setTimeLeft(120);
    setIsPaused(false);

    if (breathingVideoRef.current) {
      breathingVideoRef.current.currentTime = 0;
      breathingVideoRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => setIsPaused(true);
  const handlePlay = () => setIsPaused(false);
  const handleStop = () => {
    clearInterval(intervalRef.current);
    setPhase("intro");
    setTimeLeft(120);
    setInstruction("");
    setCountdown(0);
    setCycleIndex(0);
    setPrepCountdown(3);
    setMeditationTimeLeft(600);
    setSessionComplete(false);
    setIsPaused(false);
    breathingVideoRef.current?.pause();
    breathingVideoRef.current && (breathingVideoRef.current.currentTime = 0);
    meditationVideoRef.current?.pause();
    meditationVideoRef.current && (meditationVideoRef.current.currentTime = 0);
  };

  const handleFullscreen = () => containerRef.current?.requestFullscreen();
  const handleMeditationStart = () => {
    setPrepCountdown(3);
    setPhase("pre-meditation");
  };

  if (!userData) return <p>Please log in to access this feature.</p>;

  return (
    <div className="koala-checkin-container" ref={containerRef}>
      <img src="/serene-mind-logo.png" alt="SereneMind Logo" className="logo" />

      <div className="quote">{KOALA_QUOTES[quoteIndex]}</div>

      {/* USER STATS DISPLAY WITH PULSE */}
      <div className={`user-stats ${pulse ? "pulse" : ""}`}>
        <p>
          Score: <span>{score}</span>
        </p>
        <p>
          Streak: <span>{streak}</span>
        </p>
        <p>
          Status: <span>{status}</span>
        </p>
      </div>

      {/* ORIGINAL INTRO SECTION */}
      {phase === "intro" && (
        <div className="intro-section">
          <h2>🧘 Calm Koala Check-In</h2>
          <p>
            Welcome, {userData.firstName}. Choose your mindfulness activity
            below:
          </p>

          <div className="activity-box">
            <h3>🌬️ Breathing Session</h3>
            <p className="activity-description">
              A 2-minute guided 4-2-6 breathing exercise to help you relax and
              refocus.
            </p>
            <button onClick={startBreathing} className="start-button">
              Start Breathing
            </button>
          </div>

          <div className="activity-box">
            <h3>🧘 Meditation Video</h3>
            <p className="activity-description">
              A calming 10-minute video designed for deep relaxation.
            </p>
            <button onClick={handleMeditationStart} className="start-button">
              Start Meditation
            </button>
          </div>
        </div>
      )}

      {(phase === "pre-breathing" || phase === "pre-meditation") && (
        <div className="countdown-section">
          <h2>Get ready...</h2>
          <div className="countdown-number">{prepCountdown}</div>
        </div>
      )}

      {phase === "breathing" && (
        <div className="breathing-section">
          <p className="instruction">{instruction}</p>
          <p className="countdown">{countdown}s</p>
          <p>Time left: {timeLeft}s</p>

          <video
            ref={breathingVideoRef}
            className="breathing-video"
            src="/media/breathing/koala/breathingk.mp4"
            playsInline
            preload="auto"
          />

          <div className="controls">
            <button onClick={handlePause}>Pause</button>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleFullscreen}>Fullscreen</button>
          </div>
        </div>
      )}

      {phase === "meditation" && (
        <div className="meditation-section">
          <video
            ref={meditationVideoRef}
            onEnded={handleMeditationCompletion}
            className="meditation-video"
            src="/media/meditation/koala/meditation.mp4"
            playsInline
            preload="auto"
          />

          <div className="meditation-timer">
            Time left: {formatTime(meditationTimeLeft)}
          </div>

          <p className="meditation-text">Enjoy your peaceful moment…</p>

          <div className="controls">
            <button onClick={() => meditationVideoRef.current?.play()}>
              Play
            </button>
            <button onClick={() => meditationVideoRef.current?.pause()}>
              Pause
            </button>
            <button
              onClick={() => {
                meditationVideoRef.current?.pause();
                meditationVideoRef.current.currentTime = 0;
                setPhase("intro");
                setMeditationTimeLeft(600);
              }}
            >
              Stop
            </button>
            <button onClick={handleFullscreen}>Fullscreen</button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="completion-section">
          <h2>Well done!</h2>
          <p>You completed your mindfulness session.</p>
          <button onClick={handleStop}>Back to Home</button>
        </div>
      )}
    </div>
  );
}

export default KoalaCheckIn;
