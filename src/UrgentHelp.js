import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/themes/App.scss";

function UrgentHelp() {
  const navigate = useNavigate();

  const handleUrgentClick = () => {
    alert(
      "Connecting to local helpline. Please contact 999 or a trusted person."
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />

        <h1>Urgent Help</h1>
        <p>If you need immediate support, click below.</p>

        <div className="button-group">
          <button onClick={handleUrgentClick}>Get Help Now</button>
          <button className="link-button" onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      </header>
    </div>
  );
}

export default UrgentHelp;
