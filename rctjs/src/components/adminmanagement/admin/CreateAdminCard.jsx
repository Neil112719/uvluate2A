import React, { useState } from "react";
import axios from "axios";
import "./css/CreateAdminCard.css";

const CreateAdminCard = () => {
  const [newAdmin, setNewAdmin] = useState({}); // New admin form data

  // Handle form submission
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin_request/create-admin.php",
        newAdmin
      );
      if (response.data.success) {
        alert("Admin created successfully!");
        setNewAdmin({}); // Reset form
      } else {
        alert("Error creating admin: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("An error occurred while creating admin.");
    }
  };

  return (
    <div className="create-admin-card">
      <h3>Create New Admin</h3>
      <form onSubmit={handleCreateAdmin}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={newAdmin.fname || ""}
            required
            onChange={(e) => setNewAdmin({ ...newAdmin, fname: e.target.value })}
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type="text"
            value={newAdmin.mname || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, mname: e.target.value })}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={newAdmin.lname || ""}
            required
            onChange={(e) => setNewAdmin({ ...newAdmin, lname: e.target.value })}
          />
        </div>
        <div>
          <label>Suffix:</label>
          <input
            type="text"
            value={newAdmin.suffix || ""}
            onChange={(e) => setNewAdmin({ ...newAdmin, suffix: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newAdmin.email || ""}
            required
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={newAdmin.password || ""}
            required
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
        </div>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdminCard;
