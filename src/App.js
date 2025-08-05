// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.scss";

import FloatingChatbot from "./components/FloatingChatbot";
import Register from "./Register";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail";
import Home from "./Home";
import Community from "./Community";
import UrgentHelp from "./UrgentHelp";
import ChatWithMinda from "./ChatWithMinda";
import MindfulnessCheckIn from "./components/MindfulnessCheckIn";

// Landing page component with a bypass login button
function LandingWithBypass() {
  const navigate = useNavigate();

  const handleBypass = () => {
    localStorage.setItem("token", "dev-bypass-token");
    navigate("/home");
  };

  return (
    <header className="App-header">
      <img
        src="/serene-mind-logo.png"
        alt="SereneMind Journey Logo"
        className="logo"
      />
      <h1>Welcome to the SereneMind Journey</h1>
      <div className="button-group">
        <Link to="/register" className="link-button">
          Register
        </Link>
        <Link to="/login" className="link-button">
          Login
        </Link>
        <button onClick={handleBypass}>Bypass Login</button>
      </div>
    </header>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hiddenPaths = ["/login", "/register", "/verify-email"];

  // Show chatbot only if current path is NOT one of the hiddenPaths
  const showChatbot = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="App">
      {showChatbot && <FloatingChatbot />}
      <Routes>
        <Route path="/" element={<LandingWithBypass />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/home"
          element={<Home userData={{ firstName: "Dev", lastName: "Bypass" }} />}
        />
        <Route path="/moodTracker" element={<MoodTracker />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/community" element={<Community />} />
        <Route path="/urgent" element={<UrgentHelp />} />
        <Route path="/chat" element={<ChatWithMinda />} />
        <Route path="/mindfulness" element={<MindfulnessCheckIn />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
