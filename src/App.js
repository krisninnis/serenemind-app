import React, { useEffect, useState } from "react";
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
import BreathingLevelSelector from "./components/BreathingLevelSelector";

function LandingWithBypass() {
  const navigate = useNavigate();

  const handleBypass = () => {
    const fakeUser = { firstName: "Dev", lastName: "Bypass" };
    localStorage.setItem("token", "dev-bypass-token");
    localStorage.setItem("userData", JSON.stringify(fakeUser));
    navigate("/select-breathing-level");
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
  const hiddenPaths = [
    "/login",
    "/register",
    "/verify-email",
    "/select-breathing-level",
  ];
  const showChatbot = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const [userData, setUserData] = useState(null);

  // Load userData from localStorage on first mount
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="App">
      {showChatbot && <FloatingChatbot />}
      <Routes>
        <Route path="/" element={<LandingWithBypass />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/select-breathing-level"
          element={<BreathingLevelSelector />}
        />
        <Route path="/home" element={<Home userData={userData} />} />
        <Route
          path="/moodTracker"
          element={<MoodTracker userData={userData} />}
        />
        <Route path="/journal" element={<Journal userData={userData} />} />
        <Route path="/community" element={<Community userData={userData} />} />
        <Route path="/urgent" element={<UrgentHelp userData={userData} />} />
        <Route path="/chat" element={<ChatWithMinda userData={userData} />} />
        <Route
          path="/mindfulness"
          element={<MindfulnessCheckIn userData={userData} />}
        />
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
