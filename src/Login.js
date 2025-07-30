import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/moodTracker"); // Redirect after successful login
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <img
        src="/serene-mind-logo.png"
        alt="SereneMind Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label style={{ textAlign: "left", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
            style={{ marginRight: "6px" }}
          />
          Show password
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
