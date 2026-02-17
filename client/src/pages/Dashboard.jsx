import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ currentView, onViewChange, onLogout, user, onCreateShoutout }) {
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
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#1F2937'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}}
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
  const [likes, setLikes] = useState(shoutout.likes);

  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '20px',
      border: shoutout.featured ? '1.5px solid #10B981' : '1px solid #E5E7EB',
      boxShadow: shoutout.featured ? '0 4px 16px rgba(16,185,129,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
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
            {getInitials(shoutout.author)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{shoutout.author}</span>
              {shoutout.featured && (
                <span style={{
                  background: '#10B981', color: '#fff', fontSize: '10px',
                  fontWeight: 700, padding: '2px 8px', borderRadius: '20px'
                }}>⭐ Featured</span>
              )}
            </div>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{shoutout.timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: '0 0 10px 0' }}>
        {shoutout.message}
      </p>

      {/* Recipient */}
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
        Shoutout to{' '}
        <span style={{
          color: '#4F46E5', background: '#EEF2FF',
          padding: '2px 8px', borderRadius: '4px', fontWeight: 600
        }}>
          {shoutout.recipient}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {shoutout.tags.map((tag, i) => (
          <span key={i} style={{
            background: '#F3F4F6', color: '#4B5563', fontSize: '11px',
            fontWeight: 600, padding: '4px 10px', borderRadius: '6px'
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '20px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
        <button
          onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
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
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '13px', fontWeight: 600, color: '#6B7280', transition: 'color 0.15s ease'
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
          onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
        >
          <ChatIcon /> {shoutout.comments}
        </button>
      </div>
    </div>
  );
}

// ─── Create Shoutout Modal ────────────────────────────────────────────────────
function CreateShoutoutModal({ onClose }) {
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Who are you recognizing?
          </label>
          <input placeholder="@teammate name" style={{
            width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
            borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
          }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            What did they do?
          </label>
          <textarea rows={4} placeholder="Share what they did that deserves recognition..." style={{
            width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB',
            borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            fontFamily: 'inherit'
          }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px',
            background: '#fff', color: '#6B7280', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}>
            Cancel
          </button>
          <button onClick={onClose} style={{
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            background: '#4F46E5', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
          }}>
            Post Shout-out 🎉
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

  const shoutouts = [
    {
      id: 1, author: user?.name || 'Sarah Johnson',
      timeAgo: '2 hours ago',
      message: 'Huge props to Mike for staying late to fix that critical bug! Your dedication saved the day and kept our release on track. True team player! 💪',
      recipient: '@Mike Chen', tags: ['Teamwork', 'Problem Solving'], likes: 12, comments: 2, featured: true
    },
    {
      id: 2, author: 'David Kim', timeAgo: '5 hours ago',
      message: "Shoutout to Emily for leading that amazing client presentation! Your preparation and clarity impressed everyone. We couldn't have done it without you!",
      recipient: '@Emily Rodriguez', tags: ['Leadership', 'Communication'], likes: 8, comments: 1, featured: false
    },
    {
      id: 3, author: 'Priya Sharma', timeAgo: 'Yesterday',
      message: 'Big thanks to Alex for mentoring our new hires. The onboarding experience has been so much better because of your patience and expertise.',
      recipient: '@Alex Torres', tags: ['Mentorship', 'Leadership'], likes: 15, comments: 4, featured: false
    },
  ];

  const filtered = shoutouts.filter(s =>
    (filter === 'all' || s.tags.some(t => t.toLowerCase() === filter.toLowerCase())) &&
    (search === '' || s.message.toLowerCase().includes(search.toLowerCase()) || s.recipient.toLowerCase().includes(search.toLowerCase()))
  );

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
        {filtered.map(s => <ShoutoutCard key={s.id} shoutout={s} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No shoutouts found</p>
          </div>
        )}
      </div>

      {showModal && <CreateShoutoutModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ─── My Shoutouts View ────────────────────────────────────────────────────────
function MyShoutoutsView({ user }) {
  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>My Shout-outs</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Recognitions you've sent and received</p>
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '48px 24px',
        textAlign: 'center', border: '1px solid #E5E7EB'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🏆</p>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>Your recognition history</p>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Shoutouts you've given and received will appear here</p>
      </div>
    </div>
  );
}


// ─── Leaderboard View ─────────────────────────────────────────────────────
function LeaderboardView() {
  const leaders = [
    { rank: 1, name: 'Sarah Johnson', dept: 'Engineering', count: 12, medal: '🥇' },
    { rank: 2, name: 'Mike Chen', dept: 'Product', count: 10, medal: '🥈' },
    { rank: 3, name: 'Emily Rodriguez', dept: 'Design', count: 9, medal: '🥉' },
    { rank: 4, name: 'Alex Torres', dept: 'Engineering', count: 7, medal: '' },
    { rank: 5, name: 'Priya Sharma', dept: 'Marketing', count: 6, medal: '' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Leaderboard</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Top contributors this month</p>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {leaders.map((l, i) => (
          <div key={l.rank} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
            borderBottom: i < leaders.length - 1 ? '1px solid #F3F4F6' : 'none',
            background: l.rank === 1 ? 'linear-gradient(90deg, #FFFBEB, #fff)' : '#fff'
          }}>
            <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>
              {l.medal || `#${l.rank}`}
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
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{l.dept}</p>
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
  const depts = [
    { name: 'Engineering', count: 42, emoji: '⚙️' },
    { name: 'Product', count: 28, emoji: '🎯' },
    { name: 'Design', count: 21, emoji: '🎨' },
    { name: 'Marketing', count: 19, emoji: '📢' },
    { name: 'Sales', count: 15, emoji: '💼' },
    { name: 'HR', count: 12, emoji: '🤝' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Departments</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Recognition breakdown by department</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {depts.map(d => (
          <div key={d.name} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease', cursor: 'pointer'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
          >
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>{d.emoji}</span>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{d.name}</p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{d.count} shoutouts</p>
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

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderView = () => {
    switch (currentView) {
      case 'feed': return <FeedView user={user} />;
      case 'my-shoutouts': return <MyShoutoutsView user={user} />;
      case 'leaderboard': return <LeaderboardView />;
      case 'departments': return <DepartmentsView />;
      default: return <FeedView user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        user={user}
        onCreateShoutout={() => setShowModal(true)}
      />

      {/* Main Content */}
      <main style={{ paddingLeft: '256px', flex: 1, minHeight: '100vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 32px' }}>
          {renderView()}
        </div>
      </main>

      {showModal && <CreateShoutoutModal onClose={() => setShowModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default Dashboard;