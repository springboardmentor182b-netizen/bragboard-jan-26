import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bell, CheckCheck, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const { user, apiUrl } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${apiUrl}/notifications/?user_id=${user.id}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user, apiUrl]);

    // Initial fetch + poll every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markRead = async (notif) => {
        if (notif.is_read) return;
        try {
            await axios.post(`${apiUrl}/notifications/${notif.id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
            );
        } catch (err) {
            console.error('Error marking read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.post(`${apiUrl}/notifications/read-all?user_id=${user.id}`);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking all read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const formatTime = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell className="text-brand-orange" size={28} />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">Who liked and commented on your shout-outs</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-orange border border-brand-orange rounded-xl hover:bg-orange-50 transition-colors"
                    >
                        <CheckCheck size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <Bell size={32} className="text-brand-orange opacity-50" />
                    </div>
                    <p className="text-gray-500 font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">You'll be notified when someone likes or comments on your shout-outs</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => markRead(notif)}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                notif.is_read
                                    ? 'bg-white border-gray-100 hover:shadow-sm'
                                    : 'bg-orange-50 border-orange-100 hover:bg-orange-100'
                            }`}
                        >
                            {/* Actor avatar */}
                            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                {notif.actor?.profile_picture ? (
                                    <img src={notif.actor.profile_picture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    notif.actor?.full_name?.charAt(0) || '?'
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">{notif.actor?.full_name || 'Someone'}</span>
                                    {notif.type === 'like'
                                        ? ' liked your shout-out 👍'
                                        : ' commented on your shout-out 💬'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{formatTime(notif.created_at)}</p>
                            </div>

                            {/* Icon + unread dot */}
                            <div className="flex items-center gap-2 shrink-0">
                                {notif.type === 'like'
                                    ? <ThumbsUp size={16} className="text-brand-orange" />
                                    : <MessageCircle size={16} className="text-blue-500" />}
                                {!notif.is_read && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
