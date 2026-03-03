import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

function Dashboard() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {username}</h2>

      <div className="dashboard-grid">

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <Link to="/add-membership" className="dashboard-card">
              <h3>Add Membership</h3>
              <p>Create new member entries</p>
            </Link>

            <Link to="/update-membership" className="dashboard-card">
              <h3>Update Membership</h3>
              <p>Extend or cancel memberships</p>
            </Link>

            <Link to="/reports" className="dashboard-card">
              <h3>Reports</h3>
              <p>View all membership records</p>
            </Link>

            <Link to="/transactions" className="dashboard-card">
              <h3>Transactions</h3>
              <p>View payment history</p>
            </Link>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <Link to="/reports" className="dashboard-card">
              <h3>Reports</h3>
              <p>View all membership records</p>
            </Link>

            <Link to="/transactions" className="dashboard-card">
              <h3>Transactions</h3>
              <p>View payment history</p>
            </Link>
          </>
        )}

        {/* ================= VENDOR ================= */}
        {role === "vendor" && (
          <>
            <Link to="/add-service" className="dashboard-card">
              <h3>Add Service</h3>
              <p>Create and publish new service</p>
            </Link>

            <Link to="/my-services" className="dashboard-card">
              <h3>My Services</h3>
              <p>Manage, edit or delete your services</p>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;