import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ShoutoutCard from '../components/ShoutoutCard';
import CreateShoutoutModal from '../components/CreateShoutoutModal';
import Leaderboard from '../components/Leaderboard';
import Departments from '../components/Departments';

const API_URL = '/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Data States
  const [feedData, setFeedData] = useState([]);
  const [myShoutouts, setMyShoutouts] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [deptData, setDeptData] = useState([]);

  // Helper: authenticated fetch that redirects to login on 401
  const authFetch = async (url) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }
    if (!res.ok) return null;
    return res.json();
  };

  // 1. Load User & Initial Data
  useEffect(() => {
    authFetch(`${API_URL}/auth/me`)
      .then(user => {
        if (user && user.id) {
          setCurrentUser(user);
        }
      })
      .catch(err => console.error("Failed to load user:", err));
  }, []);

  // 2. Load Tab Data
  useEffect(() => {
    if (activeTab === 'feed') {
      authFetch(`${API_URL}/shoutouts/`).then(data => { if (Array.isArray(data)) setFeedData(data); }).catch(console.error);
    } else if (activeTab === 'my-shoutouts' && currentUser) {
      authFetch(`${API_URL}/shoutouts/my/${currentUser.id}`).then(data => { if (Array.isArray(data)) setMyShoutouts(data); }).catch(console.error);
    } else if (activeTab === 'leaderboard') {
      authFetch(`${API_URL}/shoutouts/leaderboard`).then(data => { if (Array.isArray(data)) setLeaderboardData(data); }).catch(console.error);
    } else if (activeTab === 'departments') {
      authFetch(`${API_URL}/shoutouts/departments`).then(data => { if (Array.isArray(data)) setDeptData(data); }).catch(console.error);
    }
  }, [activeTab, currentUser]);

  // 3. Handle Post
  const handlePost = async (data) => {
    if (!currentUser) return;

    const token = localStorage.getItem('token');
    const payload = {
      message: data.message,
      recipient_ids: data.recipient_ids,
      tags: data.tags
    };

    try {
      const response = await fetch(`${API_URL}/shoutouts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh feed
        const newData = await authFetch(`${API_URL}/shoutouts/`);
        if (Array.isArray(newData)) setFeedData(newData);
        setActiveTab('feed');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Post failed:", error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenModal={() => setIsModalOpen(true)} user={currentUser} />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'feed' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Activity Feed</h2>
              {feedData.length === 0 ? <p className="text-gray-400">No shoutouts yet. Be the first!</p> : feedData.map(post => <ShoutoutCard key={post.id} data={post} />)}
            </div>
          )}

          {activeTab === 'my-shoutouts' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Shout-outs</h2>
              {myShoutouts.map(post => <ShoutoutCard key={post.id} data={post} />)}
            </div>
          )}

          {activeTab === 'leaderboard' && <Leaderboard data={leaderboardData} />}
          {activeTab === 'departments' && <Departments data={deptData} />}
        </div>
      </div>

      <CreateShoutoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handlePost}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Dashboard;