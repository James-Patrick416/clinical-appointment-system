import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import Patients from "./pages/Patients.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            user ? (
              <AuthenticatedLayout>
                <Appointments />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/doctors"
          element={
            user ? (
              <AuthenticatedLayout>
                <Doctors />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/patients"
          element={
            user ? (
              <AuthenticatedLayout>
                <Patients />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

// Layout for authenticated pages
function AuthenticatedLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}

export default App;
