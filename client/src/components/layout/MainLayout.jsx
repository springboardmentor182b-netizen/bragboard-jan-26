import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-secondary-50 flex">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">

                {/* Topbar */}
                <header className="h-16 px-8 flex items-center justify-between bg-secondary-50 sticky top-0 z-10">
                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-transparent bg-white focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 ml-4">
                        <button className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary-500 hover:text-primary-600 hover:shadow-md transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 pt-4 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Floating Help Button */}
                <button className="fixed bottom-6 right-6 w-10 h-10 bg-secondary-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-900 transition-transform hover:scale-105 z-50">
                    <HelpCircle size={20} />
                </button>
            </div>
        </div>
    );
};

export default MainLayout;
