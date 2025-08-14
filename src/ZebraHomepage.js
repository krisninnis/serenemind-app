import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ZebraHomepage.scss";

function ZebraHomepage({ userData }) {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLocalUser(userData);
    } else {
      const saved = localStorage.getItem("userData");
      if (saved) setLocalUser(JSON.parse(saved));
    }
    setLoading(false);
  }, [userData]);

  if (loading) return null;
  if (!localUser) return navigate("/login");

  const pages = [
    {
      title: "Daily Mindfulness Check-in",
      description: "3-minute Zebra breathing + 15-minute meditation.",
      route: "/zebra-checkin",
    },
    {
      title: "Mood Tracker",
      description: "Track your daily moods to understand emotional patterns.",
      route: "/moodTracker",
    },
    {
      title: "Journal",
      description: "Write down your thoughts and feelings as they come.",
      route: "/journal",
    },
    {
      title: "Chat with Minda (AI)",
      description: "Talk to your personal AI support buddy whenever you need.",
      route: "/chat",
    },
    {
      title: "Community",
      description:
        "Connect with others and share stories on your wellness journey.",
      route: "/community",
    },
    {
      title: "Urgent Help",
      description: "Access urgent mental health support and resources.",
      route: "/urgent",
    },
  ];

  return (
    <div className="App zebra-theme">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1>
          Welcome, {localUser.firstName} {localUser.lastName} 🦓
        </h1>
        <p>Let's harness focused calm with Zebra energy.</p>

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

export default ZebraHomepage;
