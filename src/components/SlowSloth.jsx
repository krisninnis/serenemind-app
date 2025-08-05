import React from "react";
import BreathingVideo from "./BreathingVideo";

function SlowSloth({ onComplete }) {
  return (
    <BreathingVideo
      durationSeconds={60}
      theme="slow-sloth"
      onComplete={onComplete}
    />
  );
}

export default SlowSloth;
