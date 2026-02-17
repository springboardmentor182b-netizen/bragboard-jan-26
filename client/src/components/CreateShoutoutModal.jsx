import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CreateShoutoutModal = ({ isOpen, onClose, onPost, currentUser }) => {
  const [message, setMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // 1. STATE FOR DATA
  const [users, setUsers] = useState([]); 
  const [availableTags, setAvailableTags] = useState([]); // <--- NEW STATE FOR TAGS

  // 2. FETCH DATA (Users AND Tags)
  useEffect(() => {
    if (isOpen) {
        // Fetch Users
        fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                if (currentUser) {
                    setUsers(data.filter(u => u.id !== currentUser.id));
                } else {
                    setUsers(data);
                }
            })
            .catch(err => console.error("Failed to load users", err));

        // Fetch Tags from Backend <--- NEW FETCH
        fetch(`${API_URL}/shoutouts/tags`)
            .then(res => res.json())
            .then(data => setAvailableTags(data))
            .catch(err => console.error("Failed to load tags", err));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedRecipient) return alert("Please select a colleague!");
    if (!message.trim()) return alert("Please write a message!");

    onPost({ 
        message, 
        recipient_ids: [parseInt(selectedRecipient)], 
        tags: selectedTags 
    });
    
    onClose();
    setMessage(''); 
    setSelectedTags([]); 
    setSelectedRecipient('');
  };

  const toggleTag = (tag) => {
      if (selectedTags.includes(tag)) {
          setSelectedTags(prev => prev.filter(t => t !== tag));
      } else {
          setSelectedTags(prev => [...prev, tag]);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Give a Shout-out</h2>
        
        {/* RECIPIENT DROPDOWN */}
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Who are you recognizing?</label>
            <select 
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
            >
                <option value="">Select a colleague...</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
            </select>
        </div>

        {/* MESSAGE BOX */}
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
            <textarea 
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                rows="4" 
                placeholder="What did they do?"
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
            />
        </div>

        {/* TAGS SECTION */}
        <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Tags</label>
            <div className="flex gap-2 flex-wrap">
                {/* 3. MAP OVER DYNAMIC TAGS */}
                {availableTags.length > 0 ? (
                    availableTags.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm border transition-all ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                            {tag}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">Loading tags...</p>
                )}
            </div>
        </div>

        <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors">
            Post Shoutout
        </button>
      </div>
    </div>
  );
};
export default CreateShoutoutModal;