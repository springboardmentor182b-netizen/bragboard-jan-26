import React from "react";

// Medal styles for rank 1, 2, 3 — matching project's blue-900 theme
const RANK_BADGE = {
  1: "bg-yellow-400 text-white",
  2: "bg-gray-400 text-white",
  3: "bg-orange-400 text-white",
};
const RANK_LABEL = { 1: "🥇", 2: "🥈", 3: "🥉" };

const LeaderboardCard = ({ rank, name, department, score, scoreLabel }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm mb-3">

      {/* Rank badge */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
        ${RANK_BADGE[rank] ?? "bg-blue-900 text-white"}`}>
        {RANK_LABEL[rank] ?? rank}
      </div>

      {/* Avatar with initials */}
      <div className="w-9 h-9 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
        {initials}
      </div>

      {/* Name and department */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">{department}</p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-blue-900">{score}</p>
        <p className="text-xs text-gray-400">{scoreLabel}</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;
