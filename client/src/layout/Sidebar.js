import React from 'react';
import { LayoutDashboard, Users, ShieldAlert, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
           <span className="text-white font-bold">B</span>
        </div>
        <div>
          <div className="font-bold text-gray-900 leading-tight">BragBoard</div>
          <div className="text-xs text-gray-500">Admin Portal</div>
        </div>
      </div>

      <div className="flex-1 px-3 space-y-1 mt-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer shadow-sm">
          <LayoutDashboard size={20} />
          <span className="font-medium text-sm">Analytics Overview</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
          <Users size={20} />
          <span className="font-medium text-sm">User Management</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
          <ShieldAlert size={20} />
          <span className="font-medium text-sm">Moderation Queue</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
          <FileText size={20} />
          <span className="font-medium text-sm">System Logs</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;