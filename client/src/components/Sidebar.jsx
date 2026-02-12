import React from 'react';
import { Home, User, Trophy, Users, Trophy as TrophyIcon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onOpenModal, user }) => {
  const menuItems = [
    { id: 'feed', icon: <Home size={20} />, label: 'Activity Feed' },
    { id: 'my-shoutouts', icon: <User size={20} />, label: 'My Shout-outs' },
    { id: 'leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { id: 'departments', icon: <Users size={20} />, label: 'Departments' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0 z-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          <TrophyIcon size={16} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">BragBoard</h1>
      </div>

      {/* Action Button */}
      <button onClick={onOpenModal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg mb-8 flex items-center justify-center gap-2 transition-all active:scale-95">
        <span className="text-xl leading-none">+</span> Give a Shout-out
      </button>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {item.icon} <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* --- USER PROFILE SECTION (UPDATED) --- */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
        {user ? (
          // STATE 1: Data Loaded (Show Real User)
          <>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.department}</p>
            </div>
          </>
        ) : (
          // STATE 2: Skeleton Loader (Animation - No Hardcoded Data)
          <>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
               <div className="h-3.5 bg-gray-200 rounded w-24 animate-pulse"></div>
               <div className="h-2.5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;