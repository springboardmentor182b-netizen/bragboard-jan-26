import React, { useState, useEffect } from 'react';
import { Trophy, Award } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CURRENT_USER_ID = 1;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/shoutouts/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
    setLoading(false);
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400';
    if (rank === 2) return 'bg-gray-300';
    if (rank === 3) return 'bg-orange-400';
    return 'bg-[#D8C4B6]';
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">Leaderboard</h1>
        <p className="text-[#3E5879] mt-1">See who's leading in employee recognition</p>
      </div>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#213555] text-white rounded-full">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">All Time</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#213555]">Top Performers</h2>
            <p className="text-sm text-[#3E5879] mt-1">Rankings based on shoutouts received</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.user.id === CURRENT_USER_ID;
                
                return (
                  <div
                    key={entry.user.id}
                    className={`p-6 flex items-center gap-4 transition-colors ${
                      isCurrentUser ? 'bg-[#F5EFE7]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${getMedalColor(rank)} flex items-center justify-center font-bold text-white flex-shrink-0`}>
                      {rank <= 3 ? (
                        <Trophy className="w-6 h-6" />
                      ) : (
                        `#${rank}`
                      )}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {entry.user.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#213555]">
                          {entry.user.name}
                        </h3>
                        {isCurrentUser && (
                          <span className="px-2 py-1 bg-[#213555] text-white text-xs rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#3E5879] truncate">{entry.user.email}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-[#3E5879] mb-1">{entry.user.department}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Award className="w-5 h-5 text-[#213555]" />
                        <span className="text-2xl font-bold text-[#213555]">{entry.shoutouts}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-[#D8C4B6] mx-auto mb-4" />
              <p className="text-[#3E5879]">No leaderboard data yet. Start giving shoutouts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
