import React, { useState } from "react";
import NavbarSidebar from "../components/misc/NavBarSideBar";
import ManageUsersCard from "../components/adminmanagement/UserManagementCard";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  // Sidebar buttons
  const sidebarButtons = [
    { label: "Dashboard" },
    { label: "Manage Users" },
    { label: "Departments" },
    { label: "ADS" },
  ];

  // Determine the component to render
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <div>Dashboard Content</div>;
      case "Manage Users":
        return <ManageUsersCard />;
      case "Departments":
        return <div>Departments Content</div>;
      case "ADS":
        return <div>ADS Content</div>;
      default:
        return <div>No component selected</div>;
    }
  };

  // Update active component based on selection
  const handleSectionChange = (section) => {
    setActiveComponent(section);
  };

  return (
    <div className="admin-page">
      {/* Pass buttons, active component, and section change handler */}
      <NavbarSidebar
        buttons={sidebarButtons}
        activeSection={activeComponent}
        onSectionChange={handleSectionChange}
        activeComponent={renderActiveComponent()}
      />
    </div>
  );
};

export default AdminPage;
