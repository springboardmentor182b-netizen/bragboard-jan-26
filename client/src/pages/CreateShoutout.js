import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CURRENT_USER_ID = 1;

const CreateShoutout = () => {
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    recipient_ids: [],
    message: '',
    tag_names: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchTags();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/`);
      const data = await response.json();
      setUsers(data.filter(u => u.id !== CURRENT_USER_ID));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/shoutouts/tags`);
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setTags([
        { id: 1, name: 'Excellence' },
        { id: 2, name: 'Leadership' },
        { id: 3, name: 'Teamwork' },
        { id: 4, name: 'Innovation' },
        { id: 5, name: 'Mentorship' },
        { id: 6, name: 'Culture' },
        { id: 7, name: 'Creativity' },
        { id: 8, name: 'Reliability' },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.recipient_ids.length === 0) {
      alert('Please select at least one recipient');
      return;
    }
    if (!formData.message.trim()) {
      alert('Please enter a message');
      return;
    }
    if (formData.tag_names.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/shoutouts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: CURRENT_USER_ID,
          ...formData
        })
      });

      if (response.ok) {
        alert('Shoutout sent successfully! 🎉');
        setFormData({ recipient_ids: [], message: '', tag_names: [] });
      } else {
        alert('Failed to send shoutout. Please try again.');
      }
    } catch (error) {
      console.error('Failed to send shoutout:', error);
      alert('Failed to send shoutout. Please try again.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setFormData({ recipient_ids: [], message: '', tag_names: [] });
  };

  const toggleRecipient = (userId) => {
    setFormData(prev => ({
      ...prev,
      recipient_ids: prev.recipient_ids.includes(userId)
        ? prev.recipient_ids.filter(id => id !== userId)
        : [...prev.recipient_ids, userId]
    }));
  };

  const toggleTag = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tag_names: prev.tag_names.includes(tagName)
        ? prev.tag_names.filter(t => t !== tagName)
        : [...prev.tag_names, tagName]
    }));
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">Create Shoutout</h1>
        <p className="text-[#3E5879] mt-1">Recognize a colleague for their great work</p>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-[#213555] mb-6">New Shoutout</h2>
          <p className="text-[#3E5879] mb-6">Show your appreciation and recognize your colleagues</p>

          <div className="mb-6">
            <label className="block text-[#213555] font-semibold mb-3">Choose employees to recognize</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {users.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleRecipient(user.id)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.recipient_ids.includes(user.id)
                      ? 'border-[#213555] bg-[#213555] text-white'
                      : 'border-gray-200 bg-white text-[#213555] hover:border-[#D8C4B6]'
                  }`}
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs opacity-80">({user.department})</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-[#3E5879] mt-2">{formData.recipient_ids.length} employee(s) selected</p>
          </div>

          <div className="mb-6">
            <label className="block text-[#213555] font-semibold mb-3">Message</label>
            <textarea
              className="w-full border-2 border-gray-200 focus:border-[#213555] rounded-lg p-4 h-32 text-[#213555] focus:outline-none transition-colors resize-none"
              placeholder="Write your message of appreciation..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              maxLength={500}
            />
            <p className="text-xs text-[#3E5879] mt-2">{formData.message.length}/500 characters</p>
          </div>

          <div className="mb-8">
            <label className="block text-[#213555] font-semibold mb-3">Choose recognition tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.tag_names.includes(tag.name)
                      ? 'bg-[#213555] text-white'
                      : 'bg-[#D8C4B6] text-[#213555] hover:bg-[#213555] hover:text-white'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#3E5879] mt-2">Tags are managed by administrators</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#213555] text-white py-3 rounded-lg font-semibold hover:bg-[#3E5879] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Shoutout'}
            </button>
            <button
              onClick={handleClear}
              type="button"
              className="px-6 py-3 border-2 border-[#213555] text-[#213555] rounded-lg font-semibold hover:bg-[#F5EFE7] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShoutout;
