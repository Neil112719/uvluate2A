import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaBars } from "react-icons/fa";
import axios from "axios";
import "./css/NavBarSideBar.css";

const NavbarSidebar = ({ buttons, activeComponent, activeSection, onSectionChange }) => {
  const [user, setUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const response = await axios.get("http://localhost:8000/misc/get-user-info.php", {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          console.error("Error fetching user data:", response.data.message);
          navigate("/"); // Redirect if session is invalid
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      await axios.post(
        "http://localhost:8000/api/login/logout.php",
        {},
        {
          headers: { Authorization: `Bearer ${sessionToken}` },
          withCredentials: true,
        }
      );
      localStorage.removeItem("sessionToken");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getDashboardTitle = (userType) => {
    switch (userType) {
      case 1:
        return "Admin Dashboard";
      case 2:
        return "Dean Dashboard";
      case 3:
        return "Coordinator Dashboard";
      case 4:
        return "Instructor Dashboard";
      case 5:
        return "Student Dashboard";
      default:
        return "Dashboard";
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="navbar-sidebar-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-title-container">
          <button className="toggle-sidebar-button" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
            <FaBars />
          </button>
          <h1 className="navbar-title">
            <strong>UVluate</strong> / {getDashboardTitle(user.usertype)}
          </h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        {isSidebarVisible && (
          <div className="sidebar">
            {/* Sidebar Buttons */}
            <div className="sidebar-buttons">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`sidebar-button ${activeSection === button.label ? "active" : ""}`}
                  onClick={() => onSectionChange(button.label)} // Notify AdminPage
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* User Card */}
            <div className="user-card-container">
              <div className="user-card">
                <h4 className="user-name">
                  {user.fname} {user.mname && `${user.mname} `}{user.lname}
                  {user.suffix && `, ${user.suffix}`}
                </h4>
                <p className="user-id">ID: {user.id || "Not Available"}</p>
              </div>
              <div className="gear-icon-container">
                <FaCog className="gear-icon" onClick={() => console.log("Settings clicked!")} />
              </div>
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              <p className="footer-link" onClick={() => console.log("Privacy clicked!")}>
                Privacy
              </p>
              <p className="footer-link" onClick={() => console.log("Terms clicked!")}>
                Terms
              </p>
              <p className="footer-link" onClick={() => console.log("About Us clicked!")}>
                About Us
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="content">
          {activeComponent || <div>No content available</div>}
        </div>
      </div>
    </div>
  );
};

export default NavbarSidebar;
