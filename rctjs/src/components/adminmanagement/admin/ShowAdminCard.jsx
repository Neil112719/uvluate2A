import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminProfileCard from "./AdminProfileCard";
import "./css/ShowAdminCard.css";

const ShowAdminCard = () => {
  const [admins, setAdmins] = useState([]); // Admin list
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Track selected admin

  // Fetch Admins on Component Mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin_request/get-admins.php");
        if (response.data.success) {
          setAdmins(response.data.admins);
        } else {
          console.error("Error fetching admins:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEdit = (admin) => {
    console.log("Edit admin:", admin);
    // Add your edit logic here (e.g., open an overlay or navigate to the edit page)
  };

  const handleDelete = async (adminId) => {
    try {
      const response = await axios.post("http://localhost:8000/api/admin_request/delete-admin.php", { id: adminId });
      if (response.data.success) {
        setAdmins(admins.filter((admin) => admin.id !== adminId)); // Remove deleted admin from the list
        setSelectedAdmin(null); // Deselect the admin after deletion
      } else {
        console.error("Error deleting admin:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="show-admin-card">
      <h3>Admin List</h3>
      {admins.length > 0 ? (
        admins.map((admin) => (
          <div key={admin.id} className="admin-item">
            <AdminProfileCard admin={admin} />
            <div className="admin-actions">
              <button onClick={() => setSelectedAdmin(admin)} className="view-button">
                View Profile
              </button>
              {selectedAdmin && selectedAdmin.id === admin.id && (
                <div className="admin-profile-actions">
                  <button onClick={() => handleEdit(admin)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No admins available.</p>
      )}
    </div>
  );
};

export default ShowAdminCard;
