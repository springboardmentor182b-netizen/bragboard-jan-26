import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Reported Posts', path: '/admin/reports' },
        { name: 'Manage Shoutouts', path: '/admin/shoutouts' },
        { name: 'Manage Users', path: '#' },
        { name: 'Settings', path: '#' },
    ];

    return (
        <div style={{ width: '250px', height: '100vh', backgroundColor: '#FFF5F0', padding: '20px', borderRight: '1px solid #FFE0D0' }}>
            <h2 style={{ color: '#D35400', marginBottom: '40px' }}>BragBoard Admin</h2>
            <nav>
                {menuItems.map((item) => (
                    <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{ 
                            padding: '12px 20px', 
                            cursor: 'pointer', 
                            borderRadius: '10px',
                            marginBottom: '10px',
                            backgroundColor: window.location.pathname === item.path ? '#FFD0B8' : 'transparent',
                            color: '#333',
                            fontWeight: '500'
                        }}
                    >
                        {item.name}
                    </div>
                ))}
            </nav>
            <div style={{ position: 'absolute', bottom: '20px' }}>
                <strong>👤 John Doe</strong>
            </div>
        </div>
    );
};

export default Sidebar;