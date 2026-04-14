import React, { useEffect, useState } from "react";
import { Flag, Trash2, XCircle, CheckCircle } from "lucide-react";
import "./AdminLayout.css";

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
    if (!shoutoutId) {
      alert("Shout-out ID not found.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this shout-out? This action cannot be undone.")) return;
    
    fetch(`${API_BASE}/admin/reports/shoutout/${shoutoutId}`, {
      method: "DELETE"
    }).then(() => fetchReports());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="report-container">
      <div className="report-page-header">
        <h2>Reported Content</h2>
        <p className="subtitle">Review reports and take appropriate action</p>
      </div>

      {reports.length === 0 && <p className="text-gray-500 mt-4">No reports found.</p>}

      {reports.map((report) => (
        <div className="report-card" key={report.id}>
          {/* Header */}
          <div className="report-header">
            <div className="report-title-section">
              <div className="report-title">
                <Flag size={20} className="text-red-500" /> Report #{report.id}
              </div>
              <div className="report-date text-sm text-gray-500 mt-1 ml-7">
                Reported on {formatDate(report.created_at)}
              </div>
            </div>
            <div className="report-status">Pending Review</div>
          </div>

          <hr className="report-divider" />

          {/* Message box */}
          {report.shoutout ? (
            <div className="report-message">
              <div className="shoutout-meta">
                <div className="shoutout-users font-semibold text-gray-800">
                  {report.shoutout.sender_name} <span className="text-gray-400 font-normal">→</span> <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-sm font-medium">{report.shoutout.recipient_name}</span>
                </div>
                <div className="shoutout-date text-xs text-gray-400 mt-0.5">
                  {formatDate(report.shoutout.created_at)}
                </div>
              </div>
              <div className="report-text text-gray-700 mt-3 text-sm">
                {report.shoutout.content}
              </div>
            </div>
          ) : (
            <div className="report-message">
              <p className="text-gray-500 italic">Original shoutout data not found or has been deleted.</p>
            </div>
          )}

          {/* Details Section */}
          <div className="report-details-section">
            <p className="text-sm text-gray-900 mt-3">
              <strong>Reported by:</strong> {report.reported_by_name}
            </p>
            <p className="text-sm text-gray-900 mt-1 flex items-center">
              <strong>Reason:</strong> 
              <span className="tag tag-red ml-2">{report.reason}</span>
            </p>
            {report.details && (
              <div className="text-sm text-gray-900 mt-2">
                <strong>Details:</strong>
                <p className="italic text-gray-600 mt-1">{report.details}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="report-actions">
            <button
              className="btn btn-delete outline-none flex items-center gap-2"
              onClick={() => deleteShoutout(report.shoutout?.id)}
            >
              <Trash2 size={16} /> Delete Shout-Out
            </button>
            <button
              className="btn btn-dismiss outline-none flex items-center gap-2"
              onClick={() => resolveReport(report.id)}
            >
              <XCircle size={16} /> Dismiss Report
            </button>
            <button
              className="btn btn-review outline-none flex items-center gap-2"
              onClick={() => resolveReport(report.id)}
            >
              <CheckCircle size={16} /> Mark as Reviewed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminReports;