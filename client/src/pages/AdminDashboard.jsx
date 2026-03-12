import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../services/adminAPI';
import ModerationQueue from './ModerationQueue';
import '../styles/theme.css';

// ─── Tiny SVG icon set ────────────────────────────────────────────────────────
const Icon = {
  Bar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" /><line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Log: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  ),
  Award: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  ),
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  Crown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21 5.5l-2 10.5a2 2 0 0 1-2 1.5H7a2 2 0 0 1-2-1.5L3 5.5l4.094 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  ),
  Activity: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function AdminSidebar({ view, setView, onLogout, user }) {
  const nav = [
    { id: 'analytics', label: 'Analytics', Icon: Icon.Bar },
    { id: 'users', label: 'User Management', Icon: Icon.Users },
    { id: 'moderation', label: 'Moderation', Icon: Icon.Shield },
    { id: 'logs', label: 'System Logs', Icon: Icon.Log },
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
        {nav.map(({ id, label, Icon: I }) => {
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
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#1F2937'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
            >
              <I /> {label}
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
      {/* Welcome banner */}
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
          {/* Stats */}
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

          {/* Two-column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* Top contributors */}
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

            {/* Department stats */}
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

// ─── User Management view ─────────────────────────────────────────────────────
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changingId, setChangingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.listUsers()
      .then((r) => setUsers(r.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'employee' : 'admin';
    if (!window.confirm(`Change ${u.name}'s role to "${newRole}"?`)) return;
    setChangingId(u.id);
    try {
      await adminAPI.changeUserRole(u.id, newRole);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: newRole } : x));
    } catch {
      alert('Role change failed. You may not be able to change your own role.');
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
                {['User', 'Department', 'Role', 'Joined', 'Action'].map((h) => (
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
                  <td style={{ padding: '13px 18px', fontSize: 12, color: '#9CA3AF' }}>
                    {u.joined_at ? new Date(u.joined_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <button
                      disabled={changingId === u.id}
                      onClick={() => toggleRole(u)}
                      style={{
                        fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 7,
                        border: `1px solid ${u.role === 'admin' ? '#FECACA' : '#C7D2FE'}`,
                        background: u.role === 'admin' ? '#FEF2F2' : '#EEF2FF',
                        color: u.role === 'admin' ? '#DC2626' : '#4F46E5',
                        cursor: changingId === u.id ? 'wait' : 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Icon.Crown />
                      {changingId === u.id ? 'Saving…' : u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
            Admin actions (role changes, deletions) will appear here once the admin_logs table is migrated.
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

// ─── Top header bar ───────────────────────────────────────────────────────────
function TopBar({ view, user }) {
  const titles = {
    analytics: { t: 'Analytics Overview', s: 'Monitor team recognition metrics' },
    users: { t: 'User Management', s: 'Manage members and roles' },
    moderation: { t: 'Moderation Queue', s: 'Review and remove content' },
    logs: { t: 'System Logs', s: 'Track admin actions' },
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

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard');
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderView = () => {
    switch (view) {
      case 'analytics': return <AnalyticsView user={user} />;
      case 'users': return <UserManagementView />;
      case 'moderation': return <div style={{ margin: '-24px -28px' }}><ModerationQueue /></div>;
      case 'logs': return <SystemLogsView />;
      default: return <AnalyticsView user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex' }}>
      <AdminSidebar view={view} setView={setView} onLogout={handleLogout} user={user} />
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
