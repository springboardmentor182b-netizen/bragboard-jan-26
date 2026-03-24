import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import '../styles/theme.css';

// ─── Icons ────────────────────────────────────────────────────────────────────
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" /><line x1="2" x2="22" y1="20" y2="20" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
);
const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx="12" cy="8" r="6" />
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// ─── Admin Sidebar ────────────────────────────────────────────────────────────
function AdminSidebar({ currentView, onViewChange, onLogout, user }) {
  const navItems = [
    { id: 'analytics', label: 'Analytics Overview', icon: BarChartIcon },
    { id: 'users', label: 'User Management', icon: UsersIcon },
    { id: 'moderation', label: 'Moderation Queue', icon: ShieldIcon },
    { id: 'logs', label: 'System Logs', icon: FileTextIcon },
  ];

  return (
    <aside style={{
      width: '256px', background: '#FFFFFF', borderRight: '1px solid #E5E7EB',
      height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 20, boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            padding: '8px', borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AwardIcon />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#111827', letterSpacing: '-0.3px', display: 'block' }}>
              BragBoard
            </span>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px', marginBottom: '8px' }}>
          Management
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: active ? 600 : 500, marginBottom: '2px',
                background: active ? '#FEF2F2' : 'transparent',
                color: active ? '#DC2626' : '#6B7280',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#1F2937'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', background: 'rgba(249,250,251,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin'}
            </p>
            <p style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600, margin: 0 }}>👑 Administrator</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: '#EF4444', padding: '4px', borderRadius: '6px', display: 'flex',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor, icon, iconBg }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '20px',
      border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, margin: '0 0 6px 0' }}>{label}</p>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: '12px', color: subColor || '#10B981', fontWeight: 600, margin: 0 }}>{sub}</p>}
        </div>
        <div style={{ background: iconBg, padding: '10px', borderRadius: '10px' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
      <div style={{
        width: '36px', height: '36px', border: '3px solid #E5E7EB',
        borderTopColor: '#DC2626', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Analytics View ───────────────────────────────────────────────────────────
function AnalyticsView({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(res => setAnalytics(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#DC2626', padding: '20px', textAlign: 'center' }}>❌ {error}</div>;

  const { stats, top_performers, category_stats } = analytics;
  const maxCategoryCount = category_stats.length > 0 ? Math.max(...category_stats.map(c => c.count)) : 1;

  const statCards = [
    { label: 'Total Employees', value: stats.total_users, sub: `${stats.total_users} registered`, subColor: '#10B981', icon: <UsersIcon />, iconBg: '#EEF2FF' },
    { label: 'Total Shoutouts', value: stats.total_shoutouts, sub: `${stats.total_flagged} flagged`, subColor: stats.total_flagged > 0 ? '#F59E0B' : '#4F46E5', icon: <AwardIcon />, iconBg: '#FEF3C7' },
    { label: 'Total Likes', value: stats.total_likes, subColor: '#10B981', icon: <HeartIcon />, iconBg: '#FEF2F2' },
    { label: 'Flagged Content', value: stats.total_flagged, sub: stats.total_flagged > 0 ? 'Needs review' : 'All clear!', subColor: stats.total_flagged > 0 ? '#DC2626' : '#10B981', icon: <ShieldIcon />, iconBg: '#FEF2F2' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
        borderRadius: '16px', padding: '28px 32px', marginBottom: '28px', color: '#fff'
      }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
        </h2>
        <p style={{ fontSize: '15px', margin: 0, opacity: 0.9 }}>
          Here's what's happening with your team's recognition platform today
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Top Performers */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>🏆 Top Performers</h4>
          </div>
          {top_performers.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>No data yet</div>
          ) : (
            top_performers.map((e, i) => (
              <div key={e.name} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px', borderBottom: i < top_performers.length - 1 ? '1px solid #F9FAFB' : 'none'
              }}>
                <span style={{ fontSize: '14px', color: '#9CA3AF', width: '20px' }}>#{i + 1}</span>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '12px'
                }}>
                  {getInitials(e.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 1px 0' }}>{e.name}</p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{e.department}</p>
                </div>
                <span style={{ background: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
                  {e.count}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Category Breakdown */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>📊 Top Categories</h4>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {category_stats.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#9CA3AF' }}>No tags yet</div>
            ) : (
              category_stats.map(c => (
                <div key={c.name} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{c.name}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{c.count}</span>
                  </div>
                  <div style={{ background: '#F3F4F6', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px', width: `${Math.round((c.count / maxCategoryCount) * 100)}%`,
                      background: 'linear-gradient(90deg, #4F46E5, #6366F1)', transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>⚡ Quick Actions</h4>
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { icon: <UserPlusIcon />, label: 'Add User', sub: 'Invite new team member', color: '#4F46E5', bg: '#EEF2FF' },
            { icon: <ShieldIcon />, label: 'Review Reports', sub: 'View flagged content', color: '#DC2626', bg: '#FEF2F2' },
            { icon: <StarIcon />, label: 'Feature Post', sub: 'Highlight a shoutout', color: '#F59E0B', bg: '#FFFBEB' },
          ].map(a => (
            <button
              key={a.label}
              style={{
                background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '10px',
                padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 12px ${a.bg}`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ background: a.bg, display: 'inline-flex', padding: '8px', borderRadius: '8px', marginBottom: '10px', color: a.color }}>
                {a.icon}
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 3px 0' }}>{a.label}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{a.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── User Management View ─────────────────────────────────────────────────────
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers()
      .then(res => { setUsers(res.data); setError(null); })
      .catch(err => setError(err.response?.data?.detail || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'employee' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    setActionLoading(userId);
    try {
      await adminAPI.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return;

    setActionLoading(userId);
    try {
      await adminAPI.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#DC2626', padding: '20px', textAlign: 'center' }}>❌ {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>User Management</h3>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Manage team members and their roles — {users.length} users</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              {['Name', 'Department', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: u.role === 'admin' ? 'linear-gradient(135deg, #DC2626, #EF4444)' : 'linear-gradient(135deg, #4F46E5, #6366F1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '12px'
                    }}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 1px 0' }}>{u.name}</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6B7280' }}>{u.department}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                    background: u.role === 'admin' ? '#FEF2F2' : '#EEF2FF',
                    color: u.role === 'admin' ? '#DC2626' : '#4F46E5'
                  }}>
                    {u.role === 'admin' ? '👑 Admin' : 'Employee'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '12px', color: '#9CA3AF' }}>
                  {u.joined_at ? new Date(u.joined_at).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleRoleChange(u.id, u.role)}
                      disabled={actionLoading === u.id}
                      style={{
                        fontSize: '12px', fontWeight: 500, color: '#4F46E5', background: '#EEF2FF',
                        border: '1px solid #C7D2FE', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer',
                        opacity: actionLoading === u.id ? 0.5 : 1
                      }}
                    >
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={actionLoading === u.id}
                      style={{
                        fontSize: '12px', fontWeight: 500, color: '#DC2626', background: '#FEF2F2',
                        border: '1px solid #FECACA', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer',
                        opacity: actionLoading === u.id ? 0.5 : 1
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Moderation View ──────────────────────────────────────────────────────────
function ModerationView() {
  const [shoutouts, setShoutouts] = useState([]);
  const [allShoutouts, setAllShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('flagged'); // 'flagged' | 'all'
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminAPI.getFlaggedShoutouts(),
      adminAPI.getAllShoutouts(),
    ])
      .then(([flaggedRes, allRes]) => {
        setShoutouts(flaggedRes.data);
        setAllShoutouts(allRes.data);
        setError(null);
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to load moderation data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleFlag = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.flagShoutout(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to flag shoutout');
    } finally { setActionLoading(null); }
  };

  const handleUnflag = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.unflagShoutout(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to unflag shoutout');
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this shoutout?')) return;
    setActionLoading(id);
    try {
      await adminAPI.deleteShoutout(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete shoutout');
    } finally { setActionLoading(null); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#DC2626', padding: '20px', textAlign: 'center' }}>❌ {error}</div>;

  const displayList = tab === 'flagged' ? shoutouts : allShoutouts;

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Moderation Queue</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '16px' }}>Review and manage shoutout content</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['flagged', 'all'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid',
            borderColor: tab === t ? '#DC2626' : '#E5E7EB',
            background: tab === t ? '#FEF2F2' : '#fff',
            color: tab === t ? '#DC2626' : '#6B7280',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            {t === 'flagged' ? `🚩 Flagged (${shoutouts.length})` : `📋 All Shoutouts (${allShoutouts.length})`}
          </button>
        ))}
      </div>

      {displayList.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB',
          padding: '48px 24px', textAlign: 'center'
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>✅</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>All clear!</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
            {tab === 'flagged' ? 'No flagged content requires review at this time' : 'No shoutouts found'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayList.map(s => (
            <div key={s.id} style={{
              background: '#fff', borderRadius: '12px', border: `1px solid ${s.is_flagged ? '#FECACA' : '#E5E7EB'}`,
              padding: '16px 20px', position: 'relative',
              borderLeft: s.is_flagged ? '4px solid #DC2626' : '4px solid transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{s.sender_name}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>({s.sender_email})</span>
                    {s.is_flagged && <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px' }}>🚩 Flagged</span>}
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0', lineHeight: 1.5 }}>{s.message}</p>
                  {s.recipient_names.length > 0 && (
                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                      → {s.recipient_names.join(', ')}
                    </p>
                  )}
                  {s.tags && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {s.tags.split(',').map(tag => (
                        <span key={tag} style={{ background: '#F3F4F6', color: '#6B7280', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                  {s.is_flagged ? (
                    <button onClick={() => handleUnflag(s.id)} disabled={actionLoading === s.id}
                      style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
                      ✓ Approve
                    </button>
                  ) : (
                    <button onClick={() => handleFlag(s.id)} disabled={actionLoading === s.id}
                      style={{ fontSize: '12px', fontWeight: 600, color: '#F59E0B', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
                      🚩 Flag
                    </button>
                  )}
                  <button onClick={() => handleDelete(s.id)} disabled={actionLoading === s.id}
                    style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>❤️ {s.likes} likes</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{timeAgo(s.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── System Logs View ─────────────────────────────────────────────────────────
function SystemLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAPI.getLogs()
      .then(res => setLogs(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load logs'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#DC2626', padding: '20px', textAlign: 'center' }}>❌ {error}</div>;

  const actionLabels = {
    'change_role': { label: 'Role changed', color: '#4F46E5' },
    'delete_user': { label: 'User deleted', color: '#DC2626' },
    'flag_shoutout': { label: 'Shoutout flagged', color: '#F59E0B' },
    'unflag_shoutout': { label: 'Shoutout approved', color: '#10B981' },
    'delete_shoutout': { label: 'Shoutout deleted', color: '#DC2626' },
  };

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>System Logs</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Admin activity audit trail — {logs.length} entries</p>

      {logs.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB',
          padding: '48px 24px', textAlign: 'center'
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>📋</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No logs yet</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Admin actions will appear here</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {logs.map((log, i) => {
            const actionInfo = actionLabels[log.action] || { label: log.action, color: '#6B7280' };
            return (
              <div key={log.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 20px', borderBottom: i < logs.length - 1 ? '1px solid #F9FAFB' : 'none'
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: actionInfo.color
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 2px 0' }}>
                    {actionInfo.label}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                    by {log.admin_name} • {log.details || `${log.target_type} #${log.target_id}`}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: '#9CA3AF', flexShrink: 0 }}>{timeAgo(log.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
function AdminHeader({ currentView, user }) {
  const titles = {
    analytics: { title: 'Analytics Overview', sub: 'Monitor team recognition metrics' },
    users: { title: 'User Management', sub: 'Manage team members and roles' },
    moderation: { title: 'Moderation Queue', sub: 'Review reported content' },
    logs: { title: 'System Logs', sub: 'Track system activity' },
  };
  const { title, sub } = titles[currentView] || titles.analytics;

  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid #E5E7EB',
      padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10
    }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{title}</h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{sub}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '12px'
          }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600, margin: 0 }}>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('analytics');

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderView = () => {
    switch (currentView) {
      case 'analytics': return <AnalyticsView user={user} />;
      case 'users': return <UserManagementView />;
      case 'moderation': return <ModerationView />;
      case 'logs': return <SystemLogsView />;
      default: return <AnalyticsView user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex' }}>
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <main style={{ paddingLeft: '256px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AdminHeader currentView={currentView} user={user} />
        <div style={{ flex: 1, padding: '28px 32px', maxWidth: '1100px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {renderView()}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default AdminDashboard;