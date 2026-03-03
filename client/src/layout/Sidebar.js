import React from 'react';
import { Award, Home, Send, MessageSquare, Trophy, UserCircle, LogOut } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, currentUser }) => {
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
          <button onClick={() => setCurrentPage('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'dashboard' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setCurrentPage('create')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'create' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Send className="w-5 h-5" />
            <span>Create Shoutout</span>
          </button>
          <button onClick={() => setCurrentPage('feed')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'feed' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <MessageSquare className="w-5 h-5" />
            <span>Shoutout Feed</span>
          </button>
        </div>

        <div>
          <p className="text-xs text-[#D8C4B6] mb-2 font-semibold">Activity</p>
          <button onClick={() => setCurrentPage('myshoutouts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'myshoutouts' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Award className="w-5 h-5" />
            <span>My Shoutouts</span>
          </button>
          <button onClick={() => setCurrentPage('leaderboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'leaderboard' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <Trophy className="w-5 h-5" />
            <span>Leaderboard</span>
          </button>
          <button onClick={() => setCurrentPage('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${currentPage === 'profile' ? 'bg-[#3E5879]' : 'hover:bg-[#3E5879]/50'}`}>
            <UserCircle className="w-5 h-5" />
            <span>My Profile</span>
          </button>
        </div>
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-[#3E5879]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D8C4B6] flex items-center justify-center text-[#213555] font-bold text-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-xs text-[#D8C4B6] truncate">{currentUser.email}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3E5879] hover:bg-[#3E5879]/80 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
