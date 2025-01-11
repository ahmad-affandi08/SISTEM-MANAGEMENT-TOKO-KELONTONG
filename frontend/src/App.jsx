import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminPage from "./pages/AdminPage";
import KasirPage from "./pages/KasirPage";
import ProtectedRoute from "./privateRoutes/ProtectedRoute";
import KasirSystem from "./components/Kasir/KasirSystem";

function App() {
  return (
    <Router>
      {/* Membungkus seluruh aplikasi dengan font-poppins */}
      <div className="font-poppins">
        <Routes>
          {/* Route untuk Login */}
          <Route path="/" element={<Login />} />

          {/* Route untuk Register */}
          <Route path="/register" element={<Register />} />

          {/* Route untuk AdminPage dengan proteksi */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Route untuk KasirPage dengan proteksi */}
          <Route
            path="/kasir"
            element={
              <ProtectedRoute requiredRole="kasir">
                <KasirPage />
              </ProtectedRoute>
            }
          />

          {/* Route untuk Sistem Kasir dengan proteksi */}
          <Route
            path="/kasir/system"
            element={
              <ProtectedRoute requiredRole="kasir">
                <KasirSystem />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
