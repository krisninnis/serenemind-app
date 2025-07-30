import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Age calculation logic
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;

    // Validations
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dateOfBirth
    ) {
      setError("All fields are required.");
      return;
    }
    if (age < 13) {
      setError("You must be at least 13 years old to register.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    axios
      .post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
      })
      .then(() => {
        setSuccessMsg("Registration successful! Redirecting to homepage...");
        setError("");
        setTimeout(() => {
          navigate("/homepage"); // Change "/homepage" to your actual homepage route
        }, 1500);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Register for SereneMind Journey</h1>
        {error && <p style={{ color: "#e57373" }}>{error}</p>}
        {successMsg && <p style={{ color: "#4caf50" }}>{successMsg}</p>}
        {!successMsg && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <button type="submit">Register</button>
          </form>
        )}
        <button onClick={() => navigate("/")} className="back-button">
          Back to Landing
        </button>
      </header>
    </div>
  );
}

export default Register;
