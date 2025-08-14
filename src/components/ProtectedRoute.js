// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("userData");

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
