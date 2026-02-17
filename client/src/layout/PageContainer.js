import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Main layout wrapper: Navbar on top, Sidebar on left, content on right.
 */
function PageContainer({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '960px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default PageContainer;
