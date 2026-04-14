import React, { useState } from "react";
import useReportShoutout from "../hooks/useReportShoutout";

const ReportModal = ({ shoutoutId, onClose }) => {
  const [reason, setReason] = useState("");
  const { reportShoutout, loading, error } = useReportShoutout(() => {
    alert("Shoutout reported.");
    onClose();
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h3>Report Shoutout</h3>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal__body">
          <label className="form-label">Reason for reporting</label>
          <textarea
            className="form-input"
            rows={4}
            placeholder="Describe why this shoutout is inappropriate..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal__footer">
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={() => reportShoutout(shoutoutId, reason)}
            disabled={loading || !reason.trim()}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
