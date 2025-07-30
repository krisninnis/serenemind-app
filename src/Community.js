import React from "react";
import "./App.scss";

function Community({ setView }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Community</h1>
        <p>Connect with others anonymously. Moderated for safety.</p>
        <div className="button-group">
          <button disabled>Join Chat</button>{" "}
          {/* Placeholder for future implementation */}
          <button disabled>Share Experience</button>
        </div>
        <button onClick={() => setView("home")} className="back-button">
          Back
        </button>
      </header>
    </div>
  );
}

export default Community;
