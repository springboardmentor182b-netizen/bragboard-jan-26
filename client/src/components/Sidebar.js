import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, PlusCircle, Trophy, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Feed', icon: MessageSquare, path: '/dashboard/feed' },
        { name: 'Create Shout Out', icon: PlusCircle, path: '/dashboard/create' },
        { name: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
        { name: 'My Profile', icon: FileText, path: '/dashboard/profile' },
        { name: 'My Shout Outs', icon: FileText, path: '/dashboard/mine' },
    ];

    return (
        <div className="w-64 bg-white __h-screen border-r border-gray-200 flex flex-col fixed left-0 top-16 bottom-0">
            <div className="flex-1 py-6">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-brand-orange text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
