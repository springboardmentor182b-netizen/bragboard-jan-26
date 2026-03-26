import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircle, Flag, Image, Film } from 'lucide-react';
import CommentSection from './CommentSection';
import ReportModal from './Modals/ReportModal';
import { useAuth } from '../context/AuthContext';

const QUICK_REACTIONS = ['👍', '❤️', '🎉', '🔥', '👏'];

const ShoutOutFeed = ({ userId = null }) => {
    const [shoutouts, setShoutouts] = useState([]);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [reportModalData, setReportModalData] = useState({ isOpen: false, shoutoutId: null });
    const [reactionPickerId, setReactionPickerId] = useState(null); // which post's picker is open
    const { user, apiUrl } = useAuth();

    useEffect(() => {
        fetchShoutouts();
    }, [userId, apiUrl]);

    const fetchShoutouts = async () => {
        try {
            let url = `${apiUrl}/shoutouts/`;
            if (userId) url += `?sender_id=${userId}`;
            const response = await axios.get(url);
            setShoutouts(response.data);
        } catch (error) {
            console.error('Error fetching shoutouts:', error);
        }
    };

    const handleReact = async (shoutoutId, emoji) => {
        if (!user) return;
        try {
            const res = await axios.post(
                `${apiUrl}/shoutouts/${shoutoutId}/react?emoji=${encodeURIComponent(emoji)}&user_id=${user.id}`
            );
            setShoutouts(prev => prev.map(s =>
                s.id === shoutoutId ? { ...s, reactions: res.data.reactions } : s
            ));
        } catch (err) {
            console.error('Error reacting:', err);
        } finally {
            setReactionPickerId(null);
        }
    };

    const handleCommentAdded = (shoutoutId, newComment) => {
        setShoutouts(prev => prev.map(s => {
            if (s.id === shoutoutId) {
                return { ...s, comments: [...(s.comments || []), newComment] };
            }
            return s;
        }));
    };

    const toggleComments = (shoutoutId) => {
        setActiveCommentId(activeCommentId === shoutoutId ? null : shoutoutId);
    };

    const getMediaType = (url) => {
        if (!url) return null;
        if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
        return 'image';
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Shout-Out Feed 📣
                </h1>
                <p className="text-gray-500 mt-1">Celebrating our team's achievements</p>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search by sender, recipient, or message..."
                    className="w-full px-5 py-3 rounded-xl border-none shadow-sm outline-none focus:ring-2 focus:ring-brand-orange/20"
                />
            </div>

            <div className="space-y-6">
                {shoutouts.map((shoutout) => {
                    const mediaType = getMediaType(shoutout.media_url);
                    return (
                        <div key={shoutout.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold overflow-hidden border border-gray-100">
                                    {shoutout.sender?.profile_picture ? (
                                        <img src={shoutout.sender.profile_picture} alt={shoutout.sender.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        shoutout.sender?.full_name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-900">{shoutout.sender?.full_name || 'Unknown'}</span>
                                        <span className="text-gray-400">→</span>
                                        <div className="flex items-center gap-2 bg-brand-light-bg px-3 py-0.5 rounded-full border border-orange-100">
                                            <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                                                {shoutout.recipient?.profile_picture ? (
                                                    <img src={shoutout.recipient.profile_picture} alt={shoutout.recipient.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    shoutout.recipient?.full_name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{shoutout.recipient?.full_name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">{new Date(shoutout.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{shoutout.content}</p>

                            {/* Inline Media */}
                            {shoutout.media_url && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                                    {mediaType === 'video' ? (
                                        <div className="relative">
                                            <video
                                                src={shoutout.media_url.startsWith('http') ? shoutout.media_url : `${apiUrl}${shoutout.media_url}`}
                                                controls
                                                className="w-full max-h-80 object-contain bg-black"
                                            />
                                            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Film size={10} /> Video
                                            </span>
                                        </div>
                                    ) : (
                                        <img
                                            src={shoutout.media_url.startsWith('http') ? shoutout.media_url : `${apiUrl}${shoutout.media_url}`}
                                            alt="Shout-out media"
                                            className="w-full max-h-80 object-contain bg-gray-50"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Reactions & Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex gap-2 flex-wrap items-center">
                                    {Object.entries(shoutout.reactions || {}).map(([emoji, count]) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReact(shoutout.id, emoji)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors text-sm font-medium text-gray-700"
                                        >
                                            <span>{emoji}</span>
                                            <span>{count}</span>
                                        </button>
                                    ))}

                                    {/* Add reaction button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setReactionPickerId(reactionPickerId === shoutout.id ? null : shoutout.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-brand-orange transition-colors text-sm font-medium"
                                        >
                                            + React
                                        </button>
                                        {reactionPickerId === shoutout.id && (
                                            <div className="absolute bottom-10 left-0 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 flex gap-1 z-30">
                                                {QUICK_REACTIONS.map(e => (
                                                    <button
                                                        key={e}
                                                        onClick={() => handleReact(shoutout.id, e)}
                                                        className="text-xl w-9 h-9 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center"
                                                    >
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 text-gray-400">
                                    <button
                                        onClick={() => toggleComments(shoutout.id)}
                                        className={`flex items-center gap-1.5 transition-colors text-sm ${activeCommentId === shoutout.id ? 'text-brand-orange' : 'hover:text-gray-600'}`}
                                    >
                                        <MessageCircle size={18} />
                                        {shoutout.comments?.length || 0}
                                    </button>
                                    <button
                                        onClick={() => setReportModalData({ isOpen: true, shoutoutId: shoutout.id })}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <Flag size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Comment Section */}
                            {activeCommentId === shoutout.id && (
                                <CommentSection
                                    shoutoutId={shoutout.id}
                                    comments={shoutout.comments}
                                    onCommentAdded={(newComment) => handleCommentAdded(shoutout.id, newComment)}
                                    userId={user?.id}
                                />
                            )}
                        </div>
                    );
                })}

                {shoutouts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No shout-outs yet. Be the first to recognize someone!
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={reportModalData.isOpen}
                shoutoutId={reportModalData.shoutoutId}
                onClose={() => setReportModalData({ isOpen: false, shoutoutId: null })}
                userId={user?.id}
            />
        </div>
    );
};

export default ShoutOutFeed;
