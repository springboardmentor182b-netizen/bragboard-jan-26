import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ShoutoutCard from './components/ShoutoutCard';
import CreateShoutoutModal from './components/CreateShoutoutModal';

// 1. Import Base URL from environment file
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shoutouts, setShoutouts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user

  // Load data when app starts
  useEffect(() => {
    // A. Fetch Shoutouts
    fetch(`${API_URL}/shoutouts`)
      .then(res => res.json())
      .then(data => setShoutouts(data))
      .catch(err => console.error("API Error:", err));

    // B. Fetch "Current User" (Simulating User ID 1 for now)
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(users => {
        const me = users.find(u => u.id === 1); // Get Sarah (ID 1)
        setCurrentUser(me);
      })
      .catch(err => console.error("User Fetch Error:", err));
  }, []);

  const handlePostShoutout = (newPostData) => {
    fetch(`${API_URL}/shoutouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: currentUser?.id || 1, 
        message: newPostData.message,
        recipient_ids: newPostData.recipient_ids,
        tags: newPostData.tags
      })
    })
    .then(res => {
      if(res.ok) return fetch(`${API_URL}/shoutouts`); // Refresh feed
    })
    .then(res => res.json())
    .then(data => setShoutouts(data));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Pass currentUser to Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenModal={() => setIsModalOpen(true)}
        user={currentUser} 
      />

      <div className="flex-1 ml-64 p-8">
        {/* Rest of your dashboard code... */}
        <div className="max-w-3xl">
           {shoutouts.map(post => <ShoutoutCard key={post.id} data={post} />)}
        </div>
      </div>

      <CreateShoutoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPost={handlePostShoutout}
      />
    </div>
  );
}

export default App;