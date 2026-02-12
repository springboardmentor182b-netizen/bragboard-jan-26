import React from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import Moderation from './features/admin/pages/Moderation';

function App() {
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div style={{
                marginLeft: '250px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Top Navbar */}
                <Navbar />

                {/* Main Content - Moderation Screen */}
                <main style={{
                    marginTop: '64px',
                    overflow: 'auto'
                }}>
                    <Moderation />
                </main>
            </div>
        </div>
    );
}

export default App;
