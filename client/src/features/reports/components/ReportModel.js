import { useState } from "react";
import { reportShoutout } from "../services/reports";

const REASONS = [
  "Inappropriate language",
  "Harassment or bullying",
  "False information",
  "Spam",
  "Other",
];

const ReportModal = ({ shoutoutId, onClose }) => {
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const finalReason = reason === "Other" ? custom.trim() : reason;
    if (!finalReason) { setError("Please select or enter a reason."); return; }

    setLoading(true);
    setError("");
    try {
      await reportShoutout(shoutoutId, finalReason);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Report Shoutout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-600 font-medium">Report submitted! Admin will review it.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Select a reason for reporting this shoutout.
            </p>

            {/* Reason Buttons */}
            <div className="flex flex-col gap-2 mb-4">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`text-left px-4 py-2 rounded-lg border text-sm transition ${
                    reason === r
                      ? "bg-blue-700 text-white border-blue-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {reason === "Other" && (
              <textarea
                rows={3}
                placeholder="Describe your reason..."
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm resize-none mb-3
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm
                           hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;