import React, { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:4000/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(res.data);
    } catch (err) {
      alert("Error fetching reports");
    }
  };

  return (
    <div className="container">
      <h2>System Reports</h2>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table border="1" width="100%" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Membership No</th>
              <th>Report Type</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.membership_number}</td>
                <td>{report.report_type}</td>
                <td>{report.description}</td>
                <td>{report.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reports;
