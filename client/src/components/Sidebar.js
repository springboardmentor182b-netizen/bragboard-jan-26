import React, { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, PlusCircle, Trophy, FileText, LogOut, Bell, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Sidebar = () => {
    const { logout, user, apiUrl } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${apiUrl}/notifications/unread-count?user_id=${user.id}`);
            setUnreadCount(res.data.count);
        } catch (err) {
            // Silently fail
        }
    }, [user, apiUrl]);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const navItems = [
        { name: 'Feed', icon: MessageSquare, path: '/dashboard/feed' },
        { name: 'Create Shout Out', icon: PlusCircle, path: '/dashboard/create' },
        { name: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
        { name: 'My Profile', icon: FileText, path: '/dashboard/profile' },
        { name: 'My Shout Outs', icon: FileText, path: '/dashboard/mine' },
        { name: 'Notifications', icon: Bell, path: '/dashboard/notifications', badge: unreadCount },
    ];

    // Add Admin link if user is admin
    if (user && user.role === 'admin') {
        navItems.push({ name: 'Admin Panel', icon: ShieldAlert, path: '/admin' });
    }

    return (
        <div className="w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col fixed left-0 top-16 bottom-0">
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
                            <span className="flex-1">{item.name}</span>
                            {item.badge > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {item.badge > 99 ? '99+' : item.badge}
                                </span>
                            )}
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
