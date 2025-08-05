import React from "react";
import BreathingVideo from "./BreathingVideo";

function CalmKoala({ onComplete }) {
  return (
    <BreathingVideo
      durationSeconds={120}
      theme="calm-koala"
      onComplete={onComplete}
    />
  );
}

export default CalmKoala;
