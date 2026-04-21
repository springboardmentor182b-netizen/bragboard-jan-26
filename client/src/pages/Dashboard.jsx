import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateShoutoutModal from '../components/CreateShoutoutModal';
import { reactionsAPI, commentsAPI } from '../services/api';
import NotificationBell from "../components/NotificationBell";
import '../styles/theme.css';

// Icons (keeping your existing inline SVG icons)
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
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

// Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────

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
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

// Feed View Component
function FeedView({ user }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadShoutouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/shoutouts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to load shoutouts');
      
      const data = await res.json();
      setShoutouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Load error:', err);
      setError('Could not load shoutouts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadShoutouts(); }, []);

  const filtered = shoutouts.filter(s => {
    const tagList = s.tags ? s.tags.split(',').map(t => t.trim()) : [];
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
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)',
        borderRadius: '18px', padding: '28px 32px', marginBottom: '20px', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-40,right:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ position:'absolute',bottom:-30,right:120,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'relative',zIndex:1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p style={{ fontSize: '14px', margin: 0, opacity: 0.85 }}>
            Ready to celebrate your team's achievements today? Give someone a shout-out!
          </p>
        </div>
      </div>

      {/* Quick stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[
          { icon:'🎉', label:'Total Shout-outs', value: shoutouts.length, color:'#4F46E5', bg:'#EEF2FF' },
          { icon:'❤️', label:'Total Likes', value: shoutouts.reduce((a,s)=>a+(s.likes||0),0), color:'#EF4444', bg:'#FEF2F2' },
          { icon:'🏷️', label:'Tagged People', value: [...new Set(shoutouts.flatMap(s=>(s.recipients||[]).map(r=>r.recipient?.id)).filter(Boolean))].length, color:'#10B981', bg:'#F0FDF4' },
        ].map((stat,i)=>(
          <div key={i} style={{ background:'#fff', borderRadius:14, padding:'16px 18px', border:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42,height:42,borderRadius:10,background:stat.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{stat.icon}</div>
            <div>
              <p style={{ fontSize:22,fontWeight:800,color:stat.color,margin:'0 0 1px' }}>{stat.value}</p>
              <p style={{ fontSize:11,color:'#9CA3AF',margin:0,fontWeight:500 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>Recognition Feed</h3>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Celebrating your team's achievements</p>
        </div>
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
            fontSize: '14px', background: '#fff', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="all">All Tags</option>
          <option value="Teamwork">Teamwork</option>
          <option value="Innovation">Innovation</option>
          <option value="Leadership">Leadership</option>
          <option value="Bug Hunter">Bug Hunter</option>
          <option value="Problem Solving">Problem Solving</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '16px', color: '#991B1B'
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
          <div className="animate-spin" style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p>Loading shoutouts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px', background: '#F9FAFB',
          borderRadius: '12px', border: '1px dashed #E5E7EB'
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🎉</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>
            {search || filter !== 'all' ? 'No matching shoutouts' : 'No shoutouts yet'}
          </p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
            {search || filter !== 'all' ? 'Try adjusting your filters' : 'Be the first to recognize someone!'}
          </p>
        </div>
      )}

      {/* Shoutouts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(shoutout => (
          <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
        ))}
      </div>
    </div>
  );
}

// Centralised API base — single source of truth for the whole file
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Shoutout Card Component
function ShoutoutCard({ shoutout }) {
  // Get current user from AuthContext
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ?? null;

  // ── Like ─────────────────────────────────────────────────────────────────
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(shoutout.likes || 0);

  // ── Reactions (clap / star) ──────────────────────────────────────────────
  const [reactions, setReactions] = useState({ like: 0, clap: 0, star: 0, fire: 0, celebrate: 0, wow: 0, thumbsup: 0, rocket: 0, user_reactions: [] });

  // ── Comments + nested replies ─────────────────────────────────────────────
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  // comment_count now comes from backend via ShoutoutResponse
  const [commentCount, setCommentCount] = useState(shoutout.comment_count ?? 0);
  // replyingTo: { id, authorName } of the comment being replied to, or null
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [postingReply, setPostingReply] = useState(false);

  // ── Report ────────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState(null);
  const reportTimerRef = useRef(null);
  useEffect(() => () => { if (reportTimerRef.current) clearTimeout(reportTimerRef.current); }, []);

  const authorName = shoutout.sender?.name || 'Unknown';
  const recipients = shoutout.recipients || [];
  const tagList = Array.isArray(shoutout.tags)
    ? shoutout.tags
    : (shoutout.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const timeAgo = shoutout.created_at
    ? new Date(shoutout.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  // Load reactions on mount — persists across refresh for all users
  useEffect(() => {
    reactionsAPI.getCounts(shoutout.id)
      .then(res => setReactions(res.data))
      .catch(() => {});
  }, [shoutout.id]);

  const handleLike = async () => {
    const prev = liked; const prevLikes = likes;
    setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/shoutouts/${shoutout.id}/like/`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
    } catch { setLiked(prev); setLikes(prevLikes); }
  };

  const handleReaction = async (type) => {
    try {
      const res = await reactionsAPI.toggle(shoutout.id, type);
      setReactions(res.data.counts);
    } catch (err) { console.error('Reaction error', err); }
  };

  // Always re-fetch when opening so any other user's comments appear immediately
  const toggleComments = async () => {
    if (!showComments) {
      try {
        const res = await commentsAPI.getAll(shoutout.id);
        const data = res.data || [];
        setComments(data);
        // total = top-level + all replies
        const total = data.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
        setCommentCount(total);
        setCommentsLoaded(true);
      } catch { setCommentsLoaded(true); }
    }
    setShowComments(v => !v);
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await commentsAPI.post(shoutout.id, commentText.trim());
      setComments(prev => [...prev, { ...res.data, replies: [] }]);
      setCommentCount(c => c + 1);
      setCommentText('');
    } catch { /* silent */ } finally { setPostingComment(false); }
  };

  const handlePostReply = async (parentId) => {
    if (!replyText.trim()) return;
    setPostingReply(true);
    try {
      const res = await commentsAPI.post(shoutout.id, replyText.trim(), parentId);
      setComments(prev => prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), res.data] }
          : c
      ));
      setCommentCount(c => c + 1);
      setReplyText('');
      setReplyingTo(null);
    } catch { /* silent */ } finally { setPostingReply(false); }
  };

  const handleDeleteComment = async (commentId, parentId = null) => {
    try {
      await commentsAPI.delete(commentId);
      if (parentId) {
        // It's a reply — remove from parent's replies array
        setComments(prev => prev.map(c =>
          c.id === parentId
            ? { ...c, replies: (c.replies || []).filter(r => r.id !== commentId) }
            : c
        ));
      } else {
        // Top-level comment — also subtract its replies from count
        const comment = comments.find(c => c.id === commentId);
        const replyCount = comment?.replies?.length || 0;
        setComments(prev => prev.filter(c => c.id !== commentId));
        setCommentCount(c => c - 1 - replyCount);
        return;
      }
      setCommentCount(c => c - 1);
    } catch { /* silent */ }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReportStatus('submitting');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reports/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ shoutout_id: shoutout.id, reason: reportReason }),
      });
      if (res.status === 409) setReportStatus('duplicate');
      else if (res.ok) {
        setReportStatus('success');
        reportTimerRef.current = setTimeout(() => {
          setReportModal(false); setReportStatus(null); setReportReason('');
        }, 1800);
      } else setReportStatus('error');
    } catch { setReportStatus('error'); }
  };

  const userReacted = (type) => reactions.user_reactions?.includes(type);

  const reactionBtn = (type, emoji, label) => (
    <button
      onClick={() => handleReaction(type)}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: userReacted(type) ? (type === 'clap' ? '#FFF7ED' : '#FFFBEB') : 'transparent',
        border: userReacted(type) ? `1.5px solid ${type === 'clap' ? '#FB923C' : '#F59E0B'}` : '1.5px solid transparent',
        borderRadius: '8px', padding: '4px 10px', cursor: 'pointer',
        fontSize: '13px', fontWeight: 600,
        color: userReacted(type) ? (type === 'clap' ? '#EA580C' : '#D97706') : '#6B7280',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!userReacted(type)) e.currentTarget.style.background = '#F9FAFB'; }}
      onMouseLeave={e => { if (!userReacted(type)) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: '15px' }}>{emoji}</span>
      {reactions[type] > 0 && <span>{reactions[type]}</span>}
    </button>
  );

  const avatarStyle = (gradient) => ({
    width: '32px', height: '32px', borderRadius: '50%',
    background: gradient, display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#fff', fontWeight: 700,
    fontSize: '12px', flexShrink: 0,
  });

  const reportReasons = ['Inappropriate content', 'Harassment or bullying', 'False or misleading', 'Spam', 'Other'];

  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s', position: 'relative' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
            {getInitials(authorName)}
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', display: 'block' }}>{authorName}</span>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{timeAgo}</span>
          </div>
        </div>

        {/* 3-dot menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px 8px', borderRadius: '6px', fontSize: '18px', lineHeight: 1, fontWeight: 700, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#374151'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}>
            ···
          </button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '160px', overflow: 'hidden' }}>
                <button onClick={() => { setMenuOpen(false); setReportModal(true); }}
                  style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  🚩 Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Message ────────────────────────────────────────────────── */}
      <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: '0 0 10px 0' }}>
        {shoutout.message}
      </p>

      {/* ── Attached image ─────────────────────────────────────────── */}
      {shoutout.image_url && (
        <div style={{ marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
          <img
            src={`${API_URL}${shoutout.image_url}`}
            alt="Shoutout attachment"
            style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* ── Recipients ─────────────────────────────────────────────── */}
      {recipients.length > 0 && (
        <div style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ color: '#6B7280' }}>Shoutout to</span>
          {recipients.map((r, idx) => {
            const name = r.recipient?.name || r.name;
            if (!name) return null;
            return (
              <span key={r.id || idx} style={{ color: '#4F46E5', background: '#EEF2FF', padding: '3px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}>
                {name}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Tags ───────────────────────────────────────────────────── */}
      {tagList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {tagList.map((tag, i) => (
            <span key={i} style={{ background: '#F3F4F6', color: '#4B5563', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Action bar ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>

        {/* Like */}
        <button onClick={handleLike}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: liked ? '#FEF2F2' : 'transparent', border: liked ? '1.5px solid #FCA5A5' : '1.5px solid transparent', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: liked ? '#EF4444' : '#6B7280', transition: 'all 0.15s' }}
          onMouseEnter={e => { if (!liked) e.currentTarget.style.background = '#F9FAFB'; }}
          onMouseLeave={e => { if (!liked) e.currentTarget.style.background = 'transparent'; }}>
          <span style={{ fontSize: '15px' }}>{liked ? '❤️' : '🤍'}</span>
          <span>{likes > 0 ? likes : ''}</span>
        </button>

        {/* Clap */}
{reactionBtn('clap', '👏', 'Clap')}

{/* Star */}
{reactionBtn('star', '⭐', 'Star')}

{/* Fire */}
{reactionBtn('fire', '🔥', 'Fire')}

{/* Celebrate */}
{reactionBtn('celebrate', '🎉', 'Celebrate')}

{/* Wow */}
{reactionBtn('wow', '😮', 'Wow')}

{/* Thumbs Up */}
{reactionBtn('thumbsup', '👍', 'Thumbs Up')}

{/* Rocket */}
{reactionBtn('rocket', '🚀', 'Rocket')}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Comments toggle */}
        <button onClick={toggleComments}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: showComments ? '#EEF2FF' : 'transparent', border: showComments ? '1.5px solid #C7D2FE' : '1.5px solid transparent', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: showComments ? '#4F46E5' : '#6B7280', transition: 'all 0.15s' }}
          onMouseEnter={e => { if (!showComments) e.currentTarget.style.background = '#F9FAFB'; }}
          onMouseLeave={e => { if (!showComments) e.currentTarget.style.background = showComments ? '#EEF2FF' : 'transparent'; }}>
          <span style={{ fontSize: '15px' }}>💬</span>
          <span>{commentCount > 0 ? commentCount : 'Comment'}</span>
        </button>
      </div>

      {/* ── Comments section ───────────────────────────────────────── */}
      {showComments && (
        <div style={{ marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>

          {/* Loading / empty state */}
          {!commentsLoaded && (
            <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '8px 0 12px' }}>Loading comments…</p>
          )}
          {comments.length === 0 && commentsLoaded && (
            <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '8px 0 12px' }}>
              No comments yet — be the first!
            </p>
          )}

          {/* Comment thread */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: comments.length > 0 ? '14px' : 0 }}>
            {comments.map(c => (
              <div key={c.id}>
                {/* ── Top-level comment ── */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={avatarStyle('linear-gradient(135deg, #10B981, #059669)')}>
                    {getInitials(c.user?.name || '?')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{c.user?.name || 'User'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                          {c.user?.id === currentUserId && (
                            <button onClick={() => handleDeleteComment(c.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#D1D5DB', fontSize: '13px', padding: 0, lineHeight: 1, transition: 'color 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                              onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
                              title="Delete comment">×</button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{c.content}</p>
                    </div>

                    {/* Reply button */}
                    <button
                      onClick={() => setReplyingTo(replyingTo?.id === c.id ? null : { id: c.id, authorName: c.user?.name })}
                      style={{ marginTop: '4px', marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: replyingTo?.id === c.id ? '#4F46E5' : '#9CA3AF', fontWeight: 600, padding: '2px 0', transition: 'color 0.15s' }}>
                      ↩ {replyingTo?.id === c.id ? 'Cancel' : 'Reply'}
                    </button>

                    {/* Inline reply input */}
                    {replyingTo?.id === c.id && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '8px' }}>
                        <div style={avatarStyle('linear-gradient(135deg, #4F46E5, #6366F1)')}>
                          {getInitials(currentUser?.name || '?')}
                        </div>
                        <div style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                          <textarea
                            autoFocus
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostReply(c.id); } }}
                            placeholder={`Reply to ${replyingTo.authorName}… (Enter to post)`}
                            rows={1}
                            style={{ flex: 1, border: '1.5px solid #C7D2FE', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none', resize: 'none', lineHeight: 1.5, fontFamily: 'inherit', background: '#F5F7FF' }}
                          />
                          <button onClick={() => handlePostReply(c.id)} disabled={!replyText.trim() || postingReply}
                            style={{ height: '36px', padding: '0 14px', borderRadius: '10px', border: 'none', background: !replyText.trim() ? '#E5E7EB' : '#4F46E5', color: !replyText.trim() ? '#9CA3AF' : '#fff', fontSize: '12px', fontWeight: 600, cursor: !replyText.trim() ? 'default' : 'pointer', flexShrink: 0 }}>
                            {postingReply ? '…' : 'Reply'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── Nested replies ── */}
                    {c.replies?.length > 0 && (
                      <div style={{ marginTop: '8px', marginLeft: '8px', borderLeft: '2px solid #E5E7EB', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {c.replies.map(reply => (
                          <div key={reply.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={avatarStyle('linear-gradient(135deg, #8B5CF6, #6D28D9)')}>
                              {getInitials(reply.user?.name || '?')}
                            </div>
                            <div style={{ flex: 1, background: '#F3F4FF', borderRadius: '10px', padding: '9px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{reply.user?.name || 'User'}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                    {new Date(reply.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                  </span>
                                  {reply.user?.id === currentUserId && (
                                    <button onClick={() => handleDeleteComment(reply.id, c.id)}
                                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#D1D5DB', fontSize: '13px', padding: 0, lineHeight: 1, transition: 'color 0.15s' }}
                                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                                      onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
                                      title="Delete reply">×</button>
                                  )}
                                </div>
                              </div>
                              <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New top-level comment input */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={avatarStyle('linear-gradient(135deg, #4F46E5, #6366F1)')}>
              {getInitials(currentUser?.name || '?')}
            </div>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostComment(); } }}
              placeholder="Write a comment… (Enter to post, Shift+Enter for new line)"
              rows={1}
              style={{ flex: 1, border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '9px 12px', fontSize: '13px', outline: 'none', resize: 'none', lineHeight: 1.5, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            <button onClick={handlePostComment} disabled={!commentText.trim() || postingComment}
              style={{ height: '38px', padding: '0 16px', borderRadius: '10px', border: 'none', background: !commentText.trim() ? '#E5E7EB' : '#4F46E5', color: !commentText.trim() ? '#9CA3AF' : '#fff', fontSize: '13px', fontWeight: 600, cursor: !commentText.trim() ? 'default' : 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
              {postingComment ? '…' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* ── Report Modal ───────────────────────────────────────────── */}
      {reportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            {reportStatus === 'success' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Report submitted</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Admins will review this shoutout.</p>
              </div>
            ) : reportStatus === 'duplicate' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px' }}>Already reported</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>You've already reported this shoutout.</p>
                <button onClick={() => { setReportModal(false); setReportStatus(null); }} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Close</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>🚩 Report Shoutout</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Select a reason. Admins will review your report.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {reportReasons.map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${reportReason === r ? '#4F46E5' : '#E5E7EB'}`, background: reportReason === r ? '#EEF2FF' : '#fff', transition: 'all 0.15s' }}>
                      <input type="radio" name={`report-${shoutout.id}`} value={r} checked={reportReason === r} onChange={() => setReportReason(r)} style={{ accentColor: '#4F46E5' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{r}</span>
                    </label>
                  ))}
                </div>
                {reportStatus === 'error' && <p style={{ fontSize: '12px', color: '#DC2626', marginBottom: '12px' }}>Something went wrong. Try again.</p>}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setReportModal(false); setReportReason(''); setReportStatus(null); }} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
                  <button onClick={handleReport} disabled={!reportReason || reportStatus === 'submitting'} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: !reportReason ? '#E5E7EB' : '#DC2626', color: !reportReason ? '#9CA3AF' : '#fff', cursor: !reportReason ? 'default' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    {reportStatus === 'submitting' ? 'Submitting…' : 'Submit Report'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// My Shoutouts View (keeping existing implementation)
function MyShoutoutsView({ user }) {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/shoutouts/my/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => { setShoutouts(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => { setShoutouts([]); setLoading(false); });
    }
  }, [user]);

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>My Shout-outs</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Shoutouts you've given and received</p>

      {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!loading && shoutouts.map(shoutout => (
          <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
        ))}
      </div>

      {!loading && shoutouts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', background: '#F9FAFB', borderRadius: '12px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>🏆</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No shoutouts yet</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Shoutouts you've given and received will appear here</p>
        </div>
      )}
    </div>
  );
}

// Leaderboard View (keeping existing)
function LeaderboardView() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const medals = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    fetch(`${API_URL}/leaderboard/most-appreciated`, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    })
      .then(res => res.json())
      .then(data => { 
        setLeaders(Array.isArray(data) ? data : []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>Leaderboard</h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Most appreciated employees</p>
      
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading && <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
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
              {medals[i] || `#${i + 1}`}
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
              {l.score} shoutouts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Departments View (keeping existing)
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
      .catch(() => setLoading(false));
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

// Main Dashboard Component
// Main Dashboard Component
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('feed');
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleModalSuccess = () => {
    setShowModal(false);
    // Refresh the feed by switching views
    if (currentView === 'feed') {
      setCurrentView('my-shoutouts');
      setTimeout(() => setCurrentView('feed'), 100);
    }
  };

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

      <main style={{ paddingLeft: '256px', flex: 1, minHeight: '100vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 32px' }}>
          
          {/* THIS IS THE NEW PART: The notification bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <NotificationBell />
          </div>

          {renderView()}
        </div>
      </main>

      {/* Modal */}
      <CreateShoutoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        currentUser={user}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
export default Dashboard;