import React from "react";
import "./App.scss";

function UrgentHelp({ setView }) {
  const handleUrgentClick = () => {
    alert(
      "Connecting to local helpline. Please contact 999 or a trusted person."
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Urgent Help</h1>
        <p>If you need immediate support, click below.</p>
        <button onClick={handleUrgentClick}>Get Help Now</button>
        <button onClick={() => setView("home")} className="back-button">
          Back
        </button>
      </header>
    </div>
  );
}

export default UrgentHelp;
