import React from "react";
import { Trophy } from "lucide-react";
import useLeaderboard from "../features/leaderboard/hooks/useLeaderboard";
import LeaderboardTable from "../features/leaderboard/components/LeaderboardTable";
import PeriodFilter from "../features/leaderboard/components/PeriodFilter";

const Leaderboard = () => {
  const {
    period,
    setPeriod,
    topSenders,
    mostRecognised,
    topReactors,
    loading,
    error,
  } = useLeaderboard();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">
            Celebrate your most active and appreciated team members
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium">
          <Trophy className="w-5 h-5" />
          <span>Top Contributors</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-900">
            Recognition Leaderboard
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          See who is leading in appreciation — top senders, most recognised, and top reactors.
        </p>
        <PeriodFilter selected={period} onChange={setPeriod} />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeaderboardTable
          title="Top Senders"
          icon="📣"
          data={topSenders}
          scoreLabel="shout-outs sent"
          loading={loading}
        />
        <LeaderboardTable
          title="Most Recognised"
          icon="🌟"
          data={mostRecognised}
          scoreLabel="shout-outs received"
          loading={loading}
        />
        <LeaderboardTable
          title="Top Reactors"
          icon="👏"
          data={topReactors}
          scoreLabel="reactions given"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Leaderboard;