import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Community() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Community</h1>
        <p>Connect with others anonymously. Moderated for safety.</p>
        <div className="button-group">
          <button disabled>Join Chat</button>
          <button disabled>Share Experience</button>
        </div>
        <button onClick={() => navigate("/home")} className="back-button">
          Back
        </button>
      </header>
    </div>
  );
}

export default Community;
