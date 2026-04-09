import React, { useEffect, useState } from "react";
import { Users, Zap, Award, Star, MessageSquare, TrendingUp, ChevronRight } from "lucide-react";
import "./AdminAnalytics.css";

const API = process.env.REACT_APP_API_URL;

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="analytics-loading flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
  
  if (!stats) return <div className="p-8 text-center text-gray-500">Error loading analytics data.</div>;

  const overviewItems = [
    { label: "Total Users", value: stats.overview.total_users, icon: <Users size={24} />, color: "purple" },
    { label: "Active Users", value: stats.overview.active_users, icon: <TrendingUp size={24} />, color: "green" },
    { label: "Shout-Outs", value: stats.overview.total_shoutouts, icon: <Award size={24} />, color: "orange" },
    { label: "Reactions", value: stats.overview.total_reactions, icon: <Star size={24} />, color: "red" },
    { label: "Comments", value: stats.overview.total_comments, icon: <MessageSquare size={24} />, color: "blue" },
    { label: "Avg/User", value: stats.overview.avg_per_user, icon: <Zap size={24} />, color: "indigo" },
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-purple-600" /> Platform Analysis
        </h2>
        <p className="text-gray-500">Insights and performance metrics for BragBoard</p>
      </div>

      {/* Platform Overview */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Platform Overview</h3>
        <div className="analytics-grid-overview">
          {overviewItems.map((item, idx) => (
            <div key={idx} className={`stat-card ${item.color}`}>
              <div className="stat-icon">{item.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{item.value.toLocaleString()}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Performance */}
      <section className="mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-1 text-gray-800">Department Performance</h3>
          <p className="text-sm text-gray-500 mb-6">Engagement and activity by department</p>
          
          <div className="dept-list space-y-4">
            {stats.department_performance.map((dept, idx) => (
              <div key={idx} className="dept-card bg-purple-50/30 rounded-xl p-4 flex flex-wrap items-center justify-between border border-purple-100/50">
                <div className="dept-name-section min-w-[150px]">
                  <h4 className="font-bold text-gray-800">{dept.name}</h4>
                  <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {dept.engagement_pct}% engaged
                  </div>
                </div>
                
                <div className="dept-metric text-center px-4 border-l border-purple-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Team Size</div>
                  <div className="text-xl font-bold text-purple-700">{dept.team_size}</div>
                </div>
                
                <div className="dept-metric text-center px-4 border-l border-purple-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shout-Outs</div>
                  <div className="text-xl font-bold text-orange-600">{dept.shoutouts}</div>
                </div>
                
                <div className="dept-metric text-center px-4 border-l border-purple-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg per User</div>
                  <div className="text-xl font-bold text-blue-600">{dept.avg_per_user}</div>
                </div>
                
                <div className="dept-action">
                  <button className="p-2 hover:bg-white rounded-full transition-colors text-purple-300 hover:text-purple-600">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="dual-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Contributors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-1 text-gray-800">Top Contributors</h3>
          <p className="text-sm text-gray-500 mb-6">Most active users this month</p>
          
          <div className="contributors-list space-y-4">
            {stats.top_contributors.map((user, idx) => (
              <div key={idx} className="contributor-item flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="rank-badge w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                    {user.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-bold">{user.sent} sent</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{user.received} received</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Platform activity over the last 7 days</p>
          
          <div className="activity-timeline space-y-4">
            {stats.recent_activity.map((day, idx) => (
              <div key={idx} className="activity-day p-4 border border-gray-50 rounded-xl hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-700">{day.day}</span>
                  <TrendingUp size={14} className="text-green-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Shout-Outs</div>
                    <div className="font-bold text-orange-500">{day.shoutouts}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Reactions</div>
                    <div className="font-bold text-red-500">{day.reactions}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Comments</div>
                    <div className="font-bold text-blue-500">{day.comments}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;