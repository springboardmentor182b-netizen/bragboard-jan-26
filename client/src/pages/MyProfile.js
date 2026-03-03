import React, { useState, useEffect } from 'react';
import { Award, Send, Trophy, Calendar } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CURRENT_USER_ID = 1;

const MyProfile = () => {
  const [userStats, setUserStats] = useState(null);
  const [receivedShoutouts, setReceivedShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [statsRes, receivedRes] = await Promise.all([
        fetch(`${API_BASE}/users/${CURRENT_USER_ID}/stats`),
        fetch(`${API_BASE}/shoutouts/user/${CURRENT_USER_ID}/received`)
      ]);
      
      const statsData = await statsRes.json();
      const receivedData = await receivedRes.json();
      
      setUserStats(statsData);
      setReceivedShoutouts(receivedData.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    setLoading(false);
  };

  const StatBox = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl font-bold text-[#213555] mb-1">{value}</p>
      <p className="text-sm text-[#3E5879]">{label}</p>
    </div>
  );

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">My Profile</h1>
        <p className="text-[#3E5879] mt-1">View your information and recognition statistics</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : userStats ? (
        <div className="p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-gray-200 text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {userStats.user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-2xl font-bold text-[#213555] mb-1">{userStats.user.name}</h2>
                <p className="text-[#3E5879] mb-1">{userStats.user.email}</p>
                <p className="text-sm font-semibold text-[#213555] mb-1">{userStats.user.job_title}</p>
                <p className="text-sm text-[#3E5879] mb-4">{userStats.user.department}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-[#3E5879]">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(userStats.user.joined_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {userStats.top_tags && userStats.top_tags.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-[#213555] mb-4">Top Recognition Tags</h3>
                  <p className="text-sm text-[#3E5879] mb-4">Most common tags in your received shoutouts</p>
                  <div className="space-y-3">
                    {userStats.top_tags.map((tag, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#213555]">{tag.name}</span>
                          <span className="text-sm font-bold text-[#213555]">{tag.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#213555] h-2 rounded-full transition-all"
                            style={{ width: `${(tag.count / userStats.top_tags[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <StatBox
                  icon={Award}
                  label="Shoutouts Received"
                  value={userStats.shoutouts_received}
                  color="bg-[#213555]"
                />
                <StatBox
                  icon={Send}
                  label="Shoutouts Given"
                  value={userStats.shoutouts_given}
                  color="bg-[#3E5879]"
                />
                <StatBox
                  icon={Trophy}
                  label="Leaderboard Rank"
                  value={`#${userStats.leaderboard_rank}`}
                  color="bg-[#D8C4B6] text-[#213555]"
                />
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#213555]">Recent Recognition</h3>
                    <p className="text-sm text-[#3E5879]">Latest shoutouts you've received</p>
                  </div>
                  <button className="text-sm font-semibold text-[#213555] hover:text-[#3E5879] transition-colors">
                    View All
                  </button>
                </div>

                {receivedShoutouts.length > 0 ? (
                  <div className="space-y-4">
                    {receivedShoutouts.map(shoutout => (
                      <div key={shoutout.id} className="p-4 bg-[#F5EFE7] rounded-lg">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {shoutout.sender.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#213555]">{shoutout.sender.name} recognized you</p>
                            <p className="text-sm text-[#213555] mt-1">{shoutout.message}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap ml-13">
                          {shoutout.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#D8C4B6] text-[#213555] text-xs rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-[#D8C4B6] mx-auto mb-2" />
                    <p className="text-[#3E5879]">No shoutouts received yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-[#3E5879]">Failed to load profile data</p>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
