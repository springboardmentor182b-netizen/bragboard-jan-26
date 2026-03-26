import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, PlusCircle, Trophy, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0">

            {/* 🔥 ADMIN MENU */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Admin Panel</h2>
            </div>

            <nav className="space-y-1 px-3 mt-4">

                <NavLink to="/" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                </NavLink>

                <NavLink to="/accounts" className="block px-4 py-2 hover:bg-gray-100">
                    Account Management
                </NavLink>

                <NavLink to="/reports" className="block px-4 py-2 hover:bg-gray-100">
                    Reported Shout-Outs
                </NavLink>

                <NavLink to="/analytics" className="block px-4 py-2 hover:bg-gray-100">
                    Platform Analysis
                </NavLink>

            </nav>

            {/* 🔥 LOGOUT */}
            <div className="mt-auto p-4 border-t">
                <button
                    onClick={logout}
                    className="flex items-center text-red-600"
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                </button>
            </div>

        </div>
    );
};

export default Sidebar;