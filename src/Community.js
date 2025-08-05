import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Community() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />

        <h1>Community</h1>
        <p>Connect with others anonymously. Moderated for safety.</p>

        <div className="button-group">
          <button disabled>Join Chat</button>
          <button disabled>Share Experience</button>
        </div>

        <div className="button-group">
          <button className="link-button" onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      </header>
    </div>
  );
}

export default Community;
