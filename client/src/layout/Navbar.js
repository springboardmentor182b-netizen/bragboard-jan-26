import React from 'react';
import { Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-gray-900 capitalize">Dashboard</h1>
        <p className="text-sm text-gray-500">Manage your team's recognition platform</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">AU</div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">Admin User</div>
            <div className="inline-flex bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;