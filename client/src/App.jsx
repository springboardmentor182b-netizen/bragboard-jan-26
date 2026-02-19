import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ShoutoutCard from './components/ShoutoutCard';
import CreateShoutoutModal from './components/CreateShoutoutModal';
import Leaderboard from './components/Leaderboard';
import Departments from './components/Departments';
import { config } from './config/env';

const API_URL = config.apiBaseUrl;

function App() {
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
        fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then(users => {
                // Try to find User ID 1. If not found, pick the first user available.
                const me = users.find(u => u.id === 1) || users[0];
                if (me) {
                    setCurrentUser(me);
                } else {
                    console.error("No users found in database! Please run the SQL insert commands.");
                }
            })
            .catch(err => console.error("Failed to load users:", err));
    }, []);

    // 2. Load Tab Data
    useEffect(() => {
        if (activeTab === 'feed') {
            fetch(`${API_URL}/shoutouts`).then(res => res.json()).then(setFeedData).catch(console.error);
        } else if (activeTab === 'my-shoutouts' && currentUser) {
            fetch(`${API_URL}/shoutouts/my/${currentUser.id}`).then(res => res.json()).then(setMyShoutouts).catch(console.error);
        } else if (activeTab === 'leaderboard') {
            fetch(`${API_URL}/shoutouts/leaderboard`).then(res => res.json()).then(setLeaderboardData).catch(console.error);
        } else if (activeTab === 'departments') {
            fetch(`${API_URL}/shoutouts/departments`).then(res => res.json()).then(setDeptData).catch(console.error);
        }
    }, [activeTab, currentUser]);

    // 3. ROBUST HANDLE POST FUNCTION
    const handlePost = async (data) => {
        if (!currentUser) {
            alert("Error: You are not logged in. Please check your database has users.");
            return;
        }

        const payload = {
            sender_id: currentUser.id,
            message: data.message,
            recipient_ids: data.recipient_ids,
            tags: data.tags
        };

        try {
            const response = await fetch(`${API_URL}/shoutouts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Refresh feed immediately
                const res = await fetch(`${API_URL}/shoutouts`);
                const newData = await res.json();
                setFeedData(newData);
                setActiveTab('feed'); // Switch back to feed to see your post
                alert("Shoutout Posted Successfully! 🎉");
            } else {
                const errorText = await response.text();
                alert("Server Error: " + errorText);
            }
        } catch (error) {
            console.error("Post failed:", error);
            alert("Failed to connect to server.");
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
}
export default App;