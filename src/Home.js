import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Home({ userData }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1>
          Welcome, {userData.firstName} {userData.lastName}!
        </h1>
        <p>Start your journey to better mental health today.</p>
        <div className="button-group">
          <button onClick={() => navigate("/moodTracker")}>Track Mood</button>
          <button onClick={() => navigate("/journal")}>Journal</button>
          <button onClick={() => navigate("/community")}>Community</button>
          <button onClick={() => navigate("/urgent")}>Urgent Help</button>
          <button onClick={() => navigate("/chat")}>
            Chat with Minda (AI)
          </button>
        </div>
      </header>
    </div>
  );
}

export default Home;
