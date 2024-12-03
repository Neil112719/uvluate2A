import React, { useState } from "react";
import AdminCard from "./admin/AdminCard";
import FacultyCard from "./faculty/FacultyCard";
import StudentCard from "./student/StudentCard";
import "./css/UserManagementCard.css";

const ManageUsersCard = () => {
  const [activeSection, setActiveSection] = useState("Admin"); // Track active section

  // Render the active component
  const renderActiveComponent = () => {
    switch (activeSection) {
      case "Admin":
        return <AdminCard />;
      case "Faculty":
        return <FacultyCard />;
      case "Students":
        return <StudentCard />;
      default:
        return <div>Select a section to manage users</div>;
    }
  };

  return (
    <div className="manage-users-card">
      <h2>Manage Users</h2>

      {/* Buttons for toggling sections */}
      <div className="section-buttons">
        <button
          className={`section-button ${activeSection === "Admin" ? "active" : ""}`}
          onClick={() => setActiveSection("Admin")}
        >
          Admin
        </button>
        <button
          className={`section-button ${activeSection === "Faculty" ? "active" : ""}`}
          onClick={() => setActiveSection("Faculty")}
        >
          Faculty
        </button>
        <button
          className={`section-button ${activeSection === "Students" ? "active" : ""}`}
          onClick={() => setActiveSection("Students")}
        >
          Students
        </button>
      </div>

      {/* Active Component */}
      <div className="active-component">{renderActiveComponent()}</div>
    </div>
  );
};

export default ManageUsersCard;
