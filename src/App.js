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
import "./styles/themes/App.scss";

import FloatingChatbot from "./components/FloatingChatbot";
import Register from "./Register";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail";
import Community from "./Community";
import UrgentHelp from "./UrgentHelp";
import ChatWithMinda from "./ChatWithMinda";
import BreathingLevelSelector from "./components/BreathingLevelSelector";
import MeditationSession from "./components/MeditationSession";
import SessionPreferences from "./components/SessionPreferences";
import SlothHomepage from "./SlothHomepage";
import SlothCheckIn from "./components/SlothCheckIn";
import KoalaHomepage from "./KoalaHomepage";
import KoalaCheckIn from "./components/KoalaCheckIn";
import ZebraHomepage from "./ZebraHomepage";
import ZebraCheckIn from "./components/ZebraCheckIn";
import ProtectedRoute from "./components/ProtectedRoute";
import FoodScanner from "./components/FoodScanner";

function LandingWithBypass() {
  const navigate = useNavigate();

  const handleBypass = () => {
    const fakeUser = {
      firstName: "Dev",
      lastName: "Bypass",
      breathingLevel: "slow-sloth", // Default to sloth, updated by BreathingLevelSelector
    };
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
  const [userData, setUserData] = useState(null);

  const hiddenPaths = [
    "/login",
    "/register",
    "/verify-email",
    "/select-breathing-level",
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

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
          path="/select-breathing-level"
          element={<BreathingLevelSelector />}
        />
        <Route
          path="/moodTracker"
          element={<MoodTracker userData={userData} />}
        />
        <Route path="/journal" element={<Journal userData={userData} />} />
        <Route path="/community" element={<Community userData={userData} />} />
        <Route path="/urgent" element={<UrgentHelp userData={userData} />} />
        <Route path="/chat" element={<ChatWithMinda userData={userData} />} />
        <Route path="/preferences" element={<SessionPreferences />} />
        <Route path="/meditation" element={<MeditationSession />} />

        {/* 🐌 Sloth Mode Routes (protected) */}
        <Route
          path="/sloth-home"
          element={
            <ProtectedRoute>
              <SlothHomepage userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sloth-checkin"
          element={
            <ProtectedRoute>
              <SlothCheckIn userData={userData} />
            </ProtectedRoute>
          }
        />

        {/* 🐨 Koala Mode Routes (protected) */}
        <Route
          path="/koala-home"
          element={
            <ProtectedRoute>
              <KoalaHomepage userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/koala-checkin"
          element={
            <ProtectedRoute>
              <KoalaCheckIn userData={userData} />
            </ProtectedRoute>
          }
        />

        {/* 🦓 Zebra Mode Routes (protected) */}
        <Route
          path="/zebra-home"
          element={
            <ProtectedRoute>
              <ZebraHomepage userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zebra-checkin"
          element={
            <ProtectedRoute>
              <ZebraCheckIn userData={userData} />
            </ProtectedRoute>
          }
        />

        {/* 🍎 Food Scanner Route (protected) */}
        <Route
          path="/food-scanner"
          element={
            <ProtectedRoute>
              <FoodScanner userData={userData} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
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
