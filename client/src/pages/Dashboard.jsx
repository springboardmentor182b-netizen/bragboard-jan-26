import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function HomeIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>; }
function UserIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>; }
function TrophyIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15l-2 5h4l-2-5zm0 0a5 5 0 005-5V4H7v6a5 5 0 005 5zM7 4H4v3a3 3 0 003 3m10-6h3v3a3 3 0 01-3 3" /></svg>; }
function UsersIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" /></svg>; }
function PlusIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" /></svg>; }
function HeartIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>; }
function SearchIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function LogOutIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" /></svg>; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function DashboardSidebar({ currentView, onViewChange, onLogout, user, onCreateShoutout }) {
  const navItems = [
    { id: 'feed', label: 'Activity Feed', icon: HomeIcon },
    { id: 'my-shoutouts', label: 'My Shout-outs', icon: UserIcon },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
    { id: 'departments', label: 'Departments', icon: UsersIcon },
  ];

  return (
    <aside style={{
      width: '256px', background: '#FFFFFF', borderRight: '1px solid #E5E7EB',
      height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 20, boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            background: '#4F46E5', padding: '8px', borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <TrophyIcon />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#111827', letterSpacing: '-0.3px' }}>
            BragBoard
          </span>
        </div>

        {/* Give Shoutout Button */}
        <button
          onClick={onCreateShoutout}
          style={{
            width: '100%', background: '#4F46E5', color: '#fff', border: 'none',
            borderRadius: '50px', height: '44px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4338CA'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <PlusIcon />
          Give a Shout-out
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px', marginBottom: '8px' }}>
          Menu
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
                background: active ? '#EEF2FF' : 'transparent',
                color: active ? '#4F46E5' : '#6B7280',
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
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0,
            border: '2px solid #fff', boxShadow: '0 0 0 1px #E5E7EB'
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>
              {user?.department || 'Employee'}
            </p>
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

// ─── Shoutout Card ────────────────────────────────────────────────────────────
function ShoutoutCard({ shoutout }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(shoutout.likes || 0);

  // Normalise fields — handle both API format and any legacy format
  const authorName = shoutout.sender?.name || shoutout.author || 'Unknown';
  const recipientNames = shoutout.recipients?.length
    ? shoutout.recipients.map(r => r.recipient?.name || r.name).join(', ')
    : shoutout.recipient || '';
  const tagList = Array.isArray(shoutout.tags)
    ? shoutout.tags
    : (shoutout.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const timeAgo = shoutout.created_at
    ? new Date(shoutout.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : shoutout.timeAgo || '';

  const handleLike = async () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    await fetch(`${API_URL}/shoutouts/${shoutout.id}/like`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).catch(() => { });
  };

  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '20px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '14px'
          }}>
            {getInitials(authorName)}
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', display: 'block' }}>{authorName}</span>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: '0 0 10px 0' }}>
        {shoutout.message}
      </p>

      {/* Recipient */}
      {recipientNames && (
        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
          Shoutout to{' '}
          <span style={{ color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            {recipientNames}
          </span>
        </div>
      )}

      {/* Tags */}
      {tagList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {tagList.map((tag, i) => (
            <span key={i} style={{
              background: '#F3F4F6', color: '#4B5563', fontSize: '11px',
              fontWeight: 600, padding: '4px 10px', borderRadius: '6px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '20px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
        <button
          onClick={handleLike}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
            color: liked ? '#EF4444' : '#6B7280',
            transition: 'color 0.15s ease'
          }}
        >
          <HeartIcon /> {likes}
        </button>
      </div>
    </div>
  );
}

// ─── Create Shoutout Modal ────────────────────────────────────────────────────
function CreateShoutoutModal({ onClose, currentUser, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load all users to pick recipient from
  useEffect(() => {
    fetch(`${API_URL}/users/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data.filter(u => u.id !== currentUser?.id) : []))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = async () => {
    if (!recipientId) { setError('Please select a recipient'); return; }
    if (!message.trim()) { setError('Please write a message'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/shoutouts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sender_id: currentUser.id,
          recipient_ids: [parseInt(recipientId)],
          message: message.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        onSuccess && onSuccess();
        onClose();
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to post shoutout');
      }
    } catch {
      setError('Could not connect to server');
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 20px 0' }}>
          Give a Shout-out 🎉
        </h2>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px', background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px' }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Who are you recognizing?
          </label>
          <select value={recipientId} onChange={e => setRecipientId(e.target.value)} style={{
            width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
            borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            background: '#fff', color: '#374151'
          }}>
            <option value="">Select a teammate...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.department || 'General'}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            What did they do?
          </label>
          <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Share what they did that deserves recognition..." style={{
              width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
              borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical',
              boxSizing: 'border-box', fontFamily: 'inherit'
            }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Tags (comma separated)
          </label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="e.g. Teamwork, Leadership" style={{
              width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
              borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
            }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px',
            background: '#fff', color: '#6B7280', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting} style={{
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            background: submitting ? '#9CA3AF' : '#4F46E5', color: '#fff',
            fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
          }}>
            {submitting ? 'Posting...' : 'Post Shout-out 🎉'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Feed View ────────────────────────────────────────────────────────────────
function FeedView({ user }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShoutouts = () => {
    fetch(`${API_URL}/shoutouts/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => { setShoutouts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setShoutouts([]); setLoading(false); });
  };

  useEffect(() => { loadShoutouts(); }, []);

  const filtered = shoutouts.filter(s => {
    const tagList = s.tags ? (Array.isArray(s.tags) ? s.tags : s.tags.split(',').map(t => t.trim())) : [];
    const matchFilter = filter === 'all' || tagList.some(t => t.toLowerCase() === filter.toLowerCase());
    const matchSearch = search === '' ||
      s.message?.toLowerCase().includes(search.toLowerCase()) ||
      s.sender?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
        borderRadius: '16px', padding: '28px 32px', marginBottom: '28px', color: '#fff'
      }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h2>
        <p style={{ fontSize: '15px', margin: 0, opacity: 0.9 }}>
          Ready to celebrate your team's achievements today?
        </p>
      </div>

      {/* Feed Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>Recognition Feed</h3>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Celebrate your team's achievements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px', background: '#4F46E5', color: '#fff', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4338CA'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <PlusIcon /> Create Shoutout
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
            <SearchIcon />
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search shoutouts..."
            style={{
              width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #E5E7EB',
              borderRadius: '8px', fontSize: '14px', background: '#fff', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <select
          value={filter} onChange={e => setFilter(e.target.value)}
          style={{
            padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px',
            fontSize: '14px', background: '#fff', color: '#374151', cursor: 'pointer', outline: 'none', minWidth: '160px'
          }}
        >
          <option value="all">All Categories</option>
          <option value="Teamwork">Teamwork</option>
          <option value="Leadership">Leadership</option>
          <option value="Problem Solving">Problem Solving</option>
          <option value="Mentorship">Mentorship</option>
          <option value="Communication">Communication</option>
        </select>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading && <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0' }}>Loading...</p>}
        {!loading && filtered.map(s => <ShoutoutCard key={s.id} shoutout={s} />)}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🎉</p>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No shoutouts yet — be the first!</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateShoutoutModal
          onClose={() => setShowModal(false)}
          currentUser={user}
          onSuccess={loadShoutouts}
        />
      )}
    </div>
  );
}

// ─── My Shoutouts View ────────────────────────────────────────────────────────
function MyShoutoutsView({ user }) {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_URL}/shoutouts/my/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => { setShoutouts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setShoutouts([]); setLoading(false); });
  }, [user]);

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>My Shout-outs</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Recognitions you've sent and received</p>
      {loading && <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0' }}>Loading...</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {!loading && shoutouts.map(s => <ShoutoutCard key={s.id} shoutout={s} />)}
        {!loading && shoutouts.length === 0 && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '48px 24px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🏆</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No shoutouts yet</p>
            <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Shoutouts you've given and received will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Leaderboard View ─────────────────────────────────────────────────────────
function LeaderboardView() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const medals = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    fetch(`${API_URL}/leaderboard/most-appreciated`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => { setLeaders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { console.error('Leaderboard fetch failed:', err); setLoading(false); });
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Leaderboard</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Most appreciated employees</p>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading && (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>
        )}
        {!loading && leaders.length === 0 && (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>
            🏆 No shoutouts yet — be the first to recognise someone!
          </p>
        )}
        {!loading && leaders.map((l, i) => (
          <div key={l.id} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
            borderBottom: i < leaders.length - 1 ? '1px solid #F3F4F6' : 'none',
            background: i === 0 ? 'linear-gradient(90deg, #FFFBEB, #fff)' : '#fff'
          }}>
            <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>
              {medals[i] || `#${l.rank}`}
            </span>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '14px'
            }}>
              {getInitials(l.name)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px 0' }}>{l.name}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{l.department}</p>
            </div>
            <span style={{
              background: '#EEF2FF', color: '#4F46E5', fontWeight: 700, fontSize: '13px',
              padding: '4px 12px', borderRadius: '20px'
            }}>
              {l.count} shoutouts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Departments View ─────────────────────────────────────────────────────────
function DepartmentsView() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const deptEmojis = { Engineering: '⚙️', Product: '🎯', Design: '🎨', Marketing: '📢', Sales: '💼', HR: '🤝' };

  useEffect(() => {
    fetch(`${API_URL}/leaderboard/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => { setDepts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { console.error('Departments fetch failed:', err); setLoading(false); });
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Departments</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Recognition breakdown by department</p>
      {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
      {!loading && depts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No department data yet.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {!loading && depts.map(d => (
          <div key={d.name} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease', cursor: 'pointer'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
          >
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>
              {deptEmojis[d.name] || '🏢'}
            </span>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{d.name}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 2px 0' }}>{d.member_count} members</p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{d.shoutout_count} shoutouts</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('feed');
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      <DashboardSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        user={user}
        onCreateShoutout={() => setShowModal(true)}
      />

      <main style={{ flex: 1, marginLeft: '256px', padding: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {currentView === 'feed' && <FeedView user={user} />}
          {currentView === 'my-shoutouts' && <MyShoutoutsView user={user} />}
          {currentView === 'leaderboard' && <LeaderboardView />}
          {currentView === 'departments' && <DepartmentsView />}
        </div>
      </main>

      {showModal && (
        <CreateShoutoutModal
          onClose={() => setShowModal(false)}
          currentUser={user}
          onSuccess={() => {
            setShowModal(false);
            setCurrentView('feed');
          }}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default Dashboard;