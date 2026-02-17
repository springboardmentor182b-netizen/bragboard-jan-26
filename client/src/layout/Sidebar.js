import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SIDEBAR_LINKS = [
  { to: '/dashboard/1', label: 'Dashboard',     icon: '🏠' },
  { to: '/feed',        label: 'Shoutout Feed', icon: '📢' },
  { to: '/employees',   label: 'Employees',     icon: '👥' },
  { to: '/leaderboard', label: 'Leaderboard',   icon: '🏆' },
];

/**
 * Left sidebar navigation.
 */
function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      style={{
        width: '220px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        padding: '1.5rem 1rem',
        minHeight: 'calc(100vh - 60px)',
        flexShrink: 0,
      }}
    >
      <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
        MENU
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {SIDEBAR_LINKS.map(({ to, label, icon }) => {
          const segment = to.split('/')[1];
          const active  = pathname.split('/')[1] === segment;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: active ? '700' : '500',
                color: active ? '#1d4ed8' : '#374151',
                backgroundColor: active ? '#eff6ff' : 'transparent',
                textDecoration: 'none',
              }}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
