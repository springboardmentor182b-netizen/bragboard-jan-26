import React, { useState } from "react";
import ReportModal from "./ReportModal";

const ShoutoutCard = ({ shoutout, onDelete, isAdmin = false }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const userRole = localStorage.getItem('role');

  const isImage = shoutout.attachment_type?.startsWith('image/');
  const isDocument = shoutout.attachment_type?.includes('pdf') || shoutout.attachment_type?.includes('word');

  return (
    <div className="shoutout-card">
      <div className="card-header">
        <div>
          <span className="card-sender">
            {shoutout.sender_name || `User #${shoutout.sender_id}`}
          </span>
          {shoutout.department && (
            <span className="card-department">🏢 {shoutout.department}</span>
          )}
        </div>
        <span className="card-date">
          {new Date(shoutout.created_at).toLocaleString()}
        </span>
      </div>
      
      <p className="card-message">{shoutout.message}</p>
      
      {shoutout.attachment_url && isImage && (
        <div className="card-attachment">
          <img 
            src={shoutout.attachment_url} 
            alt="Attachment"
            className="attachment-thumb"
            onClick={() => setShowFullImage(true)}
          />
        </div>
      )}
      
      {shoutout.attachment_url && isDocument && (
        <div className="card-attachment">
          <a href={shoutout.attachment_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
            📎 View Attachment
          </a>
        </div>
      )}
      
      <div className="card-recipients">
        <span className="recipients-label">🎯 To:</span>
        {shoutout.recipient_ids?.map((id) => (
          <span key={id} className="card-tag">@User#{id}</span>
        ))}
      </div>
      
      <div className="card-actions">
        {userRole !== 'admin' && !isAdmin && (
          <button
            className="btn-outline"
            onClick={() => setShowReportModal(true)}
          >
            ⚠️ Report
          </button>
        )}
        {(userRole === 'admin' || isAdmin) && (
          <button
            className="btn-danger"
            onClick={() => onDelete && onDelete(shoutout.id)}
          >
            🗑️ Delete
          </button>
        )}
      </div>
      
      {showReportModal && (
        <ReportModal
          shoutoutId={shoutout.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
      
      {showFullImage && (
        <div className="modal-overlay" onClick={() => setShowFullImage(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={shoutout.attachment_url} alt="Full size" />
            <button className="btn-primary" onClick={() => setShowFullImage(false)} style={{ marginTop: 16 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoutoutCard;
