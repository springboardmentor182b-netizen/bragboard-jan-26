import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CreateShoutoutModal = ({ isOpen, onClose, onSuccess, currentUser }) => {
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  // Styles Object for Consistency
  const styles = {
    overlay: {
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)'
    },
    modal: {
      backgroundColor: '#fff', borderRadius: '20px', width: '100%',
      maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto',
      position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    header: {
      position: 'sticky', top: 0, backgroundColor: '#fff', padding: '24px',
      borderBottom: '1px solid #F3F4F6', zIndex: 10, display: 'flex',
      justifyContent: 'space-between', alignItems: 'center'
    },
    closeBtn: {
      border: 'none', background: '#F3F4F6', color: '#6B7280',
      borderRadius: '50%', padding: '8px', cursor: 'pointer',
      display: 'flex', transition: 'all 0.2s'
    },
    label: {
      display: 'block', fontSize: '14px', fontWeight: 600,
      color: '#374151', marginBottom: '8px'
    },
    input: {
      width: '100%', border: '2px solid #E5E7EB', borderRadius: '12px',
      padding: '12px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    }
  };

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      // Added trailing slash to match FastAPI strict routing
      fetch(`${API_URL}/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to load users');
          return res.json();
        })
        .then(data => {
          if (currentUser) {
            setUsers(data.filter(u => u.id !== currentUser.id));
          } else {
            setUsers(data);
          }
        })
        .catch(err => {
          console.error("Failed to load colleagues", err);
          setError("Could not load user list.");
        });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const toggleRecipient = (userId) => {
    setSelectedRecipients(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedRecipients.length === 0) return setError("Select at least one colleague!");
    if (!message.trim()) return setError("Please write a message!");

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/shoutouts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_id: currentUser.id,
          recipient_ids: selectedRecipients,
          message: message.trim(),
          tags: selectedTags
        })
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to post shoutout');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableTags = ['Teamwork', 'Innovation', 'Leadership', 'Bug Hunter', 'Problem Solving'];
  const selectedUsers = users.filter(u => selectedRecipients.includes(u.id));

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>Give a Shout-out 🎉</h2>
          <button onClick={onClose} style={styles.closeBtn} onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'} onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {error && <div style={{ marginBottom: '16px', color: '#B91C1C', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>{error}</div>}

          {/* Recipient Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Who are you recognizing?</label>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ ...styles.input, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {selectedRecipients.length === 0 ? <span style={{ color: '#9CA3AF' }}>Select teammates...</span> : 
                  selectedUsers.map(u => (
                    <span key={u.id} style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{u.name}</span>
                  ))
                }
              </div>
              <ChevronDown size={18} style={{ color: '#9CA3AF' }} />
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', width: 'calc(100% - 48px)', marginTop: '8px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 20, maxHeight: '200px', overflowY: 'auto' }}>
                {users.map(u => (
                  <div key={u.id} onClick={() => toggleRecipient(u.id)} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' }}>
                    <div style={{ width: '18px', height: '18px', border: '2px solid #D1D5DB', borderRadius: '4px', backgroundColor: selectedRecipients.includes(u.id) ? '#4F46E5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedRecipients.includes(u.id) && <Check size={12} color="#fff" strokeWidth={4} />}
                    </div>
                    <span style={{ fontSize: '14px', color: '#374151' }}>{u.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Message</label>
            <textarea 
              style={{ ...styles.input, minHeight: '120px', resize: 'none' }}
              placeholder="What did they do that deserves recognition?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Tags (optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  style={{
                    padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '2px solid',
                    borderColor: selectedTags.includes(tag) ? '#4F46E5' : '#E5E7EB',
                    backgroundColor: selectedTags.includes(tag) ? '#EEF2FF' : '#fff',
                    color: selectedTags.includes(tag) ? '#4F46E5' : '#6B7280'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
              backgroundColor: submitting ? '#9CA3AF' : '#4F46E5', color: '#fff', 
              fontSize: '16px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(79,70,229,0.2)'
            }}
          >
            {submitting ? 'Posting...' : 'Post Shout-out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShoutoutModal;