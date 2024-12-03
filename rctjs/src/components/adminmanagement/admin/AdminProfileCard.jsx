import React from "react";
import "./css/AdminProfileCard.css";

const AdminProfileCard = ({ admin }) => {
  return (
    <div className="admin-profile-card">
      <h4>
        {admin.fname} {admin.mname && admin.mname} {admin.lname} {admin.suffix && admin.suffix}
      </h4>
      <p>ID: {admin.id}</p>
      <p>User Type: {admin.usertype}</p>
    </div>
  );
};

export default AdminProfileCard;
