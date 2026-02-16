import React, { useState } from 'react';
import axios from 'axios';
import { Send, Smile } from 'lucide-react';

const CommentSection = ({ shoutoutId, comments = [], onCommentAdded, userId = 1 }) => {
    const [newComment, setNewComment] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const commonEmojis = ['👍', '🎉', '❤️', '🔥', '👏', '🚀', '🤩', '💯', '🙌', '✨', '💪', '🥳'];

    const handleEmojiClick = (emoji) => {
        setNewComment(prev => prev + emoji);
        // Keep picker open for multiple emojis or close? Usually keep open.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8000/comments/?user_id=${userId}`, {
                content: newComment,
                shoutout_id: shoutoutId
            });
            onCommentAdded(response.data);
            setNewComment('');
            setShowEmojiPicker(false);
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brand-light-bg/50 rounded-xl p-4 mt-4 border border-orange-100">
            {/* Existing Comments */}
            <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-yellow to-brand-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {/* Mock user initial */}
                            U{comment.user_id}
                        </div>
                        <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-800">User {comment.user_id}</span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-center text-xs text-gray-400 italic py-2">No comments yet. Be the first!</p>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-sm"
                />

                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1.5 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <Smile size={18} />
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="p-1.5 bg-brand-orange text-white rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-orange/20"
                    >
                        <Send size={16} />
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-64 z-10">
                        <div className="grid grid-cols-6 gap-2">
                            {commonEmojis.map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleEmojiClick(emoji)}
                                    className="hover:bg-gray-100 p-1.5 rounded-lg text-lg transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CommentSection;
