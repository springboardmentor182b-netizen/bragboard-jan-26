import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Home landing page - redirects to dashboard.
 */
function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome to BragBoard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.05rem' }}>
        Celebrate your teammates. Spread the appreciation!
      </p>
      <button
        onClick={() => navigate('/dashboard/1')}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#1e40af',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '1rem',
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default Home;
