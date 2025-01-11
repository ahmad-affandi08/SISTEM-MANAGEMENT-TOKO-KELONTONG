import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute untuk memastikan hanya role tertentu yang bisa mengakses halaman
const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || user.role !== requiredRole) {
    // Jika tidak ada token atau role tidak sesuai, redirect ke halaman login
    return <Navigate to="/" />;
  }

  // Jika role sesuai, tampilkan komponen yang diproteksi
  return children;
};

export default ProtectedRoute;
