import React, { useState } from 'react';
import { Icons } from './Icons';

export const Header = ({ title }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = [
        { id: 1, text: "Mike Chen liked your shoutout", time: "2 min ago", new: true },
        { id: 2, text: "Sarah Johnson posted a new shoutout", time: "1 hour ago", new: true },
    ];

    return (
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
            <div>
                <h1 className="text-xl font-bold text-gray-900 capitalize">{title.replace('-', ' ')}</h1>
                <p className="text-sm text-gray-500">Manage your team's recognition platform</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
                        <Icons.Bell />
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center"><h3 className="font-bold text-sm text-gray-800">Notifications</h3></div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${notif.new ? 'bg-blue-50/30' : ''}`}>
                                        <p className="text-sm text-gray-700 leading-snug">{notif.text}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center text-white font-medium text-sm">AU</div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">Admin User</div>
                        <div className="inline-flex bg-[#4F46E5] text-white text-[10px] px-2 py-0.5 rounded-full">Admin</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
