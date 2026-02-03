import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  Send, 
  Trophy, 
  User, 
  Heart,
  TrendingUp,
  LogOut 
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, stats, onLogout, user }) => {
  const menuItems = [
    { 
      section: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create', label: 'Create Shoutout', icon: PlusCircle },
        { id: 'feed', label: 'Shoutout Feed', icon: MessageSquare },
      ]
    },
    {
      section: 'ACTIVITY',
      items: [
        { id: 'my-shoutouts', label: 'My Shoutouts', icon: Send },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'profile', label: 'My Profile', icon: User },
      ]
    }
  ];

  return (
    <div className="w-64 bg-primary h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-accent1">
        <h1 className="text-2xl font-bold text-secondary">🎉 BragBoard</h1>
        <p className="text-accent2 text-sm mt-1">Employee Recognition</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-accent2 uppercase tracking-wider mb-2">
              {section.section}
            </h3>
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-accent1 text-secondary' 
                        : 'text-accent2 hover:bg-accent1/50 hover:text-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="px-6 mt-6">
          <h3 className="text-xs font-semibold text-accent2 uppercase tracking-wider mb-3">
            QUICK STATS
          </h3>
          <div className="space-y-3">
            <div className="bg-accent1/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Received</span>
                <Heart className="w-4 h-4 text-accent2" />
              </div>
              <p className="text-2xl font-bold text-secondary mt-1">
                {stats?.received || 0}
              </p>
            </div>
            <div className="bg-accent1/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Given</span>
                <TrendingUp className="w-4 h-4 text-accent2" />
              </div>
              <p className="text-2xl font-bold text-secondary mt-1">
                {stats?.given || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-accent1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-accent1 flex items-center justify-center text-secondary font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-secondary text-sm font-medium">{user?.name}</p>
            <p className="text-accent2 text-xs">{user?.department}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent1 hover:bg-accent1/80 text-secondary rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
