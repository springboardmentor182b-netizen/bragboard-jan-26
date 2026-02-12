import React from 'react';

const Navbar = () => {
    return (
        <header style={{
            height: '64px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
            position: 'fixed',
            top: 0,
            left: '250px',
            right: 0,
            zIndex: 10
        }}>
            <div>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#1f2937'
                }}>
                    Dashboard
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '2px 0 0 0'
                }}>
                    Manage your team's recognition platform
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Notification Bell */}
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <span style={{ fontSize: '20px' }}>🔔</span>
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        2
                    </span>
                </div>

                {/* User Profile */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#4F46E5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        AU
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Admin User</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
