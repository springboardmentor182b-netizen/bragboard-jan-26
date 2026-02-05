import React, { useEffect, useState } from "react";
import {
  fetchReports,
  resolveReport,
  deleteShoutout,
} from "../features/admin/services/reportService";

const AdminReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await fetchReports();
    setReports(data || []);
    setLoading(false);
  };

  const handleResolve = async (id) => {
    await resolveReport(id);
    loadReports();
  };

  const handleDelete = async (shoutoutId) => {
    await deleteShoutout(shoutoutId);
    loadReports();
  };

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading reports...</h3>;
  }

  return (
    <div style={{ padding: "30px", background: "#f5f3ff", minHeight: "100vh" }}>
      <h1 style={{ color: "#7c3aed" }}>
        Admin Report Moderation
      </h1>

      <table
        style={{
          width: "100%",
          background: "white",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Shoutout ID</th>
            <th>Reported By</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.shoutout_id}</td>
              <td>{r.reported_by}</td>
              <td>{r.reason}</td>
              <td>
                <button
                  onClick={() => handleResolve(r.id)}
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Resolve
                </button>

                <button
                  onClick={() => handleDelete(r.shoutout_id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportModeration;
