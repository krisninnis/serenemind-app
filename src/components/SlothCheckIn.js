import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SlothCheckIn.scss";

const SLOTH_QUOTES = [
  "“Patience is the companion of wisdom.” – St. Augustine",
  "“Nature does not hurry, yet everything is accomplished.” – Lao Tzu",
  "“Slow down and everything you are chasing will come around and catch you.” – John De Paola",
  "“Sometimes the most productive thing you can do is relax.” – Mark Black",
];

function SlothCheckIn({ userData: passedUserData }) {
  const [userData, setUserData] = useState(passedUserData || null);
  const [phase, setPhase] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(60);
  const [prepCountdown, setPrepCountdown] = useState(3);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(300);
  const [breathingActive, setBreathingActive] = useState(false);
  const [meditationActive, setMeditationActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const intervalRef = useRef(null);
  const quoteIntervalRef = useRef(null);
  const breathingVideoRef = useRef(null);
  const meditationAudioRef = useRef(null);
  const containerRef = useRef(null);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Score, streak, last active date, and status
  const [score, setScore] = useState(() =>
    parseInt(localStorage.getItem("score") || "0")
  );
  const [streak, setStreak] = useState(() =>
    parseInt(localStorage.getItem("streak") || "0")
  );
  const [lastActiveDate, setLastActiveDate] = useState(
    () => localStorage.getItem("lastActiveDate") || null
  );
  const [status, setStatus] = useState(
    () => localStorage.getItem("status") || "Sloth"
  );

  // Save score, streak, lastActiveDate, and status whenever they change
  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastActiveDate", lastActiveDate || "");
    localStorage.setItem("status", status);
  }, [score, streak, lastActiveDate, status]);

  // Load user from localStorage if not passed in
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (!userData && savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, [userData]);

  // Cycle quotes every 20s
  useEffect(() => {
    quoteIntervalRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SLOTH_QUOTES.length);
    }, 20000);
    return () => clearInterval(quoteIntervalRef.current);
  }, []);

  // Play/pause
  const handlePlay = useCallback(() => {
    setIsPaused(false);
    if (phase === "breathing")
      breathingVideoRef.current?.play().catch(() => {});
    if (phase === "meditation")
      meditationAudioRef.current?.play().catch(() => {});
  }, [phase]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    breathingVideoRef.current?.pause();
    meditationAudioRef.current?.pause();
  }, []);

  // Spacebar toggle
  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isPaused) handlePlay();
        else handlePause();
      }
    };
    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [isPaused, handlePlay, handlePause]);

  // Prep countdown for breathing
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

  // Breathing countdown timer
  useEffect(() => {
    if (phase !== "breathing" || isPaused || timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase, isPaused, timeLeft]);

  useEffect(() => {
    if (isPaused) {
      breathingVideoRef.current?.pause();
    } else if (phase === "breathing") {
      breathingVideoRef.current?.play().catch(() => {});
    }
  }, [isPaused, phase]);

  // Auto-stop breathing when time ends
  useEffect(() => {
    if (timeLeft === 0 && phase === "breathing") {
      handleBreathingCompletion();
    }
  }, [timeLeft, phase]);

  // Prep countdown for meditation
  useEffect(() => {
    if (phase === "pre-meditation" && prepCountdown > 0) {
      const timer = setTimeout(
        () => setPrepCountdown((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (phase === "pre-meditation" && prepCountdown === 0) {
      setPhase("meditation");
      setMeditationActive(true);
      meditationAudioRef.current?.play().catch(() => {});
    }
  }, [phase, prepCountdown]);

  // Meditation audio timer
  useEffect(() => {
    if (phase !== "meditation" || !meditationAudioRef.current) return;

    const audio = meditationAudioRef.current;
    const updateTimer = () => {
      const remaining = Math.ceil(audio.duration - audio.currentTime);
      setMeditationTimeLeft(remaining > 0 ? remaining : 0);
      if (remaining === 0) {
        handleMeditationCompletion();
      }
    };
    audio.addEventListener("timeupdate", updateTimer);
    return () => audio.removeEventListener("timeupdate", updateTimer);
  }, [phase]);

  // --- SCORING & STREAK FUNCTIONS ---
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
      } else {
        setStreak(1);
      }
      setLastActiveDate(today);
    }
  };

  const checkRankUpgrade = (currentStreak) => {
    if (currentStreak >= 5 && status === "Sloth") setStatus("Koala");
    else if (currentStreak >= 7 && status === "Koala") setStatus("Zebra");
  };

  const handleBreathingCompletion = () => {
    setScore((prev) => prev + 10);
    updateDailyStreak();
    checkRankUpgrade(streak + 1);
    setPhase("done");
    setBreathingActive(false);
    breathingVideoRef.current?.pause();
  };

  const handleMeditationCompletion = () => {
    setScore((prev) => prev + 20);
    updateDailyStreak();
    checkRankUpgrade(streak + 1);
    setPhase("done");
    setMeditationActive(false);
    meditationAudioRef.current?.pause();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- SESSION CONTROL FUNCTIONS ---
  const startBreathing = () => {
    setPrepCountdown(3);
    setPhase("pre-breathing");
    setBreathingActive(true);
    setMeditationActive(false);
    setTimeLeft(60);
    setIsPaused(false);
  };

  const startBreathingSession = () => {
    setPhase("breathing");
    setIsPaused(false);
    if (breathingVideoRef.current) {
      breathingVideoRef.current.currentTime = 0;
      breathingVideoRef.current.play().catch(() => {});
    }
  };

  const handleMeditationStart = () => {
    setPrepCountdown(3);
    setPhase("pre-meditation");
    setMeditationActive(true);
    setBreathingActive(false);
    setMeditationTimeLeft(300);
    setIsPaused(false);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setPhase("intro");
    setTimeLeft(60);
    setPrepCountdown(3);
    setMeditationTimeLeft(300);
    setIsPaused(false);
    setBreathingActive(false);
    setMeditationActive(false);

    if (breathingVideoRef.current) {
      breathingVideoRef.current.pause();
      breathingVideoRef.current.currentTime = 0;
    }
    if (meditationAudioRef.current) {
      meditationAudioRef.current.pause();
      meditationAudioRef.current.currentTime = 0;
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current?.requestFullscreen)
      containerRef.current.requestFullscreen();
  };

  if (!userData) return <p>Please log in to access this feature.</p>;

  return (
    <div className="sloth-checkin-container" ref={containerRef}>
      <img src="/serene-mind-logo.png" alt="SereneMind Logo" className="logo" />
      <div className="quote">{SLOTH_QUOTES[quoteIndex]}</div>

      {/* --- SCORE/STATS DISPLAY --- */}
      <div className="user-stats">
        <p>Score: {score}</p>
        <p>
          Streak: {streak} day{streak !== 1 ? "s" : ""}
        </p>
        <p>Status: {status}</p>
      </div>

      {phase === "intro" && (
        <div className="intro-section">
          <h2>🐢 Slow Sloth Check-In</h2>
          <p>
            Welcome, {userData.firstName}. Choose your mindfulness activity
            below:
          </p>
          <div className="activity-box">
            <h3>🌬️ Breathing Session</h3>
            <p className="activity-description">
              A 1-minute guided breathing exercise to help you relax and
              refocus.
            </p>
            <button onClick={startBreathing} className="start-button">
              Start Breathing
            </button>
          </div>
          <div className="activity-box">
            <h3>🧘 Meditation Audio</h3>
            <p className="activity-description">
              A calming 5-minute meditation audio for deep relaxation.
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
        <div
          className={`breathing-section ${breathingActive ? "expanded" : ""}`}
        >
          <p className="breathing-time-left">Time left: {timeLeft}s</p>
          <video
            ref={breathingVideoRef}
            src="/media/breathing/sloth/breathing.mp4"
            playsInline
            preload="auto"
            autoPlay
            muted={isMuted}
            loop={false}
            onEnded={handleBreathingCompletion}
            className="media-video"
          />
          <div className="video-controls">
            <button onClick={handlePause}>Pause</button>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleFullscreen}>Fullscreen</button>
            <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
          </div>
        </div>
      )}

      {phase === "meditation" && (
        <div
          className={`meditation-section ${meditationActive ? "expanded" : ""}`}
        >
          <audio
            ref={meditationAudioRef}
            src="/media/meditation/sloth/meditation-audio.mp3"
            preload="auto"
            autoPlay
            muted={isMuted}
            controls={false}
          />
          <div className="meditation-timer">
            Time left: {formatTime(meditationTimeLeft)}
          </div>
          <p className="meditation-text">Enjoy your peaceful moment…</p>
          <div className="audio-controls">
            <button onClick={handlePause}>Pause</button>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleFullscreen}>Fullscreen</button>
            <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="completion-section">
          <h2>🎉 Well done, {userData.firstName}!</h2>
          <p>
            You completed your {breathingActive ? "breathing" : "meditation"}{" "}
            session.
          </p>
          <p>
            Would you like to continue with the{" "}
            {breathingActive ? "meditation" : "breathing"} session?
          </p>
          <div className="completion-buttons">
            {breathingActive ? (
              <button onClick={handleMeditationStart} className="start-button">
                Proceed to Meditation
              </button>
            ) : (
              <button onClick={startBreathing} className="start-button">
                Proceed to Breathing
              </button>
            )}
            <button onClick={handleStop} className="start-button">
              Back to Sloth Check-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlothCheckIn;
