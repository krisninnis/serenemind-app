import React from "react";
import BreathingVideo from "./BreathingVideo";

function ZenZebra({ onComplete }) {
  return (
    <BreathingVideo
      durationSeconds={180}
      theme="zen-zebra"
      onComplete={onComplete}
    />
  );
}

export default ZenZebra;
