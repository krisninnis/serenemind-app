import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );
        setMessage(response.data.message || "Email verified successfully!");
      } catch (err) {
        setError(true);
        setMessage(
          err.response?.data?.message || "Verification failed. Try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Email Verification</h1>
        <p style={{ color: error ? "red" : "green" }}>{message}</p>
        {error ? (
          <Link to="/register">
            <button>Try Registering Again</button>
          </Link>
        ) : (
          <Link to="/login">
            <button>Go to Login</button>
          </Link>
        )}
      </header>
    </div>
  );
}

export default VerifyEmail;
