import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function EmployeeLayout() {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {/* Top Search Bar */}
                <div className="max-w-4xl mx-auto mb-8 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white pl-12 pr-4 py-3 rounded-2xl shadow-sm border border-transparent focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 outline-none transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
