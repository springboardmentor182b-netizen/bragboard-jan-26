import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API_URL = '/api';

const CreateShoutoutModal = ({ isOpen, onClose, onPost, currentUser }) => {
    const [message, setMessage] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch users when modal opens
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            fetch(`${API_URL}/users/`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(data => {
                    // Filter out yourself so you don't shoutout yourself (optional)
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

    const handleSubmit = () => {
        if (!selectedRecipient) return alert("Please select a colleague!");
        if (!message.trim()) return alert("Please write a message!");

        onPost({
            message,
            recipient_ids: [parseInt(selectedRecipient)],
            tags: selectedTags
        });

        // Reset form
        onClose();
        setMessage('');
        setSelectedTags([]);
        setSelectedRecipient('');
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

                {/* TAGS */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Tags</label>
                    <div className="flex gap-2 flex-wrap">
                        {availableTags.map(tag => (
                            <button key={tag} onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full text-sm border transition-all ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                                {tag}
                            </button>
                        ))}
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