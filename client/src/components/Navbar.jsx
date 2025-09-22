import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>Clinical Appointment System</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
        <li><Link to="/doctors">Doctors</Link></li>
        <li><Link to="/patients">Patients</Link></li>
      </ul>
    </nav>
  );
}
