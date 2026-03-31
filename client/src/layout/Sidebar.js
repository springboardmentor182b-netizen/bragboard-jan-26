import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, Home, Send, MessageSquare, Trophy, UserCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 h-screen bg-[#213555] text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-[#3E5879]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D8C4B6] flex items-center justify-center">
            <Award className="w-6 h-6 text-[#213555]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">BragBoard</h1>
            <p className="text-xs text-[#D8C4B6]">Employee Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs text-[#D8C4B6] mb-2 font-semibold">Main</p>
          <Link to="/dashboard" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/dashboard' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/create" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/create' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Send className="w-5 h-5" />
            <span>Create Shoutout</span>
          </Link>
          <Link to="/feed" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/feed' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <MessageSquare className="w-5 h-5" />
            <span>Shoutout Feed</span>
          </Link>
        </div>

        <div>
          <p className="text-xs text-[#D8C4B6] mb-2 font-semibold">Activity</p>
          <Link to="/my-shoutouts" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/my-shoutouts' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Award className="w-5 h-5" />
            <span>My Shoutouts</span>
          </Link>
          <Link to="/leaderboard" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/leaderboard' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Trophy className="w-5 h-5" />
            <span>Leaderboard</span>
          </Link>
          <Link to="/profile" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors block ${location.pathname === '/profile' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <UserCircle className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-[#3E5879]">
        {user ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D8C4B6] flex items-center justify-center text-[#213555] font-bold text-sm">
                {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name || 'User'}</p>
                <p className="text-xs text-[#D8C4B6] truncate">{user.email || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3E5879] hover:bg-[#3E5879]/80 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-2">
              <UserCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#D8C4B6]">Loading user...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
