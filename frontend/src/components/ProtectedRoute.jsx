import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { authData } = useAuthContext();

  // Not logged in → redirect to login
  if (!authData?.token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → unauthorized page
  if (role && authData?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render child component
  return children;
}
