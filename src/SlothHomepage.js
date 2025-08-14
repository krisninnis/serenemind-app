import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SlothHomepage.scss";

function SlothHomepage({ userData }) {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug logs to verify data
    console.log("SlothHomepage - token:", localStorage.getItem("token"));
    console.log("SlothHomepage - userData prop:", userData);
    console.log(
      "SlothHomepage - localStorage userData:",
      localStorage.getItem("userData")
    );
    if (userData) {
      setLocalUser(userData);
    } else {
      const saved = localStorage.getItem("userData");
      if (saved) {
        setLocalUser(JSON.parse(saved));
      } else {
        console.log("No user data found, redirecting to login");
      }
    }
    setLoading(false);
  }, [userData]);

  if (loading) return null; // Prevent flicker during check
  if (!localUser) {
    return navigate("/login");
  }

  const pages = [
    {
      title: "Daily Mindfulness Check-in",
      description:
        "Slow down with 1-minute breathing and gentle mindfulness exercises.",
      route: "/sloth-checkin",
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
    <div className="App sloth-theme">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
        <h1>
          Welcome, {localUser.firstName} {localUser.lastName} 🦥
        </h1>
        <p>Let’s take it slow and steady today.</p>

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

export default SlothHomepage;
