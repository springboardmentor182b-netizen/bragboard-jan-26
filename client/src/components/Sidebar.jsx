import React from 'react';
import { Icons } from './Icons';

const MenuItem = ({ id, label, icon: Icon, activePage, onNavigate }) => (
    <div 
        onClick={() => onNavigate(id)} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activePage === id ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
    >
        <Icon />
        <span className="font-medium text-sm">{label}</span>
    </div>
);

export const AdminSidebar = ({ activePage, onNavigate }) => {
    return (
        <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                    <Icons.Logo />
                </div>
                <div>
                    <div className="font-bold text-gray-900 leading-tight">BragBoard</div>
                    <div className="text-xs text-gray-500">Admin Portal</div>
                </div>
            </div>
            <div className="flex-1 px-3 space-y-1 mt-2">
                <MenuItem id="dashboard" label="Dashboard" icon={Icons.Analytics} activePage={activePage} onNavigate={onNavigate} />
                <MenuItem id="users" label="User Management" icon={Icons.Users} activePage={activePage} onNavigate={onNavigate} />
                <MenuItem id="queue" label="Moderation Queue" icon={Icons.Queue} activePage={activePage} onNavigate={onNavigate} />
                <MenuItem id="logs" label="System Logs" icon={Icons.Logs} activePage={activePage} onNavigate={onNavigate} />
            </div>
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors">
                    <Icons.Logout />
                    <span className="font-medium text-sm">Logout</span>
                </div>
            </div>
        </div>
    );
};
