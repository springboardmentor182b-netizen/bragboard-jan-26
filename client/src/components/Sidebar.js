import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Use this instead of window.location for better reactivity

    const menuItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Reported Posts', path: '/admin/reports' },
        { name: 'Manage Shoutouts', path: '/admin/shoutouts' },
        { name: 'Manage Users', path: '/admin/users' }, // ✅ Path fixed from '#' to '/admin/users'
        { name: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div style={{ 
            width: '250px', 
            height: '100vh', 
            backgroundColor: '#FFF5F0', 
            padding: '20px', 
            borderRight: '1px solid #FFE0D0',
            position: 'sticky',
            top: 0
        }}>
            <h2 style={{ color: '#D35400', marginBottom: '40px' }}>BragBoard Admin</h2>
            
            <nav>
                {menuItems.map((item) => {
                    // Check if this item is the currently active page
                    const isActive = location.pathname === item.path;

                    return (
                        <div 
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            style={{ 
                                padding: '12px 20px', 
                                cursor: 'pointer', 
                                borderRadius: '10px',
                                marginBottom: '10px',
                                backgroundColor: isActive ? '#FFD0B8' : 'transparent',
                                color: isActive ? '#D35400' : '#333',
                                fontWeight: isActive ? '600' : '500',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {item.name}
                        </div>
                    );
                })}
            </nav>

            <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    borderRadius: '50%', 
                    backgroundColor: '#D35400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    J
                </div>
                <strong>John Doe</strong>
            </div>
        </div>
    );
};

export default Sidebar;