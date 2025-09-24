import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        
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
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

function AuthenticatedLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ paddingTop: '20px' }}>{children}</main>
    </div>
  );
}

export default App;
