import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import PostShoutout from './pages/PostShoutout';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="post-shoutout" element={<PostShoutout />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="my-shoutouts" element={<div className="p-4">My Shout-outs Page (Coming Soon)</div>} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
