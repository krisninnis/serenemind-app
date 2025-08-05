import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./Home.scss";

function Home({ userData }) {
  const navigate = useNavigate();

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const pages = [
    {
      title: "Daily Mindfulness Check-in",
      description:
        "Begin your day with breathing and mindfulness sessions to stay grounded.",
      route: "/mindfulness",
    },
    {
      title: "Mood Tracker",
      description:
        "Log and track your moods daily to spot patterns and trends.",
      route: "/moodTracker",
    },
    {
      title: "Journal",
      description:
        "Write personal journal entries and reflect on your thoughts and feelings.",
      route: "/journal",
    },
    {
      title: "Chat with Minda (AI)",
      description:
        "Have a conversation with our AI assistant for mindfulness and mental wellness guidance.",
      route: "/chat",
    },
    {
      title: "Community",
      description:
        "Connect with others for support, share stories, and find encouragement.",
      route: "/community",
    },
    {
      title: "Urgent Help",
      description:
        "Access immediate resources and support when you need urgent mental health assistance.",
      route: "/urgent",
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
          {pages.map(({ title, description, route }) => (
            <div
              key={title}
              className="page-box"
              tabIndex={0}
              role="button"
              onClick={() => navigate(route)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(route);
                }
              }}
              aria-label={`${title}: ${description}`}
            >
              <button type="button" className="page-title-button" tabIndex={-1}>
                {title}
              </button>
              <p className="clickable-description">{description}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Home;
