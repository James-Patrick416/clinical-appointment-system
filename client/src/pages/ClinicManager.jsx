import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import "./ClinicManager.css";

function ClinicManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Sample Data
  const stats = [
    { title: "Patients", value: "1,245", change: "+12%", color: "blue", icon: () => <span>👤</span> },
    { title: "Appointments", value: "348", change: "+5%", color: "green", icon: () => <span>📅</span> },
    { title: "Prescriptions", value: "89", change: "-3%", color: "yellow", icon: () => <span>💊</span> },
  ];

  const todayAppointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", type: "Checkup", time: "10:30 AM", status: "upcoming", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, patient: "Jane Roe", doctor: "Dr. Lee", type: "Follow-up", time: "12:00 PM", status: "completed", avatar: "https://i.pravatar.cc/40?img=2" },
  ];

  const recentActivity = [
    { id: 1, activity: "New patient registered", time: "5m ago" },
    { id: 2, activity: "Appointment scheduled", time: "30m ago" },
  ];

  return (
    <div className="clinic-manager-app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
      />

      <main className="main-content">
        {currentPage === "dashboard" && (
          <Dashboard
            stats={stats}
            todayAppointments={todayAppointments}
            recentActivity={recentActivity}
          />
        )}
        {currentPage !== "dashboard" && (
          <div className="page-placeholder">
            <h2>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p>This page is under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClinicManager;
