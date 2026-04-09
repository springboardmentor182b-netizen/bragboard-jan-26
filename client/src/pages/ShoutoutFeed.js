import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const REPORT_REASONS = [
  "Inappropriate content",
  "Spam or misleading",
  "Harassment or bullying",
  "False information",
  "Other",
];

const ShoutoutFeed = () => {
  const { token } = useContext(AuthContext);
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(null); // shoutout id
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shoutouts/feed`);
      const data = await response.json();
      setShoutouts(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    }
    setLoading(false);
  };

  const openReport = (shoutoutId) => {
    setReportModal(shoutoutId);
    setReason("");
    setCustomReason("");
    setReportSuccess("");
    setReportError("");
  };

  const closeReport = () => {
    setReportModal(null);
    setReason("");
    setCustomReason("");
    setReportSuccess("");
    setReportError("");
  };

  const submitReport = async () => {
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) {
      setReportError("Please select or enter a reason.");
      return;
    }
    setReporting(true);
    setReportError("");
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shoutout_id: reportModal,
          reason: finalReason,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      setReportSuccess("Report submitted successfully. Our team will review it.");
      setTimeout(() => closeReport(), 2000);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">Shoutout Feed</h1>
        <p className="text-[#3E5879] mt-1">See all the recognition happening across the company</p>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#213555] mb-2">Recent Activity</h2>
          <p className="text-[#3E5879]">Latest shoutouts from the team</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : shoutouts.length > 0 ? (
          shoutouts.map(shoutout => (
            <div key={shoutout.id} className="bg-white rounded-lg p-6 border border-gray-200 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {shoutout.sender.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#213555]">{shoutout.sender.name}</h3>
                      <span className="text-[#3E5879]">recognized</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {shoutout.recipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#D8C4B6] flex items-center justify-center text-[#213555] font-bold text-xs">
                            {recipient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-[#213555]">{recipient.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[#213555] mb-3">{shoutout.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {shoutout.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#D8C4B6] text-[#213555] text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs text-[#3E5879]">
                        {new Date(shoutout.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <button
                        onClick={() => openReport(shoutout.id)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                        title="Report this shoutout"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V5a2 2 0 012-2h14l-4 4H5v14" />
                        </svg>
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <p className="text-[#3E5879]">No shoutouts yet. Be the first to recognize someone!</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#213555]">Report Shoutout</h3>
              <button
                onClick={closeReport}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-[#3E5879] mb-4">
              Help us understand what's wrong with this shoutout.
            </p>

            {reportSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm text-center">
                {reportSuccess}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        reason === r
                          ? "border-[#213555] bg-[#f0f4ff]"
                          : "border-gray-200 hover:border-[#213555]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="accent-[#213555]"
                      />
                      <span className="text-sm text-[#213555]">{r}</span>
                    </label>
                  ))}
                </div>

                {reason === "Other" && (
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-[#213555] resize-none focus:outline-none focus:border-[#213555] mb-4"
                    rows={3}
                    placeholder="Please describe the issue..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                )}

                {reportError && (
                  <p className="text-red-500 text-sm mb-3">{reportError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={closeReport}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-600 text-[#3E5879] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={reporting}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {reporting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoutoutFeed;