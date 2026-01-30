import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ShoutoutCard from './components/ShoutoutCard';
import CreateShoutoutModal from './components/CreateShoutoutModal';

function App() {
  const [activeTab, setActiveTab] = useState('feed'); // Tracks the current page
  const [isModalOpen, setIsModalOpen] = useState(false); // Tracks if popup is showing
  const [shoutouts, setShoutouts] = useState([]);

  // Fetch shoutouts from backend
  useEffect(() => {
    fetch('http://localhost:8000/shoutouts')
      .then(res => res.json())
      .then(data => setShoutouts(data))
      .catch(err => console.error("API Error:", err));
  }, []);

  // Handle posting new shoutout
  const handlePostShoutout = (newPostData) => {
    fetch('http://localhost:8000/shoutouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: 1, // Hardcoded for now (Sarah)
        message: newPostData.message,
        recipient_ids: newPostData.recipient_ids,
        tags: newPostData.tags
      })
    })
    .then(res => {
      if(res.ok) {
        // Refresh feed after posting
        return fetch('http://localhost:8000/shoutouts');
      }
    })
    .then(res => res.json())
    .then(data => setShoutouts(data))
    .catch(err => alert("Failed to post. Check backend connection."));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. Sidebar with Props passed down */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenModal={() => setIsModalOpen(true)} 
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        
        {/* Dynamic Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            {activeTab === 'feed' && "Welcome back, Sarah! 👋"}
            {activeTab === 'my-shoutouts' && "My Shout-outs 👤"}
            {activeTab === 'leaderboard' && "Leaderboard 🏆"}
            {activeTab === 'departments' && "Departments 🏢"}
          </h1>
          <p className="opacity-90">
            {activeTab === 'feed' ? "Ready to celebrate your team's achievements today?" : "Track your recognition stats here."}
          </p>
        </div>

        {/* Conditional Page Rendering */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Activity Feed</h2>
                <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                  <option>All Categories</option>
                  <option>Teamwork</option>
                  <option>Innovation</option>
                </select>
              </div>
              
              {shoutouts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400">No shoutouts yet. Be the first to post!</p>
                </div>
              ) : (
                shoutouts.map(post => <ShoutoutCard key={post.id} data={post} />)
              )}
            </div>
          )}

          {activeTab === 'my-shoutouts' && (
            <div className="text-center py-20 text-gray-400">
               My Shoutouts Page (Coming Soon)
            </div>
          )}
          
          {/* Add other tabs similarly... */}
        </div>
      </div>

      {/* 3. The Modal Popup */}
      <CreateShoutoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPost={handlePostShoutout}
      />

    </div>
  );
}

export default App;