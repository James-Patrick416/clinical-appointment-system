import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import Patients from "./pages/Patients.jsx";
import LandingPage from "./pages/LandingPage.jsx";
function App() {
  return (
    <Router>
      <Navbar />
      <LandingPage/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
}

export default App;
