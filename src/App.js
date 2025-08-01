import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.scss";

import Register from "./Register";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail"; // Make sure to create this component

function Landing() {
  return (
    <header className="App-header">
      <img
        src="/serene-mind-logo.png"
        alt="SereneMind Journey Logo"
        className="logo"
      />
      <h1>Welcome to SereneMind Journey</h1>
      <div className="button-group">
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <button onClick={handleBypass}>Bypass Login</button>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingWithBypass />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/home"
            element={
              <Home userData={{ firstName: "Dev", lastName: "Bypass" }} />
            }
          />
          <Route path="/moodTracker" element={<MoodTracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Redirect any unknown routes back to landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
