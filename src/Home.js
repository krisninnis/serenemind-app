import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Home({ userData }) {
  const navigate = useNavigate();

  const pages = [
    {
      name: "Track Mood",
      description:
        "Log your daily mood to keep track of your emotional wellbeing.",
      path: "/moodTracker",
    },
    {
      name: "Journal",
      description:
        "Write journal entries to reflect on your thoughts and feelings.",
      path: "/journal",
    },
    {
      name: "Community",
      description: "Connect and share with others in a supportive environment.",
      path: "/community",
    },
    {
      name: "Urgent Help",
      description:
        "Access immediate resources and support when you need it most.",
      path: "/urgent",
    },
    {
      name: "Chat with Minda (AI)",
      description: "Talk with Minda, your AI mental wellness companion.",
      path: "/chat",
    },
    {
      name: "Daily Mindfulness Check-in",
      description:
        "Short guided check-ins with a 3-minute breathing exercise, a gratitude prompt, and a calming quote or affirmation.",
      path: "/mindfulness",
    },
  ];

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

        <div className="page-list">
          {pages.map((page) => (
            <div
              key={page.name}
              className="page-box"
              role="button"
              tabIndex={0}
              onClick={() => navigate(page.path)}
              onKeyDown={(e) => e.key === "Enter" && navigate(page.path)}
            >
              <h2>{page.name}</h2>
              <p className="clickable-description">{page.description}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Home;
