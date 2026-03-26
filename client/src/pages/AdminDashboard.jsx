import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../services/adminAPI';
import '../styles/theme.css';

// ─── Tiny SVG icon set ────────────────────────────────────────────────────────
const Icon = {
  Bar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/>
      <line x1="6" x2="6" y1="20" y2="14"/><line x1="2" x2="22" y1="20" y2="20"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  // ✅ NEW: Clock icon for Pending Approvals nav item
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Log: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  ),
  Award: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
      <circle cx="12" cy="8" r="6"/>
    </svg>
  ),
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  Crown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21 5.5l-2 10.5a2 2 0 0 1-2 1.5H7a2 2 0 0 1-2-1.5L3 5.5l4.094 3.664a1 1 0 0 0 1.516-.294z"/>
      <path d="M5 21h14"/>
    </svg>
  ),
  Activity: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Flag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" x2="4" y1="22" y2="15"/>
    </svg>
  ),
  Dismiss: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const initials = (name) =>
  (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const relativeTime = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

// ─── Shared sub-components ────────────────────────────────────────────────────
function Avatar({ name, color = '#4F46E5', size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, color, background: bg,
    }}>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{
        width: 32, height: 32, border: '3px solid #E5E7EB',
        borderTop: '3px solid #4F46E5', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{
      background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
      padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 20,
    }}>
      ⚠️ {message}
    </div>
  );
}

