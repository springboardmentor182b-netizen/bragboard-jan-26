import React from 'react';
import { Home, User, Trophy, Users, Trophy as TrophyIcon } from 'lucide-react';

// 1. Accept 'user' as a prop
const Sidebar = ({ activeTab, setActiveTab, onOpenModal, user }) => {
  
  const menuItems = [
    { id: 'feed', icon: <Home size={20} />, label: 'Activity Feed' },
    { id: 'my-shoutouts', icon: <User size={20} />, label: 'My Shout-outs' },
    { id: 'leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { id: 'departments', icon: <Users size={20} />, label: 'Departments' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0 z-10">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          <TrophyIcon size={16} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">BragBoard</h1>
      </div>

      <button 
        onClick={onOpenModal}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg mb-8 transition-all flex items-center justify-center gap-2"
      >
        <span>+</span> Give a Shout-out
      </button>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-600 font-medium' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* 2. Remove Hardcoded Name - Use user prop */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
            {/* Show first initial or '?' if loading */}
            {user ? user.name.charAt(0) : '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">
              {user ? user.name : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500">
              {user ? user.department : '...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;