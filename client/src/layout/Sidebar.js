import React from 'react';

const Sidebar = () => {
    return (
        <div style={{
            width: '250px',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#4F46E5',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    B
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>BragBoard</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Admin Portal</div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ flex: 1, padding: '20px 0' }}>
                <MenuItem icon="📊" label="Analytics Overview" />
                <MenuItem icon="👥" label="User Management" />
                <MenuItem icon="📣" label="Shout Outs" />
                <MenuItem icon="⚠️" label="Moderation Queue" active={true} />
                <MenuItem icon="📋" label="System Logs" />
            </nav>

            {/* Logout Button */}
            <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
                <button style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#dc2626'
                }}>
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, active = false }) => {
    const [isActive, setIsActive] = React.useState(false);

    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        margin: '0 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.15s',
        backgroundColor: active ? '#4F46E5' : (isActive ? '#f3f4f6' : 'transparent'),
        color: active ? 'white' : '#333',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
    };

    const handleClick = (e) => {
        e.preventDefault();
        console.log(`Clicked: ${label}`);
    };

    return (
        <div
            style={baseStyle}
            onClick={handleClick}
            onTouchStart={(e) => {
                e.stopPropagation();
                setIsActive(true);
            }}
            onTouchEnd={(e) => {
                e.stopPropagation();
                setIsActive(false);
            }}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </div>
    );
};

export default Sidebar;
