import React, { useState, useEffect } from "react";
import "./BreathingVideo.scss";

function BreathingVideo({ durationSeconds, theme, onComplete }) {
  // breathing cycle steps: 4s inhale, 2s hold, 6s exhale (12s total)
  const cycleSteps = [
    { label: "Breathe in", duration: 4 },
    { label: "Hold", duration: 2 },
    { label: "Breathe out", duration: 6 },
  ];

  const totalCycles = Math.floor(durationSeconds / 12);
  const totalSteps = totalCycles * cycleSteps.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cycleSteps[0].duration);

  useEffect(() => {
    if (stepIndex >= totalSteps) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 1) {
          setStepIndex((i) => i + 1);
          const nextStep = cycleSteps[(stepIndex + 1) % cycleSteps.length];
          return nextStep ? nextStep.duration : 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stepIndex, totalSteps, onComplete]);

  const currentStep = cycleSteps[stepIndex % cycleSteps.length];

  return (
    <div className={`breathing-video ${theme}`}>
      <div className="breathing-circle" />
      <h2>{currentStep?.label || "Done!"}</h2>
      <h1>{timeLeft}</h1>
    </div>
  );
}

export default BreathingVideo;
