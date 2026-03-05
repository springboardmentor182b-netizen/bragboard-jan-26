import React, { useState } from "react";

const statusStyle = {
  pending:   "bg-yellow-100 text-yellow-700",
  resolved:  "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-500",
};

const ReportCard = ({ report, actionLoading, onResolve, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  if (!report) return null;

  const isPending = report.status === "pending";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Card Header */}
      <div className="flex items-start justify-between p-4 gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-700 text-white text-sm
                          font-bold flex items-center justify-center shrink-0">
            {report.reporter?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + status badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-800 text-sm">
                {report.reporter?.name || "Unknown User"}
              </span>
              <span className="text-gray-400 text-xs">reported a shoutout</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                               capitalize ${statusStyle[report.status] || ""}`}>
                {report.status}
              </span>
            </div>

            {/* Reason */}
            <p className="text-sm text-red-600 mt-1">
              <span className="font-medium">🚩 Reason: </span>
              {report.reason || "No reason provided"}
            </p>

            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-0.5">
              {report.created_at
                ? new Date(report.created_at).toLocaleString()
                : ""}
            </p>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-blue-600 hover:underline shrink-0 mt-1"
        >
          {expanded ? "Hide ▲" : "View Shoutout ▼"}
        </button>
      </div>

      {/* Shoutout Message Preview */}
      {expanded && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Reported Message
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {report.shoutout?.message || "Shoutout content unavailable"}
          </p>
        </div>
      )}

      {/* Admin Actions — only for pending */}
      {isPending && (
        <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
          <button
            onClick={() => onResolve(report.id, "dismissed")}
            disabled={!!actionLoading}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-300
                       text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {actionLoading === `${report.id}-dismissed` ? "..." : "✓ Dismiss"}
          </button>

          <button
            onClick={() => onResolve(report.id, "resolved")}
            disabled={!!actionLoading}
            className="px-3 py-1.5 rounded-lg text-sm bg-green-600 text-white
                       hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading === `${report.id}-resolved` ? "..." : "✅ Mark Resolved"}
          </button>

          <button
            onClick={() => onDelete(report.id)}
            disabled={!!actionLoading}
            className="px-3 py-1.5 rounded-lg text-sm bg-red-500 text-white
                       hover:bg-red-600 disabled:opacity-50"
          >
            {actionLoading === `${report.id}-delete` ? "..." : "🗑 Delete Shoutout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportCard;