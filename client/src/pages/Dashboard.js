import React, { useState, useEffect } from 'react';
import { Award, Send, Trophy } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CURRENT_USER_ID = 1;

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[#3E5879] mb-1">{label}</p>
        <p className="text-4xl font-bold text-[#213555]">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ShoutoutCard = ({ shoutout }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {shoutout.sender.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[#213555] truncate">{shoutout.sender.name}</h3>
            <p className="text-sm text-[#3E5879] truncate">{shoutout.sender.email}</p>
          </div>
          <span className="text-xs text-[#3E5879] ml-2 flex-shrink-0">
            {new Date(shoutout.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-[#213555] mb-3">{shoutout.message}</p>
        <div className="flex gap-2 flex-wrap">
          {shoutout.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-[#D8C4B6] text-[#213555] text-xs rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shoutouts/dashboard/${CURRENT_USER_ID}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      setStats({
        shoutouts_received: 24,
        shoutouts_given: 18,
        leaderboard_rank: 7,
        recent_shoutouts: []
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">Dashboard</h1>
        <p className="text-[#3E5879] mt-1">Welcome back! Keep spreading positivity.</p>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard icon={Award} label="Shoutouts Received" value={stats?.shoutouts_received || 0} color="bg-[#213555]" />
              <StatCard icon={Send} label="Shoutouts Given" value={stats?.shoutouts_given || 0} color="bg-[#3E5879]" />
              <StatCard icon={Trophy} label="Leaderboard Rank" value={`#${stats?.leaderboard_rank || 0}`} color="bg-[#D8C4B6] text-[#213555]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#213555] mb-4">Recent Shoutouts</h2>
              <p className="text-[#3E5879] mb-6">Your latest recognition activity</p>
              {stats?.recent_shoutouts && stats.recent_shoutouts.length > 0 ? (
                stats.recent_shoutouts.map(shoutout => (
                  <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
                  <Award className="w-16 h-16 text-[#D8C4B6] mx-auto mb-4" />
                  <p className="text-[#3E5879]">No shoutouts yet. Be the first to spread some positivity!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
