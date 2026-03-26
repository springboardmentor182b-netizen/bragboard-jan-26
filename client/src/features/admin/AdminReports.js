import React, { useEffect, useState } from "react";
import "./AdminLayout.css"; // make sure CSS is imported

const API_BASE = process.env.REACT_APP_API_URL;

function AdminReports() {

  const [reports, setReports] = useState([]);

  const fetchReports = () => {
    fetch(`${API_BASE}/admin/reports`)
      .then(res => res.json())
      .then(data => setReports(data));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = (reportId) => {
    fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, {
      method: "POST"
    }).then(() => fetchReports());
  };

  const deleteShoutout = (shoutoutId) => {
    fetch(`${API_BASE}/admin/reports/shoutout/${shoutoutId}`, {
      method: "DELETE"
    }).then(() => fetchReports());
  };

  return (
    <div className="report-container">

      <h2>Reported Content</h2>
      <p style={{ color: "#777" }}>
        Review reports and take appropriate action
      </p>

      {reports.length === 0 && <p>No reports found</p>}

      {reports.map((report) => (

        <div className="report-card" key={report.id}>

          {/* Header */}
          <div className="report-header">
            <div className="report-title">🚩 Report #{report.id}</div>
            <div className="report-status">Pending Review</div>
          </div>

          <hr style={{ margin: "15px 0", opacity: 0.2 }} />

          {/* Message box */}
          <div className="report-message">
            <div className="report-user">
              User {report.reported_by}
            </div>

            <div className="report-text">
              Shoutout ID: {report.shoutout_id}
            </div>
          </div>

          {/* Reason */}
          <p style={{ marginTop: "15px" }}>
            <strong>Reason:</strong>
          </p>

          <span className="tag tag-red">
            {report.reason}
          </span>
          {/* Actions */}
          <div className="report-actions">
            <button
              className="btn btn-delete"
              onClick={() => deleteShoutout(report.shoutout_id)}
            >
              🗑 Delete Shout-Out
            </button>
            <button
              className="btn btn-dismiss"
              onClick={() => resolveReport(report.id)}
            >
              ❌ Dismiss
            </button>
            <button
              className="btn btn-review"
              onClick={() => resolveReport(report.id)}
            >
              ✔ Mark as Reviewed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default AdminReports;