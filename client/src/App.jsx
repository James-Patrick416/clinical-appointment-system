import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import Patients from "./pages/Patients.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes - LandingPage has its own navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Protected routes - Use Layout with Navbar */}
        <Route 
          path="/dashboard" 
          element={user ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/appointments" 
          element={user ? <AuthenticatedLayout><Appointments /></AuthenticatedLayout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/doctors" 
          element={user ? <AuthenticatedLayout><Doctors /></AuthenticatedLayout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/patients" 
          element={user ? <AuthenticatedLayout><Patients /></AuthenticatedLayout> : <Navigate to="/login" replace />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Layout component for authenticated routes
function AuthenticatedLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}

export default App;