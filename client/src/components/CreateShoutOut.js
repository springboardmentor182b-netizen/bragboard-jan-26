import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';

const CreateShoutOut = () => {
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { user, apiUrl } = useAuth();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/`);
                // Filter out current user from potential recipients
                const otherUsers = response.data.filter(u => u.id !== user?.id);
                setUsers(otherUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        if (user) {
            fetchUsers();
        }
    }, [user, apiUrl]);

    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        // Optional: close picker after selection or keep open
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        if (!recipient) {
            alert("Please select a recipient.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${apiUrl}/shoutouts/?sender_id=${user.id}`, {
                content: message,
                recipient_id: parseInt(recipient),
                tags: []
            });
            setMessage('');
            setRecipient('');
            alert('Shout-out posted successfully!');
        } catch (error) {
            console.error('Error posting shout-out:', error);
            alert('Failed to post shout-out.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-3xl text-white">💬</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Create a Shout-Out 🎉</h2>
                <p className="text-gray-600 mt-2">Recognize someone for their great work!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Who do you want to recognize?
                        </label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all pl-10 appearance-none bg-white"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a team member</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.full_name} ({u.email})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                👤
                            </div>
                            <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                                ▼
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your appreciation message
                        </label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all h-32 resize-none"
                            placeholder="Write your message of appreciation here... Share what made their work stand out!"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Add some celebration
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-orange text-brand-orange hover:bg-orange-50 transition-colors"
                        >
                            <Smile size={20} />
                            {showEmojiPicker ? 'Close Picker' : 'Add Emoji'}
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute top-12 left-0 z-50 shadow-xl rounded-xl border border-gray-100">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={350}
                                    height={400}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-brand-yellow text-white py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-brand-yellow/30"
                        >
                            {loading ? 'Posting...' : 'Post Shout-Out'}
                        </button>
                        <button
                            type="button"
                            className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateShoutOut;
