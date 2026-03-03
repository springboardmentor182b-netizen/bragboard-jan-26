import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CreateShoutoutModal = ({ isOpen, onClose, onPost, currentUser }) => {
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]); // ← CHANGED: Now array
  const [selectedTags, setSelectedTags] = useState([]);
  const [users, setUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); // ← NEW: For filtering users
  const [showDropdown, setShowDropdown] = useState(false); // ← NEW: Toggle dropdown

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
        fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                // Filter out yourself so you don't shoutout yourself
                if (currentUser) {
                    setUsers(data.filter(u => u.id !== currentUser.id));
                } else {
                    setUsers(data);
                }
            })
            .catch(err => console.error("Failed to load colleagues", err));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // ↓↓↓ NEW: Add recipient to selection ↓↓↓
  const addRecipient = (user) => {
    if (!selectedRecipients.find(r => r.id === user.id)) {
      setSelectedRecipients([...selectedRecipients, user]);
      setSearchTerm(''); // Clear search
      setShowDropdown(false); // Close dropdown
    }
  };

  // ↓↓↓ NEW: Remove recipient from selection ↓↓↓
  const removeRecipient = (userId) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== userId));
  };

  // ↓↓↓ NEW: Filter users based on search ↓↓↓
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => 
    !selectedRecipients.find(r => r.id === user.id) // Exclude already selected
  );

  const handleSubmit = () => {
    // ↓↓↓ UPDATED: Check for at least one recipient ↓↓↓
    if (selectedRecipients.length === 0) {
      return alert("Please select at least one colleague!");
    }
    if (!message.trim()) {
      return alert("Please write a message!");
    }

    // ↓↓↓ UPDATED: Send array of recipient IDs ↓↓↓
    onPost({ 
        message, 
        recipient_ids: selectedRecipients.map(r => r.id), // Extract IDs
        tags: selectedTags 
    });
    
    // Reset form
    onClose();
    setMessage(''); 
    setSelectedTags([]); 
    setSelectedRecipients([]); // ← UPDATED: Clear array
    setSearchTerm('');
  };

  const availableTags = ['Teamwork', 'Innovation', 'Leadership', 'Bug Hunter', 'Problem Solving'];

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
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Give a Shout-out 🎉
        </h2>
        
        {/* ↓↓↓ NEW: MULTI-SELECT RECIPIENT COMPONENT ↓↓↓ */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Who are you recognizing?
          </label>
          
          {/* Selected Recipients Display */}
          {selectedRecipients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedRecipients.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => removeRecipient(user.id)}
                    className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search colleagues..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Dropdown Results */}
            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => addRecipient(user)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.department}</div>
                    </div>
                    <UserPlus 
                      size={18} 
                      className="text-gray-400 group-hover:text-indigo-600" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showDropdown && searchTerm && filteredUsers.length === 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                No colleagues found
              </div>
            )}
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-2">
            {selectedRecipients.length === 0 
              ? "Select one or more teammates to recognize" 
              : `${selectedRecipients.length} teammate${selectedRecipients.length > 1 ? 's' : ''} selected`
            }
          </p>
        </div>
        {/* ↑↑↑ END OF MULTI-SELECT COMPONENT ↑↑↑ */}

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

        {/* TAGS */}
        <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Tags (optional)</label>
            <div className="flex gap-2 flex-wrap">
                {availableTags.map(tag => (
                    <button 
                        key={tag} 
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${
                          selectedTags.includes(tag) 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        <button 
          onClick={handleSubmit} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedRecipients.length === 0 || !message.trim()}
        >
          Post Shoutout 🎉
        </button>
      </div>
    </div>
  );
};

export default CreateShoutoutModal;