import React, { useState } from "react";
import { shoutoutService } from "../services/shoutoutService";

const ShoutoutForm = ({ recipientOptions = [], onSuccess }) => {
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [department, setDepartment] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const departments = ["Engineering", "Sales", "Marketing", "HR", "Product", "Design", "Operations"];

  const toggleRecipient = (id) =>
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setAttachmentPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shoutoutService.createShoutout(
        1,
        message, 
        selectedRecipients, 
        department, 
        attachment
      );
      setMessage("");
      setSelectedRecipients([]);
      setDepartment("");
      setAttachment(null);
      setAttachmentPreview(null);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || "Failed to create shoutout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shoutout-form">
      <h2>Give a Shoutout</h2>
      
      <div className="form-group">
        <label className="form-label">Department</label>
        <select 
          className="form-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Tag Recipients</label>
        <div className="recipients-group">
          {recipientOptions.map((user) => (
            <button
              key={user.id}
              className={`tag-btn ${
                selectedRecipients.includes(user.id) ? "tag-btn--active" : ""
              }`}
              onClick={() => toggleRecipient(user.id)}
              type="button"
            >
              @{user.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Write something kind..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Add Attachment (Image/File)</label>
        <input
          type="file"
          className="form-file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleAttachmentChange}
        />
        {attachmentPreview && (
          <div className="attachment-preview">
            <img src={attachmentPreview} alt="Preview" />
            <button onClick={() => {
              setAttachment(null);
              setAttachmentPreview(null);
            }}>Remove</button>
          </div>
        )}
      </div>
      
      {error && <p className="form-error">{error}</p>}
      
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading || !message.trim() || selectedRecipients.length === 0}
      >
        {loading ? "Posting..." : "Post Shoutout"}
      </button>
    </div>
  );
};

export default ShoutoutForm;
