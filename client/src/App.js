import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './layout/Sidebar';

// Employee pages
import Dashboard from './pages/Dashboard';
import ShoutoutFeed from './features/shoutouts/components/ShoutoutFeed';
import ShoutoutForm from './features/shoutouts/components/ShoutoutForm';
import MyShoutouts from './pages/MyShoutouts';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile';

// Admin pages
import AdminPanel from './pages/AdminPanel';

// Auth pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/Forgotpassword';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes with Sidebar */}
        <Route path="/" element={user ? <Sidebar /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="shoutout-feed" element={<ShoutoutFeed />} />
          <Route path="create-shoutout" element={<ShoutoutForm recipientOptions={[]} />} />
          <Route path="my-shoutouts" element={<MyShoutouts />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<MyProfile />} />
          
          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <Route path="admin" element={<AdminPanel />} />
          )}
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
