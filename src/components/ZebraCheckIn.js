import React, { useState, useEffect, useRef } from "react";
import "./ZebraCheckIn.scss";

const ZEBRA_QUOTES = [
  "“In the rhythm of life, find your own stripes.”",
  "“A zebra does not change its stripes, but it can rest in the shade.”",
  "“Balance is the key to life’s harmony.”",
  "“Every stripe tells a story of resilience.”",
];

function ZebraCheckIn({ userData: passedUserData }) {
  const [userData, setUserData] = useState(passedUserData || null);
  const [phase, setPhase] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(180); // 3-minute breathing timer
  const [prepCountdown, setPrepCountdown] = useState(3);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(900); // 15-minute meditation
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

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (!userData && savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, [userData]);

  useEffect(() => {
    quoteIntervalRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ZEBRA_QUOTES.length);
    }, 20000);
    return () => clearInterval(quoteIntervalRef.current);
  }, []);

  // Prep countdown before breathing
  useEffect(() => {
    if (phase === "pre-breathing" && prepCountdown > 0) {
      const timer = setTimeout(() => {
        setPrepCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "pre-breathing" && prepCountdown === 0) {
      startBreathingSession();
    }
  }, [phase, prepCountdown]);

  // Breathing timer countdown
  useEffect(() => {
    if (phase !== "breathing" || isPaused || timeLeft <= 0) return;

    if (breathingVideoRef.current?.paused) {
      breathingVideoRef.current.play().catch(() => {});
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [phase, isPaused, timeLeft]);

  useEffect(() => {
    if (!breathingVideoRef.current) return;
    if (isPaused) {
      breathingVideoRef.current.pause();
    } else if (phase === "breathing") {
      breathingVideoRef.current.play().catch(() => {});
    }
  }, [isPaused, phase]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "breathing") {
      setPhase("done");
      breathingVideoRef.current?.pause();
      setBreathingActive(false);
    }
  }, [timeLeft, phase]);

  // Meditation prep countdown
  useEffect(() => {
    if (phase === "pre-meditation" && prepCountdown > 0) {
      const timer = setTimeout(() => {
        setPrepCountdown((prev) => prev - 1);
      }, 1000);
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
        setPhase("done");
        setMeditationActive(false);
      }
    };

    audio.addEventListener("timeupdate", updateTimer);
    return () => {
      audio.removeEventListener("timeupdate", updateTimer);
    };
  }, [phase]);

  // ⌨️ Spacebar play/pause for breathing video or meditation audio
  useEffect(() => {
    const onKeyDown = (e) => {
      // Only react to Space; ignore repeats and when typing in inputs/textareas
      if (!(e.code === "Space" || e.key === " ")) return;
      if (e.repeat) return;

      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      e.preventDefault();

      if (phase === "breathing" && breathingVideoRef.current) {
        if (breathingVideoRef.current.paused) {
          breathingVideoRef.current.play().catch(() => {});
          setIsPaused(false);
        } else {
          breathingVideoRef.current.pause();
          setIsPaused(true);
        }
      } else if (phase === "meditation" && meditationAudioRef.current) {
        if (meditationAudioRef.current.paused) {
          meditationAudioRef.current.play().catch(() => {});
          setIsPaused(false);
        } else {
          meditationAudioRef.current.pause();
          setIsPaused(true);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startBreathing = () => {
    setPrepCountdown(3);
    setPhase("pre-breathing");
    setBreathingActive(true);
    setMeditationActive(false);
    setTimeLeft(180);
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

  const handlePause = () => {
    setIsPaused(true);
    breathingVideoRef.current?.pause();
    meditationAudioRef.current?.pause();
  };

  const handlePlay = () => {
    setIsPaused(false);
    if (phase === "breathing") {
      breathingVideoRef.current?.play().catch(() => {});
    } else if (phase === "meditation") {
      meditationAudioRef.current?.play().catch(() => {});
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setPhase("intro");
    setTimeLeft(180);
    setPrepCountdown(3);
    setMeditationTimeLeft(900);
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
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMeditationStart = () => {
    setPrepCountdown(3);
    setPhase("pre-meditation");
    setMeditationActive(true);
    setBreathingActive(false);
    setMeditationTimeLeft(900);
    setIsPaused(false);
  };

  if (!userData) return <p>Please log in to access this feature.</p>;

  return (
    <div className="zebra-checkin-container" ref={containerRef}>
      <img src="/serene-mind-logo.png" alt="SereneMind Logo" className="logo" />

      <div className="quote">{ZEBRA_QUOTES[quoteIndex]}</div>

      {phase === "intro" && (
        <div className="intro-section">
          <h2>🦓 Zebra Check-In</h2>
          <p>
            Welcome, {userData.firstName}. Choose your mindfulness activity
            below:
          </p>

          <div className="activity-box">
            <h3>🌬️ Breathing Session</h3>
            <p className="activity-description">
              A 3-minute guided breathing exercise to restore calm and focus.
            </p>
            <button onClick={startBreathing} className="start-button">
              Start Breathing
            </button>
          </div>

          <div className="activity-box">
            <h3>🧘 Meditation Audio</h3>
            <p className="activity-description">
              A calming 15-minute meditation audio for deep relaxation.
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
            src="/media/breathing/zebra/breathing.mp4"
            playsInline
            preload="auto"
            autoPlay
            muted={isMuted}
            loop={false}
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
            src="/media/meditation/zebra/meditation-audio.mp3"
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
              Back to Zebra Check-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZebraCheckIn;
