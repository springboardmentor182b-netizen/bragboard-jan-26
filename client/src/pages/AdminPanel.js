import React, { useState } from 'react';
import { Users, FileText, BarChart3, Trophy } from 'lucide-react';
import Dashboard from './Dashboard';
import UserManagement from './admin/UserManagement';
import ShoutoutsManagement from './admin/ShoutoutsManagement';
import Reports from './Reports';
import Leaderboard from './Leaderboard';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard',   label: 'Dashboard',             icon: BarChart3 },
    { id: 'users',       label: 'Users Management',      icon: Users     },
    { id: 'shoutouts',   label: 'Shout-outs Management', icon: FileText  },
    { id: 'reports',     label: 'Reports',               icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard',           icon: Trophy    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'shoutouts':
        return <ShoutoutsManagement />;
      case 'reports':
        return <Reports />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-blue-900 text-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold">B</span>
            </div>
            <h1 className="text-xl font-bold">BragBoard</h1>
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-semibold text-blue-300 mb-3">MAIN</div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6">
          <button className="flex items-center gap-2 text-blue-200 hover:text-white">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;