// ─── Inline Confirm Dialog (replaces browser confirm/alert) ──────────────────
function ConfirmDialog({ isOpen, title, message, confirmLabel, confirmColor = '#10B981', onConfirm, onCancel, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
        width: '100%', maxWidth: 420, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        animation: 'popIn 0.18s ease',
      }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.5 }}>{message}</p>
        {children}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 20px', borderRadius: 8, border: '1px solid #E5E7EB',
              background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '9px 20px', borderRadius: 8, border: 'none',
              background: confirmColor, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    success: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' },
    error: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  };
  const c = colors[toast.type] || colors.success;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10,
      padding: '14px 20px', color: c.text, fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      animation: 'slideUp 0.25s ease',
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
    }}>
      <span style={{ fontSize: 18 }}>{toast.type === 'success' ? '✅' : '❌'}</span>
      {toast.message}
      <style>{`@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function AdminSidebar({ view, setView, onLogout, user, pendingCount }) {
  // ✅ Added 'approvals' as a nav item with a live badge for pending count
  const nav = [
    { id: 'analytics',  label: 'Analytics',          Icon: Icon.Bar    },
    { id: 'approvals',  label: 'Pending Approvals',   Icon: Icon.Clock, badge: pendingCount },
    { id: 'users',      label: 'User Management',     Icon: Icon.Users  },
    { id: 'moderation', label: 'Moderation',          Icon: Icon.Shield },
    { id: 'reported',   label: 'Reported Shoutouts',  Icon: Icon.Flag   },
    { id: 'export',     label: 'Export Reports',      Icon: Icon.Download },
    { id: 'logs',       label: 'System Logs',         Icon: Icon.Log    },
  ];

  return (
    <aside style={{
      width: 240, background: '#fff', borderRight: '1px solid #E5E7EB',
      height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 20,
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            padding: 8, borderRadius: 10, color: '#fff',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
          }}>
            <Icon.Award size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#111827', display: 'block', letterSpacing: -0.3 }}>
              BragBoard
            </span>
            <span style={{ fontSize: 11, color: '#4F46E5', fontWeight: 600 }}>Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '4px 10px 8px', margin: 0 }}>
          Management
        </p>
        {nav.map(({ id, label, Icon: I, badge }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 600 : 500, marginBottom: 2,
                background: active ? '#EEF2FF' : 'transparent',
                color: active ? '#4F46E5' : '#6B7280',
                transition: 'all 0.15s', justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#1F2937'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <I /> {label}
              </span>
              {/* ✅ Live badge — shows count of pending registrations */}
              {badge > 0 && (
                <span style={{
                  background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800,
                  padding: '2px 7px', borderRadius: 20, minWidth: 18, textAlign: 'center',
                  animation: 'pulse 2s infinite',
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: 12, borderTop: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: '#F9FAFB' }}>
          <Avatar name={user?.name} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin'}
            </p>
            <p style={{ fontSize: 10, color: '#4F46E5', fontWeight: 600, margin: 0 }}>👑 Administrator</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6, display: 'flex', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = '#FEF2F2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon.Logout />
          </button>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.7; } }`}</style>
    </aside>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor = '#10B981', iconBg, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 20,
      border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, margin: '0 0 6px 0' }}>{label}</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: '#111827', margin: '0 0 4px 0', lineHeight: 1 }}>
            {value === undefined ? '—' : fmt(Number(value))}
          </p>
          {sub && <p style={{ fontSize: 11, color: subColor, fontWeight: 600, margin: 0 }}>{sub}</p>}
        </div>
        <div style={{ background: iconBg, padding: 10, borderRadius: 10 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Analytics view ───────────────────────────────────────────────────────────
function AnalyticsView({ user }) {
  const [stats, setStats] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getTopContributors(5),
      adminAPI.getDepartmentStats(),
    ])
      .then(([s, c, d]) => {
        setStats(s.data);
        setContributors(c.data);
        setDepts(d.data.slice(0, 5));
      })
      .catch(() => setError('Failed to load analytics. Check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const maxDeptCount = Math.max(...depts.map((d) => d.shoutout_count), 1);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: '#fff',
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px 0' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
        </h2>
        <p style={{ fontSize: 14, margin: 0, opacity: 0.9 }}>
          Here's what's happening with your recognition platform today
        </p>
      </div>

      {error && <ErrorBanner message={error} />}
      {loading ? <Spinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14, marginBottom: 24 }}>
            <StatCard label="Total Employees" value={stats?.total_users} sub="Registered accounts" iconBg="#EEF2FF">
              <span style={{ color: '#4F46E5' }}><Icon.Users /></span>
            </StatCard>
            <StatCard label="Total Shoutouts" value={stats?.total_shoutouts} sub="All time" subColor="#F59E0B" iconBg="#FFFBEB">
              <span style={{ color: '#F59E0B' }}><Icon.Award size={20} /></span>
            </StatCard>
            <StatCard label="Total Likes" value={stats?.total_likes} sub="Across all posts" iconBg="#FEF2F2">
              <span style={{ color: '#DC2626' }}><Icon.Heart /></span>
            </StatCard>
            <StatCard label="Active This Week" value={stats?.active_this_week} sub="New shoutouts" iconBg="#F0FDF4">
              <span style={{ color: '#10B981' }}><Icon.Activity /></span>
            </StatCard>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>🏆 Top Contributors</h4>
              </div>
              {contributors.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9CA3AF', padding: 24, fontSize: 13 }}>No data yet</p>
              ) : (
                contributors.map((u, i) => (
                  <div key={u.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 18px', borderBottom: i < contributors.length - 1 ? '1px solid #F9FAFB' : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: i === 0 ? '#F59E0B' : '#9CA3AF', width: 20, fontWeight: 700 }}>
                      #{u.rank}
                    </span>
                    <Avatar name={u.name} color={i === 0 ? '#F59E0B' : '#4F46E5'} size={32} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 1px 0' }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{u.department}</p>
                    </div>
                    <Badge label={`${u.count} sent`} color="#4F46E5" bg="#EEF2FF" />
                  </div>
                ))
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>📊 Department Engagement</h4>
              </div>
              <div style={{ padding: '14px 18px' }}>
                {depts.length === 0 ? (
                  <p style={{ color: '#9CA3AF', fontSize: 13 }}>No departments found</p>
                ) : (
                  depts.map((d) => (
                    <div key={d.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{d.name}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                          {d.shoutout_count} shoutouts · {d.member_count} members
                        </span>
                      </div>
                      <div style={{ background: '#F3F4F6', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          width: `${(d.shoutout_count / maxDeptCount) * 100}%`,
                          background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── ✅ NEW: Pending Approvals View ────────────────────────────────────────────
// Replaces the old Python script workflow entirely.
// Admin can review who registered, then approve or reject inline — no terminal needed.
function PendingApprovalsView({ onPendingCountChange }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [processing, setProcessing]     = useState(null);   // userId currently being actioned
  const [toast, setToast]               = useState(null);

  // Reject dialog state
  const [rejectDialog, setRejectDialog] = useState({ open: false, user: null });
  const [rejectionReason, setRejectionReason] = useState('');

  // Approve dialog state
  const [approveDialog, setApproveDialog] = useState({ open: false, user: null });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getPendingUsers();
      const data = res.data || [];
      setPendingUsers(data);
      onPendingCountChange(data.length);
    } catch {
      setError('Failed to load pending users. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [onPendingCountChange]);

  useEffect(() => { load(); }, [load]);

  // ── Approve ──────────────────────────────────────────────────────────────
  const confirmApprove = (user) => setApproveDialog({ open: true, user });

  const handleApprove = async () => {
    const { user } = approveDialog;
    setApproveDialog({ open: false, user: null });
    setProcessing(user.id);
    try {
      await adminAPI.approveUser(user.id);
      const updated = pendingUsers.filter(u => u.id !== user.id);
      setPendingUsers(updated);
      onPendingCountChange(updated.length);
      showToast(`${user.name} approved — they can now log in!`);
    } catch (err) {
      showToast(`Failed to approve: ${err.response?.data?.detail || err.message}`, 'error');
    } finally {
      setProcessing(null);
    }
  };

  // ── Reject ───────────────────────────────────────────────────────────────
  const confirmReject = (user) => {
    setRejectionReason('');
    setRejectDialog({ open: true, user });
  };

  const handleReject = async () => {
    const { user } = rejectDialog;
    setRejectDialog({ open: false, user: null });
    setProcessing(user.id);
    try {
      await adminAPI.rejectUser(user.id);
      const updated = pendingUsers.filter(u => u.id !== user.id);
      setPendingUsers(updated);
      onPendingCountChange(updated.length);
      showToast(`${user.name}'s registration has been rejected.`, 'error');
    } catch (err) {
      showToast(`Failed to reject: ${err.response?.data?.detail || err.message}`, 'error');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>
            Pending Approvals
          </h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
            Review new registrations — approve or reject access
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pendingUsers.length > 0 && (
            <Badge label={`${pendingUsers.length} waiting`} color="#DC2626" bg="#FEF2F2" />
          )}
          <button
            onClick={load}
            style={{
              border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* How it works banner (shown when there are no pending yet — helps team understand flow) */}
      {!loading && !error && pendingUsers.length === 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #EEF2FF, #F0FDF4)',
          border: '1px solid #C7D2FE', borderRadius: 14,
          padding: '32px 28px', textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', margin: '0 0 8px 0' }}>
            All clear — no pending approvals
          </h3>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 }}>
            When someone registers, they'll appear here.<br/>
            Approve them to grant access, or reject to deny.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 24,
            background: '#fff', borderRadius: 10, padding: '14px 24px',
            border: '1px solid #E5E7EB',
          }}>
            {[
              { icon: '📝', step: '1. User registers' },
              { icon: '⏳', step: '2. Status: pending' },
              { icon: '✅', step: '3. Admin approves here' },
              { icon: '🔓', step: '4. User can log in' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{s.step}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <ErrorBanner message={error} />}
      {loading && <Spinner />}

      {/* Pending users table */}
      {!loading && pendingUsers.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['User', 'Email', 'Department', 'Registered', 'Actions'].map((h, i) => (
                  <th key={h} style={{
                    padding: '12px 18px', textAlign: i === 4 ? 'right' : 'left',
                    fontSize: 11, fontWeight: 700, color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user, idx) => {
                const busy = processing === user.id;
                return (
                  <tr key={user.id} style={{
                    borderBottom: idx < pendingUsers.length - 1 ? '1px solid #F3F4F6' : 'none',
                    background: busy ? '#FEFCE8' : '#fff',
                    transition: 'background 0.2s',
                  }}>
                    {/* Name + avatar */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
                        }}>
                          {initials(user.name)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>
                            {user.name}
                          </p>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#D97706',
                            background: '#FFFBEB', border: '1px solid #FDE68A',
                            padding: '2px 7px', borderRadius: 4,
                          }}>
                            ⏳ PENDING
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#6B7280' }}>
                      {user.email}
                    </td>

                    {/* Department */}
                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#6B7280' }}>
                      {user.department || '—'}
                    </td>

                    {/* Registered date */}
                    <td style={{ padding: '14px 18px', fontSize: 12, color: '#9CA3AF' }}>
                      {user.joined_at
                        ? new Date(user.joined_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => confirmApprove(user)}
                          disabled={busy}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 16px', borderRadius: 7, border: 'none',
                            background: busy ? '#D1FAE5' : '#10B981', color: '#fff',
                            fontSize: 12, fontWeight: 700,
                            cursor: busy ? 'wait' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { if (!busy) e.currentTarget.style.background = '#059669'; }}
                          onMouseLeave={e => { if (!busy) e.currentTarget.style.background = '#10B981'; }}
                        >
                          <Icon.Check />
                          {busy ? 'Processing…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => confirmReject(user)}
                          disabled={busy}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 16px', borderRadius: 7,
                            border: '1px solid #FECACA',
                            background: busy ? '#FEF2F2' : '#fff', color: '#DC2626',
                            fontSize: 12, fontWeight: 700,
                            cursor: busy ? 'wait' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { if (!busy) e.currentTarget.style.background = '#FEF2F2'; }}
                          onMouseLeave={e => { if (!busy) e.currentTarget.style.background = '#fff'; }}
                        >
                          <Icon.X />
                          {busy ? 'Processing…' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Approve confirmation dialog ───────────────────────────────────── */}
      <ConfirmDialog
        isOpen={approveDialog.open}
        title={`Approve ${approveDialog.user?.name}?`}
        message={`${approveDialog.user?.email} will be granted access to BragBoard and can log in immediately.`}
        confirmLabel="✓ Yes, Approve"
        confirmColor="#10B981"
        onConfirm={handleApprove}
        onCancel={() => setApproveDialog({ open: false, user: null })}
      />

      {/* ── Reject confirmation dialog (with optional reason) ────────────── */}
      <ConfirmDialog
        isOpen={rejectDialog.open}
        title={`Reject ${rejectDialog.user?.name}?`}
        message={`${rejectDialog.user?.email} will not be able to access BragBoard.`}
        confirmLabel="✕ Yes, Reject"
        confirmColor="#EF4444"
        onConfirm={handleReject}
        onCancel={() => setRejectDialog({ open: false, user: null })}
      >
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Reason (optional)
          </label>
          <textarea
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            placeholder="e.g. Not an employee, duplicate account…"
            rows={2}
            style={{
              width: '100%', border: '1px solid #E5E7EB', borderRadius: 8,
              padding: '8px 12px', fontSize: 13, outline: 'none', resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </ConfirmDialog>

      <Toast toast={toast} />
    </div>
  );
}

// ─── User Management view ─────────────────────────────────────────────────────
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changingId, setChangingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, newRole: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.listUsers()
      .then((r) => setUsers(r.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const promptToggleRole = (u) => {
    const newRole = u.role === 'admin' ? 'employee' : 'admin';
    setConfirmDialog({ open: true, user: u, newRole });
  };

  const handleToggleRole = async () => {
    const { user, newRole } = confirmDialog;
    setConfirmDialog({ open: false, user: null, newRole: '' });
    setChangingId(user.id);
    try {
      await adminAPI.changeUserRole(user.id, newRole);
      setUsers((prev) => prev.map((x) => x.id === user.id ? { ...x, role: newRole } : x));
      showToast(`${user.name}'s role changed to ${newRole}.`);
    } catch {
      showToast('Role change failed. You cannot change your own role.', 'error');
    } finally {
      setChangingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>User Management</h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Manage roles and view all registered users</p>
        </div>
        <Badge label={`${users.length} users`} color="#4F46E5" bg="#EEF2FF" />
      </div>

      {error && <ErrorBanner message={error} />}
      {loading ? <Spinner /> : (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                {['User', 'Department', 'Role', 'Status', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.name} color={u.role === 'admin' ? '#DC2626' : '#4F46E5'} size={32} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 1px 0' }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: '#6B7280' }}>{u.department || '—'}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <Badge
                      label={u.role === 'admin' ? '👑 Admin' : 'Employee'}
                      color={u.role === 'admin' ? '#DC2626' : '#4F46E5'}
                      bg={u.role === 'admin' ? '#FEF2F2' : '#EEF2FF'}
                    />
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <Badge
                      label={u.status || 'approved'}
                      color={u.status === 'pending' ? '#D97706' : u.status === 'suspended' ? '#DC2626' : '#059669'}
                      bg={u.status === 'pending' ? '#FFFBEB' : u.status === 'suspended' ? '#FEF2F2' : '#F0FDF4'}
                    />
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: '#9CA3AF' }}>
                    {u.joined_at ? new Date(u.joined_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <button
                      disabled={changingId === u.id}
                      onClick={() => promptToggleRole(u)}
                      style={{
                        fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
                        border: `1px solid ${u.role === 'admin' ? '#FECACA' : '#C7D2FE'}`,
                        background: u.role === 'admin' ? '#FEF2F2' : '#EEF2FF',
                        color: u.role === 'admin' ? '#DC2626' : '#4F46E5',
                        cursor: changingId === u.id ? 'wait' : 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { if (changingId !== u.id) e.currentTarget.style.opacity = '0.8'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                      <Icon.Crown />
                      {changingId === u.id ? 'Saving…' : `Change Role → ${u.role === 'admin' ? 'Employee' : 'Admin'}`}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={`Change role to "${confirmDialog.newRole}"?`}
        message={`${confirmDialog.user?.name} will ${confirmDialog.newRole === 'admin' ? 'gain admin access to this dashboard' : 'lose admin access and become a regular employee'}.`}
        confirmLabel="Confirm Change"
        confirmColor="#4F46E5"
        onConfirm={handleToggleRole}
        onCancel={() => setConfirmDialog({ open: false, user: null, newRole: '' })}
      />
      <Toast toast={toast} />
    </div>
  );
}

// ─── Moderation view ──────────────────────────────────────────────────────────
function ModerationView() {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    adminAPI.listShoutouts(100)
      .then((r) => setShoutouts(r.data))
      .catch(() => setError('Failed to load shoutouts.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    const id = deleteDialog.id;
    setDeleteDialog({ open: false, id: null });
    setDeletingId(id);
    try {
      await adminAPI.deleteShoutout(id);
      setShoutouts((prev) => prev.filter((s) => s.id !== id));
      showToast('Shoutout deleted.');
    } catch {
      showToast('Delete failed — shoutout may already be removed.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = shoutouts.filter((s) =>
    s.message.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>Moderation Queue</h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Review and remove inappropriate shoutouts</p>
        </div>
        <input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', width: 200 }}
        />
      </div>

      {error && <ErrorBanner message={error} />}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 40, margin: '0 0 10px 0' }}>✅</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 4px 0' }}>
            {search ? 'No matching shoutouts' : 'All clear!'}
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            {search ? 'Try a different search term.' : 'No shoutouts need review right now.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((s) => (
            <div key={s.id} style={{
              background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
              padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <Avatar name={s.sender_name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{s.sender_name}</span>
                  {s.recipient_names?.length > 0 && (
                    <>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>→</span>
                      <span style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600 }}>
                        {s.recipient_names.join(', ')}
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: 11, color: '#D1D5DB', marginLeft: 'auto' }}>
                    {relativeTime(s.created_at)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px 0', lineHeight: 1.5 }}>{s.message}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge label={`❤️ ${s.likes}`} color="#DC2626" bg="#FEF2F2" />
                  {s.tags && <Badge label={s.tags} color="#6B7280" bg="#F3F4F6" />}
                </div>
              </div>
              <button
                disabled={deletingId === s.id}
                onClick={() => setDeleteDialog({ open: true, id: s.id })}
                style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid #FECACA',
                  background: '#FEF2F2', color: '#DC2626', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'all 0.15s', flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
              >
                <Icon.Trash /> {deletingId === s.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete this shoutout?"
        message="This action is permanent and cannot be undone."
        confirmLabel="Delete"
        confirmColor="#DC2626"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
      <Toast toast={toast} />
    </div>
  );
}

// ─── System Logs view ─────────────────────────────────────────────────────────
function SystemLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getLogs(100)
      .then((r) => setLogs(r.data))
      .catch(() => setError('Failed to load logs. The admin_logs table may not be migrated yet.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>System Logs</h3>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 22 }}>Admin action history and audit trail</p>

      {error && <ErrorBanner message={error} />}
      {loading ? <Spinner /> : logs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 40, margin: '0 0 10px 0' }}>📋</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 4px 0' }}>No logs yet</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            Admin actions (approvals, role changes, deletions) will appear here.
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {logs.map((log, i) => (
            <div key={log.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px',
              borderBottom: i < logs.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: '#10B981' }} />
              <Avatar name={log.admin_name} size={30} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px 0' }}>{log.action}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                  by {log.admin_name}
                  {log.target_type && ` · ${log.target_type} #${log.target_id}`}
                </p>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{relativeTime(log.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reported Shoutouts view ──────────────────────────────────────────────────
function ReportedShoutoutsView() {
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, shoutoutId: null });
  const [dismissDialog, setDismissDialog] = useState({ open: false, reportId: null, shoutoutId: null });
  const [actionInProgress, setActionInProgress] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getReportedShoutouts();
      setReportedItems(res.data || []);
    } catch {
      setError('Failed to load reported shoutouts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDismissReport = async () => {
    const { reportId, shoutoutId } = dismissDialog;
    setDismissDialog({ open: false, reportId: null, shoutoutId: null });
    setActionInProgress(`dismiss-${reportId}`);
    try {
      await adminAPI.dismissReport(reportId);
      setReportedItems(prev =>
        prev.map(item => {
          if (item.shoutout_id !== shoutoutId) return item;
          const updatedReports = item.reports.filter(r => r.report_id !== reportId);
          return updatedReports.length === 0 ? null : { ...item, reports: updatedReports };
        }).filter(Boolean)
      );
      showToast('Report dismissed.');
    } catch {
      showToast('Failed to dismiss report.', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteShoutout = async () => {
    const { shoutoutId } = deleteDialog;
    setDeleteDialog({ open: false, shoutoutId: null });
    setActionInProgress(`delete-${shoutoutId}`);
    try {
      await adminAPI.deleteReportedShoutout(shoutoutId);
      setReportedItems(prev => prev.filter(item => item.shoutout_id !== shoutoutId));
      showToast('Shoutout removed successfully.');
    } catch {
      showToast('Failed to delete shoutout.', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 3px 0' }}>
            Reported Shoutouts
          </h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
            Review shoutouts flagged by employees — dismiss reports or remove content
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {reportedItems.length > 0 && (
            <span style={{
              background: '#FEF2F2', color: '#DC2626', fontSize: 11, fontWeight: 700,
              padding: '3px 10px', borderRadius: 20,
            }}>
              {reportedItems.length} flagged
            </span>
          )}
          <button
            onClick={load}
            style={{
              border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}
      {loading && <Spinner />}

      {!loading && reportedItems.length === 0 && !error && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB',
          padding: '48px 24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 40, margin: '0 0 10px 0' }}>🏳️</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 4px 0' }}>
            No reported shoutouts
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            When employees flag a shoutout, it will appear here for review.
          </p>
        </div>
      )}

      {!loading && reportedItems.map(item => (
        <div key={item.shoutout_id} style={{
          background: '#fff', borderRadius: 14, border: '1px solid #FECACA',
          marginBottom: 16, overflow: 'hidden',
        }}>
          {/* Shoutout content */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #FEF2F2' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0 }}>
                <Avatar name={item.sender_name} size={36} color="#DC2626" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.sender_name}</span>
                    {item.recipient_names?.length > 0 && (
                      <>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>→</span>
                        <span style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600 }}>
                          {item.recipient_names.join(', ')}
                        </span>
                      </>
                    )}
                    <span style={{ fontSize: 11, color: '#D1D5DB', marginLeft: 'auto' }}>
                      {relativeTime(item.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                    {item.message}
                  </p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge label={`❤️ ${item.likes}`} color="#DC2626" bg="#FEF2F2" />
                    {item.tags && <Badge label={item.tags} color="#6B7280" bg="#F3F4F6" />}
                    <Badge
                      label={`🚩 ${item.reports.length} report${item.reports.length !== 1 ? 's' : ''}`}
                      color="#92400E"
                      bg="#FFFBEB"
                    />
                  </div>
                </div>
              </div>
              <button
                disabled={actionInProgress === `delete-${item.shoutout_id}`}
                onClick={() => setDeleteDialog({ open: true, shoutoutId: item.shoutout_id })}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid #FECACA',
                  background: '#FEF2F2', color: '#DC2626', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
              >
                <Icon.Trash />
                {actionInProgress === `delete-${item.shoutout_id}` ? 'Removing…' : 'Remove Shoutout'}
              </button>
            </div>
          </div>

          {/* Individual reports */}
          <div style={{ background: '#FFFBEB' }}>
            {item.reports.map((report, idx) => (
              <div key={report.report_id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
                borderBottom: idx < item.reports.length - 1 ? '1px solid #FEF3C7' : 'none',
              }}>
                <span style={{ fontSize: 14 }}>🚩</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>{report.reason}</span>
                  <span style={{ fontSize: 11, color: '#B45309', marginLeft: 8 }}>
                    — {report.reported_by_name} · {relativeTime(report.reported_at)}
                  </span>
                </div>
                <button
                  disabled={actionInProgress === `dismiss-${report.report_id}`}
                  onClick={() => setDismissDialog({ open: true, reportId: report.report_id, shoutoutId: item.shoutout_id })}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: '1px solid #FDE68A',
                    background: '#fff', color: '#92400E', cursor: 'pointer',
                    fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFFBEB'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <Icon.Dismiss />
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Delete shoutout confirm dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Remove this shoutout?"
        message="The shoutout and all associated reports will be permanently deleted."
        confirmLabel="Remove Shoutout"
        confirmColor="#DC2626"
        onConfirm={handleDeleteShoutout}
        onCancel={() => setDeleteDialog({ open: false, shoutoutId: null })}
      />

      {/* Dismiss report confirm dialog */}
      <ConfirmDialog
        isOpen={dismissDialog.open}
        title="Dismiss this report?"
        message="The report will be removed and the shoutout will remain visible."
        confirmLabel="Dismiss Report"
        confirmColor="#F59E0B"
        onConfirm={handleDismissReport}
        onCancel={() => setDismissDialog({ open: false, reportId: null, shoutoutId: null })}
      />

      <Toast toast={toast} />
    </div>
  );
}

// ─── Export Reports view ──────────────────────────────────────────────────────
function ExportView() {
  const [shoutouts, setShoutouts] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErrors, setFetchErrors] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Promise.allSettled ensures one failing call never silences the others
    Promise.allSettled([
      adminAPI.listShoutouts(500),
      adminAPI.listUsers(),
      adminAPI.getLogs(500),
    ]).then(([s, u, l]) => {
      const errors = [];
      if (s.status === 'fulfilled') setShoutouts(s.value.data || []);
      else errors.push('Shoutouts failed to load');
      if (u.status === 'fulfilled') setUsers(u.value.data || []);
      else errors.push('Users failed to load');
      if (l.status === 'fulfilled') setLogs(l.value.data || []);
      else errors.push('Admin logs failed to load');
      setFetchErrors(errors);
    }).finally(() => setLoading(false));
  }, []);

  const toCSV = (rows, headers) => {
    const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))];
    return lines.join('\n');
  };

  const download = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} downloaded!`);
  };

  const exportShoutouts = () => {
    const rows = shoutouts.map(s => ({
      id: s.id, sender: s.sender_name, recipients: (s.recipient_names || []).join('; '),
      message: s.message, tags: s.tags || '', likes: s.likes, created_at: s.created_at,
    }));
    download(toCSV(rows, ['id','sender','recipients','message','tags','likes','created_at']), 'shoutouts.csv');
  };

  const exportUsers = () => {
    const rows = users.map(u => ({
      id: u.id, name: u.name, email: u.email, department: u.department,
      role: u.role, status: u.status || 'approved', joined_at: u.joined_at,
    }));
    download(toCSV(rows, ['id','name','email','department','role','status','joined_at']), 'users.csv');
  };

  const exportLogs = () => {
    const rows = logs.map(l => ({
      id: l.id, admin: l.admin_name, action: l.action,
      target_type: l.target_type || '', target_id: l.target_id || '', timestamp: l.timestamp,
    }));
    download(toCSV(rows, ['id','admin','action','target_type','target_id','timestamp']), 'admin_logs.csv');
  };

  const cards = [
    {
      icon: '📊', title: 'Shoutouts Report', desc: 'All shout-outs with sender, recipients, message, tags, likes and timestamp.',
      count: shoutouts.length, label: 'shout-outs', color: '#4F46E5', bg: '#EEF2FF',
      onExport: exportShoutouts,
    },
    {
      icon: '👥', title: 'Users Report', desc: 'All registered users with their department, role, status and join date.',
      count: users.length, label: 'users', color: '#10B981', bg: '#F0FDF4',
      onExport: exportUsers,
    },
    {
      icon: '📋', title: 'Admin Logs Report', desc: 'Full audit trail of admin actions — approvals, deletions, role changes.',
      count: logs.length, label: 'log entries', color: '#F59E0B', bg: '#FFFBEB',
      onExport: exportLogs,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Export Reports</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Download platform data as CSV files for offline analysis</p>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Show which calls failed — no more silent zeros */}
          {fetchErrors.length > 0 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', marginBottom: 18, color: '#991B1B', fontSize: 13 }}>
              ⚠️ Some data failed to load: {fetchErrors.join(', ')}. Check your connection or try refreshing.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18, marginBottom: 28 }}>
            {cards.map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '20px 22px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.icon}</div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>{c.title}</p>
                      <p style={{ fontSize: 11, color: c.color, fontWeight: 700, margin: 0 }}>{c.count.toLocaleString()} {c.label}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
                </div>
                <div style={{ padding: '14px 22px', background: '#FAFAFA' }}>
                  <button
                    onClick={c.onExport}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: c.color, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    ⬇ Download CSV
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>About CSV exports</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                All exports are in standard CSV format — compatible with Excel, Google Sheets, and any BI tool. Timestamps are in UTC. Sensitive fields (passwords, security answers) are never included.
              </p>
            </div>
          </div>
        </>
      )}
      <Toast toast={toast} />
    </div>
  );
}

// ─── Top header bar ───────────────────────────────────────────────────────────
function TopBar({ view, user }) {
  const titles = {
    analytics:  { t: 'Analytics Overview',     s: 'Monitor team recognition metrics' },
    approvals:  { t: 'Pending Approvals',       s: 'Review and approve new registrations' },
    users:      { t: 'User Management',         s: 'Manage members and roles' },
    moderation: { t: 'Moderation Queue',        s: 'Review and remove content' },
    reported:   { t: 'Reported Shoutouts',      s: 'Review shoutouts flagged by employees' },
    export:     { t: 'Export Reports',          s: 'Download platform data as CSV' },
    logs:       { t: 'System Logs',             s: 'Track admin actions' },
  };
  const { t, s } = titles[view] || titles.analytics;

  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{t}</h2>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{s}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 10, border: '1px solid #E5E7EB' }}>
        <Avatar name={user?.name} size={28} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>{user?.name}</p>
          <p style={{ fontSize: 10, color: '#4F46E5', fontWeight: 600, margin: 0 }}>Administrator</p>
        </div>
      </div>
    </header>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('analytics');
  // ✅ Shared pending count — sidebar badge + fetched from PendingApprovalsView
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  // Fetch pending count on mount so the badge shows even before visiting the tab
  useEffect(() => {
    adminAPI.getPendingUsers()
      .then(r => setPendingCount((r.data || []).length))
      .catch(() => {}); // silently ignore — badge just stays at 0
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderView = () => {
    switch (view) {
      case 'analytics':  return <AnalyticsView user={user} />;
      case 'approvals':  return <PendingApprovalsView onPendingCountChange={setPendingCount} />;
      case 'users':      return <UserManagementView />;
      case 'moderation': return <ModerationView />;
      case 'reported':   return <ReportedShoutoutsView />;
      case 'export':     return <ExportView />;
      case 'logs':       return <SystemLogsView />;
      default:           return <AnalyticsView user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex' }}>
      <AdminSidebar
        view={view}
        setView={setView}
        onLogout={handleLogout}
        user={user}
        pendingCount={pendingCount}
      />
      <main style={{ paddingLeft: 240, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar view={view} user={user} />
        <div style={{ flex: 1, padding: '24px 28px', maxWidth: 1080, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;