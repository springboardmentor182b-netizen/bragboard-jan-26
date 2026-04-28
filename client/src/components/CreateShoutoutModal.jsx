import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, Check, ImagePlus, Trash2, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// ── Gemini AI Suggestion helper ─────────────────────────────────────────────
async function fetchAISuggestions({ message, recipientNames, tags }) {
  if (!GEMINI_API_KEY) throw new Error('NO_KEY');

  const context = [
    recipientNames.length > 0 && `Recipients: ${recipientNames.join(', ')}`,
    tags.length > 0 && `Tags/Values: ${tags.join(', ')}`,
  ].filter(Boolean).join('\n');

  const prompt = `You are helping an employee write a shoutout message to recognise a colleague's great work.

${context ? `Context:\n${context}\n` : ''}Current draft: "${message}"

Generate exactly 3 improved, warm, specific shoutout message suggestions based on the draft.
Each suggestion should be 1-2 sentences, professional but friendly, and feel genuine.
Return ONLY a valid JSON array of 3 strings, no markdown, no extra text.
Example: ["suggestion 1", "suggestion 2", "suggestion 3"]`;

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 400 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini request failed');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Main Component ──────────────────────────────────────────────────────────
const CreateShoutoutModal = ({ isOpen, onClose, onSuccess, currentUser }) => {
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const debounceTimer = useRef(null);

  // AI suggestion state
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-tag state
  const [autoTagLoading, setAutoTagLoading] = useState(false);
  const [autoTagError, setAutoTagError] = useState('');

  const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' },
    modal: { backgroundColor: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    header: { position: 'sticky', top: 0, backgroundColor: '#fff', padding: '24px', borderBottom: '1px solid #F3F4F6', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { border: 'none', background: '#F3F4F6', color: '#6B7280', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
    label: { display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' },
    input: { width: '100%', border: '2px solid #E5E7EB', borderRadius: '12px', padding: '12px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
  };

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/users/`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => setUsers(currentUser ? data.filter(u => u.id !== currentUser.id) : data))
        .catch(() => setError('Could not load user list.'));
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  // ── Trigger suggestions ───────────────────────────────────────────────────
  const triggerSuggestions = useCallback(async (currentMessage) => {
    if (!GEMINI_API_KEY) {
      setSuggestionError('Add VITE_GEMINI_API_KEY to your client/.env file to enable AI suggestions.');
      setSuggestions([]);
      setShowSuggestions(true);
      return;
    }
    if (currentMessage.trim().length < 10) return;

    setLoadingSuggestions(true);
    setSuggestionError('');
    setSuggestions([]);
    setShowSuggestions(true);

    try {
      const recipientNames = users
        .filter(u => selectedRecipients.includes(u.id))
        .map(u => u.name);
      const results = await fetchAISuggestions({
        message: currentMessage,
        recipientNames,
        tags: selectedTags,
      });
      setSuggestions(Array.isArray(results) ? results.slice(0, 3) : []);
    } catch (e) {
      if (e.message === 'NO_KEY') {
        setSuggestionError('Add VITE_GEMINI_API_KEY to your client/.env file.');
      } else {
        setSuggestionError('Could not load suggestions — check your Gemini API key.');
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }, [users, selectedRecipients, selectedTags]);

  const handleMessageChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    setShowSuggestions(false);
    clearTimeout(debounceTimer.current);
    if (val.trim().length >= 10) {
      debounceTimer.current = setTimeout(() => triggerSuggestions(val), 1000);
    }
  };

  const applySuggestion = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  if (!isOpen) return null;

  const toggleRecipient = (userId) => {
    setSelectedRecipients(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, GIF, or WebP images allowed.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.'); return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (selectedRecipients.length === 0) return setError("Please select at least one colleague!");
    if (!message.trim()) return setError("Please write a message!");

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let response;

      if (imageFile) {
        const form = new FormData();
        form.append('sender_id', currentUser.id);
        form.append('message', message.trim());
        form.append('recipient_ids', JSON.stringify(selectedRecipients));
        form.append('tags', JSON.stringify(selectedTags));
        form.append('image', imageFile);
        response = await fetch(`${API_URL}/shoutouts/with-image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      } else {
        response = await fetch(`${API_URL}/shoutouts/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            sender_id: currentUser.id,
            recipient_ids: selectedRecipients,
            message: message.trim(),
            tags: selectedTags,
          }),
        });
      }

      if (response.ok) {
        setMessage(''); setSelectedRecipients([]); setSelectedTags([]);
        setImageFile(null); setImagePreview(null);
        setAutoTagError(''); setAutoTagLoading(false);
        setSuggestions([]); setShowSuggestions(false);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to post shoutout');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableTags = ['Teamwork', 'Innovation', 'Leadership', 'Bug Hunter', 'Problem Solving'];
  const selectedUsers = users.filter(u => selectedRecipients.includes(u.id));

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>Give a Shout-out 🎉</h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Recognise a colleague's great work</p>
          </div>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: '16px', color: '#B91C1C', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Recipient Selection */}
          <div style={{ marginBottom: '20px', position: 'relative' }} ref={dropdownRef}>
            <label style={styles.label}>Who are you recognizing?</label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ ...styles.input, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '46px' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                {selectedRecipients.length === 0
                  ? <span style={{ color: '#9CA3AF' }}>Select teammates...</span>
                  : selectedUsers.map(u => (
                    <span key={u.id} style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      {u.name}
                    </span>
                  ))
                }
              </div>
              <ChevronDown size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            </div>
            {dropdownOpen && (
              <div style={{ position: 'absolute', width: '100%', marginTop: '8px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 20, maxHeight: '200px', overflowY: 'auto' }}>
                {users.length === 0
                  ? <p style={{ padding: '16px', color: '#9CA3AF', textAlign: 'center', fontSize: '13px' }}>No colleagues found</p>
                  : users.map(u => (
                    <div
                      key={u.id}
                      onClick={() => toggleRecipient(u.id)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '18px', height: '18px', border: '2px solid #D1D5DB', borderRadius: '4px', backgroundColor: selectedRecipients.includes(u.id) ? '#4F46E5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {selectedRecipients.includes(u.id) && <Check size={12} color="#fff" strokeWidth={4} />}
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{u.name}</span>
                        {u.department && <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: 6 }}>{u.department}</span>}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Message + AI Suggestions */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...styles.label, margin: 0 }}>Message</label>
              <button
                type="button"
                onClick={() => triggerSuggestions(message)}
                disabled={message.trim().length < 10 || loadingSuggestions}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '8px', border: 'none',
                  background: message.trim().length < 10 ? '#F3F4F6' : 'linear-gradient(135deg,#4285F4,#0F9D58)',
                  color: message.trim().length < 10 ? '#9CA3AF' : '#fff',
                  fontSize: '12px', fontWeight: 600,
                  cursor: message.trim().length < 10 ? 'default' : 'pointer',
                  transition: 'all 0.2s', opacity: loadingSuggestions ? 0.7 : 1,
                }}
              >
                <Sparkles size={13} />
                {loadingSuggestions ? 'Thinking…' : '✨ Suggest'}
              </button>
            </div>

            <textarea
              style={{ ...styles.input, minHeight: '110px', resize: 'vertical' }}
              placeholder="What did they do that deserves recognition? Be specific! (AI suggestions appear after 10+ characters)"
              value={message}
              onChange={handleMessageChange}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            <p style={{ fontSize: '11px', color: message.length > 500 ? '#EF4444' : '#9CA3AF', textAlign: 'right', margin: '4px 0 0' }}>
              {message.length}/500
            </p>

            {/* Suggestion panel */}
            {showSuggestions && (
              <div style={{ marginTop: '10px', borderRadius: '12px', border: '1px solid #bfdbfe', background: '#eff6ff', overflow: 'hidden' }}>
                <div style={{ padding: '8px 14px', background: 'linear-gradient(135deg,#4285F4,#0F9D58)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={12} /> Gemini Suggestions — click one to use it
                  </span>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: 0 }}
                  >
                    ×
                  </button>
                </div>

                {loadingSuggestions && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#4285F4', fontSize: '13px' }}>
                    ✨ Gemini is thinking…
                  </div>
                )}

                {!loadingSuggestions && suggestionError && (
                  <div style={{ padding: '12px 14px', color: '#B91C1C', fontSize: '12px' }}>
                    ⚠️ {suggestionError}
                  </div>
                )}

                {!loadingSuggestions && !suggestionError && suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => applySuggestion(s)}
                    style={{
                      padding: '12px 14px', fontSize: '13px', color: '#374151', lineHeight: 1.6,
                      cursor: 'pointer', borderTop: i > 0 ? '1px solid #bfdbfe' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#4285F4', fontWeight: 700, marginRight: '6px' }}>{i + 1}.</span>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Tags <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
              <button
                onClick={async () => {
                  if (!message.trim() || message.trim().length < 10) return;
                  setAutoTagLoading(true);
                  setAutoTagError('');
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${API_URL}/ai/auto-tag`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ message }),
                    });
                    if (!res.ok) {
                      const err = await res.json();
                      throw new Error(err.detail || 'Auto-tag failed');
                    }
                    const data = await res.json();
                    setSelectedTags(prev => {
                      const merged = [...new Set([...prev, ...data.tags])];
                      return merged;
                    });
                  } catch (e) {
                    setAutoTagError(e.message);
                  } finally {
                    setAutoTagLoading(false);
                  }
                }}
                disabled={autoTagLoading || message.trim().length < 10}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: message.trim().length < 10 ? 'not-allowed' : 'pointer', border: '2px solid #4F46E5', backgroundColor: autoTagLoading ? '#EEF2FF' : '#4F46E5', color: '#fff', opacity: message.trim().length < 10 ? 0.5 : 1, transition: 'all 0.15s' }}
              >
                <Sparkles size={13} />
                {autoTagLoading ? 'Tagging…' : 'Auto-tag'}
              </button>
            </div>
            {autoTagError && <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{autoTagError}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {/* AI-generated tags (not in availableTags) shown first */}
              {selectedTags.filter(t => !availableTags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '2px solid #7C3AED', backgroundColor: '#F5F3FF', color: '#7C3AED', transition: 'all 0.15s' }}
                >
                  ✦ {tag}
                </button>
              ))}
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '2px solid', borderColor: selectedTags.includes(tag) ? '#4F46E5' : '#E5E7EB', backgroundColor: selectedTags.includes(tag) ? '#EEF2FF' : '#fff', color: selectedTags.includes(tag) ? '#4F46E5' : '#6B7280', transition: 'all 0.15s' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Attach Image <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional, max 5MB)</span></label>
            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E5E7EB' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={removeImage}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '2px dashed #E5E7EB', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#FAFBFC' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FAFBFC'; }}
              >
                <ImagePlus size={28} style={{ color: '#9CA3AF', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 4px', fontWeight: 500 }}>Click to upload an image</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>JPG, PNG, GIF, WebP · Max 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: submitting ? '#9CA3AF' : 'linear-gradient(135deg,#4F46E5,#6366F1)', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: submitting ? 'none' : '0 4px 12px rgba(79,70,229,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {submitting ? '✨ Posting...' : '🎉 Post Shout-out'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateShoutoutModal;