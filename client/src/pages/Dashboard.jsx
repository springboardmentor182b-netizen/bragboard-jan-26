import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ShoutoutCard from '../components/ShoutoutCard';
import CreateShoutoutModal from '../components/CreateShoutoutModal';
import Leaderboard from '../components/Leaderboard';
import Departments from '../components/Departments';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Data States
  const [feedData, setFeedData] = useState([]);
  const [myShoutouts, setMyShoutouts] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [deptData, setDeptData] = useState([]);

  // 1. Load User & Initial Data
  useEffect(() => {
    fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(user => {
        if (user && user.id) {
          setCurrentUser(user);
        }
      })
      .catch(err => console.error("Failed to load user:", err));
  }, []);

  // 2. Load Tab Data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    if (activeTab === 'feed') {
      fetch(`${API_URL}/shoutouts`, { headers }).then(res => res.json()).then(setFeedData).catch(console.error);
    } else if (activeTab === 'my-shoutouts' && currentUser) {
      fetch(`${API_URL}/shoutouts/my/${currentUser.id}`, { headers }).then(res => res.json()).then(setMyShoutouts).catch(console.error);
    } else if (activeTab === 'leaderboard') {
      fetch(`${API_URL}/shoutouts/leaderboard`, { headers }).then(res => res.json()).then(setLeaderboardData).catch(console.error);
    } else if (activeTab === 'departments') {
      fetch(`${API_URL}/shoutouts/departments`, { headers }).then(res => res.json()).then(setDeptData).catch(console.error);
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
        const res = await fetch(`${API_URL}/shoutouts`, { headers: { 'Authorization': `Bearer ${token}` } });
        const newData = await res.json();
        setFeedData(newData);
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