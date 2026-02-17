import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard/1', label: '🏠 Dashboard'    },
  { to: '/feed',        label: '📢 Feed'         },
  { to: '/employees',   label: '👥 Employees'    },
  { to: '/leaderboard', label: '🏆 Leaderboard'  },
];

/**
 * Top navigation bar.
 */
function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        backgroundColor: '#1e40af',
        color: '#fff',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        height: '60px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    >
      <span style={{ fontWeight: '800', fontSize: '1.2rem', marginRight: '2.5rem', letterSpacing: '-0.5px' }}>
        🎉 BragBoard
      </span>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {NAV_LINKS.map(({ to, label }) => {
          const segment = to.split('/')[1];
          const active  = pathname.split('/')[1] === segment;
          return (
            <Link
              key={to}
              to={to}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: active ? '700' : '400',
                color: '#fff',
                backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
