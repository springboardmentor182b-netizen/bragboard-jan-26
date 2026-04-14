import React, { useEffect, useState } from "react";
import "./AdminReportModeration.css";
import { fetchReports, resolveReport, deleteShoutout } from "../features/admin/services/reportService";

function AdminReportModeration() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await fetchReports();
    setReports(data);
  };

  const handleResolve = async (id) => {
    await resolveReport(id);
    loadReports();
  };

  const handleDelete = async (shoutoutId) => {
    await deleteShoutout(shoutoutId);
    loadReports();
  };

  const totalReports = reports.length;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div className="sidebar-item">Account Management</div>
        <div className="sidebar-item active">Reported Shout-Outs</div>
        <div className="sidebar-item">Platform Analysis</div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <h1>Reported Shout-Outs</h1>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <p>Total Reports</p>
            <h3>{totalReports}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Review</p>
            <h3>{totalReports}</h3>
          </div>
          <div className="stat-card">
            <p>Reviewed</p>
            <h3>0</h3>
          </div>
        </div>

        {/* Reports */}
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <strong>Report #{report.id}</strong>
              <span className="reason-badge">{report.reason}</span>
            </div>

            {report.shoutout && (
  <div className="report-message">
    <strong>
      {report.shoutout.sender} → {report.shoutout.receiver}
    </strong>
    <p>{report.shoutout.message}</p>
  </div>
)}
            

            <p><strong>Reported by:</strong> {report.reported_by}</p>

            <div className="actions">
              <button
                className="btn-resolve"
                onClick={() => handleResolve(report.id)}
              >
                Resolve
              </button>

              {report.shoutout && (
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(report.shoutout.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReportModeration;