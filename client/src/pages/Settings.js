import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Palette } from 'lucide-react';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        shoutouts: true,
    });
    const [theme, setTheme] = useState('light');

    const handleToggle = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-brand-yellow/10 rounded-xl text-brand-orange">
                        <SettingsIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your app preferences and settings</p>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                        <User className="w-5 h-5 text-gray-400" /> Account
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-800">Change Password</p>
                                <p className="text-xs text-gray-500">Update your password regularly to keep your account secure</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-brand-orange bg-brand-orange/10 rounded-lg hover:bg-brand-orange/20 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                        <Bell className="w-5 h-5 text-gray-400" /> Notifications
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <span className="capitalize font-medium text-gray-700">{key} Notifications</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={value} 
                                        onChange={() => handleToggle(key)} 
                                    />
                                    <div className="block w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-brand-orange transition-colors"></div>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${value ? 'translate-x-6' : ''}`}></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appearance */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                        <Palette className="w-5 h-5 text-gray-400" /> Appearance
                    </h3>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setTheme('light')}
                            className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300"></div>
                            <span className="font-medium text-gray-700">Light</span>
                        </button>
                        <button 
                            onClick={() => setTheme('dark')}
                            className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200 hover:border-gray-300 bg-gray-900'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600"></div>
                            <span className={`font-medium ${theme === 'dark' ? 'text-brand-orange' : 'text-gray-400'}`}>Dark</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
