import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function AdminReports() {

  const [reports, setReports] = useState([]);

  const fetchReports = () => {
    fetch(`${API_BASE}/admin/reports`)
      .then(res => res.json())
      .then(data => {
        setReports(data);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);


  const resolveReport = (reportId) => {

    fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, {
      method: "POST"
    })
    .then(() => fetchReports());
  };


  const deleteShoutout = (shoutoutId) => {

    fetch(`${API_BASE}/admin/reports/shoutout/${shoutoutId}`, {
      method: "DELETE"
    })
    .then(() => fetchReports());
  };


  return (

    <div style={{padding:"20px"}}>

      <h1>Reported Shout-Outs</h1>

      {reports.length === 0 && <p>No reports found</p>}

      {reports.map(report => (

        <div
          key={report.id}
          style={{
            border:"1px solid #ccc",
            padding:"15px",
            marginBottom:"15px",
            borderRadius:"10px"
          }}
        >

          <h3>Report #{report.id}</h3>

          <p>
            <strong>Reason:</strong> {report.reason}
          </p>

          <p>
            <strong>Reported By:</strong> {report.reported_by}
          </p>

          <button
            onClick={() => resolveReport(report.id)}
            style={{marginRight:"10px"}}
          >
            Resolve Report
          </button>

          <button
            onClick={() => deleteShoutout(report.shoutout_id)}
          >
            Delete Shoutout
          </button>

        </div>

      ))}

    </div>
  );
}

export default AdminReports;