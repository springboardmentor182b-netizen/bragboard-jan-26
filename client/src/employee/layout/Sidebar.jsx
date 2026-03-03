import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    {
        name: 'Dashboard', path: '/dashboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )
    },
    {
        name: 'Post Shout-out', path: '/post-shoutout', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        )
    },
    {
        name: 'Feed', path: '/feed', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
        )
    },
    {
        name: 'My Shout-outs', path: '/my-shoutouts', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
    {
        name: 'Leaderboard', path: '/leaderboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        )
    },
    {
        name: 'Settings', path: '/settings', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
];

export default function EmployeeSidebar() {
    const location = useLocation();
    const [user, setUser] = useState(null);

    const fetchUser = () => {
        fetch('http://localhost:8000/users/me')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error('Error fetching sidebar user:', err));
    };

    useEffect(() => {
        fetchUser();
        window.addEventListener('profileUpdated', fetchUser);
        return () => window.removeEventListener('profileUpdated', fetchUser);
    }, []);

    const displayName = user?.full_name || user?.email?.split('@')[0] || 'Loading...';
    const displayRole = user?.job_title || (user?.role === 'admin' ? 'Admin Manager' : 'Product Designer');


    return (
        <aside className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">★</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">BragBoard</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                        {location.pathname === item.path && (
                            <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-6 border-t mt-auto">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
                        alt="User"
                        className="w-10 h-10 rounded-full border transform transition hover:scale-110"
                    />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900 capitalize truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{displayRole}</p>
                    </div>
                </div>
                <button className="mt-4 w-full text-left text-sm text-gray-500 hover:text-orange-600 flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
