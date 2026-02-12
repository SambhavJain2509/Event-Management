import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style.css";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!token) return null;

  return (
    <div className="navbar">
      <div className="nav-left">
        <h3>Event Management</h3>
      </div>

      <div className="nav-center">
        <NavLink to="/dashboard">Dashboard</NavLink>

        {role === "admin" && (
          <>
            <NavLink to="/add-membership">Add</NavLink>
            <NavLink to="/update-membership">Update</NavLink>
          </>
        )}

        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>

        {/* ✅ Added Chart Link */}
        <NavLink to="/flowchart">Chart</NavLink>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
