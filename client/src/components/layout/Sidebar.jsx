import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Send,
    Rss,
    User,
    Trophy,
    Settings,
    LogOut,
    HelpCircle
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Send, label: 'Post Shout-out', path: '/post-shoutout', highlight: true },
        { icon: Rss, label: 'Feed', path: '/feed' },
        { icon: User, label: 'My Shout-outs', path: '/my-shoutouts' },
    ];

    const secondaryItems = [
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 bg-white border-r border-secondary-200 h-screen flex flex-col fixed left-0 top-0 z-10">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    B
                </div>
                <span className="text-xl font-bold text-secondary-900">BragBoard</span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${item.highlight
                                ? 'bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 mb-6 mt-2' // Highlight for Post Shout-out
                                : isActive
                                    ? 'bg-white text-primary-600 font-medium' // Active state for others
                                    : 'text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900'
                            }
              ${item.highlight ? 'text-primary-600' : ''}
              ${isActive && !item.highlight ? 'shadow-sm ring-1 ring-secondary-200' : ''} // Add subtle shadow/ring for active items if needed, or stick to simple text color
            `}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}

                <div className="my-6 border-t border-secondary-100 mx-2"></div>

                {secondaryItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-primary-50 text-primary-600 font-medium'
                                : 'text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900'
                            }
            `}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-secondary-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
                        alt="User"
                        className="w-10 h-10 rounded-full bg-secondary-100"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-secondary-900 truncate">Jordan Smith</h4>
                        <p className="text-xs text-secondary-500 truncate">Product Manager</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-secondary-400 hover:text-secondary-600 text-sm px-2 w-full transition-colors">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>

            {/* Help Button (Bottom Right Fixed in Design, but typically in sidebar or corner) */}
            {/* Design shows it floating bottom right on page, so not in sidebar */}
        </div>
    );
};

export default Sidebar;
