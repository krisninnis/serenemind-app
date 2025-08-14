import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KoalaHomepage.scss";

function KoalaHomepage({ userData }) {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLocalUser(userData);
    } else {
      const saved = localStorage.getItem("userData");
      if (saved) {
        setLocalUser(JSON.parse(saved));
      }
    }
    setLoading(false);
  }, [userData]);

  if (loading) return null;
  if (!localUser) {
    navigate("/login");
    return null;
  }

  const pages = [
    {
      title: "Daily Mindfulness Check-in",
      description: "Breathe deeply with your 2-minute calm koala session.",
      route: "/koala-checkin",
    },

    {
      title: "Mood Tracker",
      description: "Track your moods and explore emotional balance.",
      route: "/moodTracker",
    },
    {
      title: "Food Scanner",
      description: "Scan barcodes and check nutritional info like Yuka.",
      route: "/food-scanner",
    },

    {
      title: "Journal",
      description: "Reflect and write your thoughts freely and peacefully.",
      route: "/journal",
    },
    {
      title: "Chat with Minda (AI)",
      description: "Koala-level calm support, available anytime you need.",
      route: "/chat",
    },
    {
      title: "Community",
      description: "Join the tree of koalas — share and connect mindfully.",
      route: "/community",
    },
    {
      title: "Urgent Help",
      description: "Koalas stick together — find support if you're struggling.",
      route: "/urgent",
    },
  ];

  return (
    <div className="App koala-theme">
      <header className="App-header" role="banner">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1 tabIndex={0}>
          Welcome, {localUser.firstName} {localUser.lastName} 🐨
        </h1>
        <p tabIndex={0}>Calm and steady — you're in your Koala era.</p>

        <nav aria-label="Main application pages">
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
                <button
                  type="button"
                  className="page-title-button"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {title}
                </button>
                <p className="clickable-description">{description}</p>
              </div>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
}

export default KoalaHomepage;
