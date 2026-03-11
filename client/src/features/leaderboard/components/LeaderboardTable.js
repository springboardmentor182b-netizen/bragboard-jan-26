import React from "react";
import LeaderboardCard from "./LeaderboardCard";

const LeaderboardTable = ({ title, icon, data = [], scoreLabel, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

      {/* Section heading */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>

      {/* Loading skeleton — same animate-pulse style used in this project */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-2">🏆</p>
          <p className="text-sm">No data for this period yet.</p>
        </div>
      )}

      {/* Cards — max 10 entries */}
      {!loading &&
        data.slice(0, 10).map((user, index) => (
          <LeaderboardCard
            key={user.id ?? index}
            rank={index + 1}
            name={user.name}
            department={user.department}
            score={user.score}
            scoreLabel={scoreLabel}
          />
        ))}
    </div>
  );
};

export default LeaderboardTable;
