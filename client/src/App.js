import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateShoutout from './pages/CreateShoutout';
import ShoutoutFeed from './pages/ShoutoutFeed';
import MyShoutouts from './pages/MyShoutouts';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Forgotpassword from './pages/Auth/Forgotpassword';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const { user, token } = useContext(AuthContext);

  // If not authenticated, show auth pages
  if (!token || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated, show main app
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateShoutout />} />
          <Route path="/feed" element={<ShoutoutFeed />} />
          <Route path="/my-shoutouts" element={<MyShoutouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
