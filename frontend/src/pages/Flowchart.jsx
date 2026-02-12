import React from "react";
import "../style.css";

function Flowchart() {
  return (
    <div className="container">
      <h2>System Flowchart</h2>

      <div className="flowchart-box">
        <p>Admin Login</p>
        <span>↓</span>
        <p>Add Membership</p>
        <span>↓</span>
        <p>Generate Transaction</p>
        <span>↓</span>
        <p>Generate Report</p>
        <span>↓</span>
        <p>Update / Cancel Membership</p>
        <span>↓</span>
        <p>Generate Transaction & Report</p>
      </div>
    </div>
  );
}

export default Flowchart;
