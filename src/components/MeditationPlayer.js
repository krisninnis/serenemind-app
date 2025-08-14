import React, { useEffect, useState } from "react";

function MeditationPlayer({ breathingLevel }) {
  const [videoPath, setVideoPath] = useState("");

  useEffect(() => {
    let path = "";

    switch (breathingLevel) {
      case "slow-sloth":
        path = "/videos/meditation/slow-sloth/meditation.mp4";
        break;
      case "calm-koala":
        path = "/videos/meditation/calm-koala/meditation.mp4";
        break;
      case "zen-zebra":
        path = "/videos/meditation/zen-zebra/meditation.mp4";
        break;
      default:
        path = "";
    }

    setVideoPath(path);
  }, [breathingLevel]);

  if (!videoPath) {
    return <p>No meditation video available for your level.</p>;
  }

  return (
    <div className="meditation-player">
      <h2>Your Meditation Session</h2>
      <video
        src={videoPath}
        controls
        autoPlay
        style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }}
      >
        Sorry, your browser does not support embedded videos.
      </video>
    </div>
  );
}

export default MeditationPlayer;
