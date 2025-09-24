<<<<<<< HEAD
=======
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import "./App.css";
import ClinicManager from "./ClinicManager";
import "./styles/ClinicManager.css";



function Layout() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Clinical Appointment System</h2>
        <nav>
          <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">Dashboard</Link>
          <Link className={location.pathname === "/appointments" ? "active" : ""} to="/appointments">Appointments</Link>
          <Link className={location.pathname === "/patients" ? "active" : ""} to="/patients">Patients</Link>
          <Link className={location.pathname === "/doctors" ? "active" : ""} to="/doctors">Doctors</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="*" element={<h2 style={{ padding: "2rem" }}>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );

  function App() {
  return <ClinicManager />;
}

}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
>>>>>>> c90f94b124cf2fef1a0d89628dbdfbaa224fa835
