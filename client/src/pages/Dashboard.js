import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateShoutOut from '../components/CreateShoutOut';
import ShoutOutFeed from '../components/ShoutOutFeed';
import { useAuth } from '../context/AuthContext';

import Leaderboard from '../components/Leaderboard';
import Profile from '../pages/Profile';

import MyShoutOuts from './MyShoutOuts';
import Notifications from './Notifications';
import Settings from './Settings';
import Help from './Help';

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-brand-light-bg">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-xl text-white">🏆</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-brand-orange leading-none">BragBoard</h1>
                        <span className="text-xs text-gray-500">Recognition Wall</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 cursor-pointer">
                    <span className="font-semibold text-gray-700">{user?.full_name || 'User'}</span>
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">
                        {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                </div>
            </header>

            {/* Layout Container */}
            <div className="pt-16 flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="feed" replace />} />
                        <Route path="feed" element={<ShoutOutFeed />} />
                        <Route path="create" element={<CreateShoutOut />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="mine" element={<MyShoutOuts />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="help" element={<Help />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
