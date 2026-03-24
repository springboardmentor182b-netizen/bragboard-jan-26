import React from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Users,
    Shield,
    ScrollText,
    LogOut,
    Bell,
    Award
} from 'lucide-react';
import './admin.css';

const navItems = [
    { to: '/admin/analytics', label: 'Analytics Overview', icon: BarChart3 },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/moderation', label: 'Moderation Queue', icon: Shield },
    { to: '/admin/logs', label: 'System Logs', icon: ScrollText },
];

const pageTitles = {
    '/admin/users': { title: 'User Management', subtitle: "Manage your team's recognition platform" },
    '/admin/analytics': { title: 'Analytics Overview', subtitle: 'Platform insights and metrics' },
    '/admin/moderation': { title: 'Moderation Queue', subtitle: 'Review flagged content' },
    '/admin/logs': { title: 'System Logs', subtitle: 'Admin activity history' },
};

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const AdminLayout = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // Wait for auth check to complete
    if (loading) {
        return (
            <div className="auth-container">
                <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
            </div>
        );
    }

    // Redirect to sign-in if not authenticated
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    const currentPath = window.location.pathname;
    const pageInfo = pageTitles[currentPath] || pageTitles['/admin/users'];

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <Award size={18} color="white" />
                    </div>
                    <div>
                        <h2>BragBoard</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? ' active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-link" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-title">
                        <h1>{pageInfo.title}</h1>
                        <p>{pageInfo.subtitle}</p>
                    </div>
                    <div className="topbar-right">
                        <button className="topbar-bell">
                            <Bell size={20} />
                            <span className="topbar-bell-dot" />
                        </button>
                        <div className="topbar-user">
                            <div className="user-avatar color-0">
                                {getInitials(user?.name)}
                            </div>
                            <div className="topbar-user-info">
                                <div className="name">{user?.name || 'Admin User'}</div>
                                <span className="role-label">
                                    {user?.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
