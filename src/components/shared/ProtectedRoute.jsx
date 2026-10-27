import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticatedUser } from "../../utils/authConstants";

// Ported from legacy ProtectedRoute.js — gate on the user_info cookie set at login.
// isAuthenticatedUser also honours the VITE_BYPASS_AUTH dev flag.
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticatedUser()) {
    return <Navigate replace to="/signup" />;
  }
  return children;
};

export default ProtectedRoute;
