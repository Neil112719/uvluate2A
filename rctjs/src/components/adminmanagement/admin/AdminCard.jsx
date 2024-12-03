import React, { useState } from "react";
import ShowAdminCard from "./ShowAdminCard"; // Import ShowAdminCard
import CreateAdminCard from "./CreateAdminCard"; // Import CreateAdminCard
import "./css/AdminCard.css";

const AdminCard = () => {
  const [activeTab, setActiveTab] = useState("Show Admin"); // State to toggle between tabs

  return (
    <div className="admin-card">
      <h2>Admin Management</h2>

      {/* Tabs for Show Admin and Create Admin */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "Show Admin" ? "active" : ""}`}
          onClick={() => setActiveTab("Show Admin")}
        >
          Show Admin
        </button>
        <button
          className={`tab ${activeTab === "Create Admin" ? "active" : ""}`}
          onClick={() => setActiveTab("Create Admin")}
        >
          Create Admin
        </button>
      </div>

      {/* Render Show Admin or Create Admin based on activeTab */}
      {activeTab === "Show Admin" && <ShowAdminCard />}
      {activeTab === "Create Admin" && <CreateAdminCard />}
    </div>
  );
};

export default AdminCard;
