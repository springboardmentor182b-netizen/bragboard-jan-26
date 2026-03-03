import { useState } from 'react';

export default function ShoutoutCard({ shoutout, onUpdate }) {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isReacting, setIsReacting] = useState(false);

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    const react = async (type) => {
        if (isReacting) return;
        setIsReacting(true);
        try {
            const response = await fetch(`http://localhost:8000/shoutouts/${shoutout.id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            if (response.ok) {
                onUpdate();
            }
        } catch (err) {
            console.error('Error reacting:', err);
        } finally {
            setIsReacting(false);
        }
    };

    const postComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await fetch(`http://localhost:8000/shoutouts/${shoutout.id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newComment })
            });
            if (response.ok) {
                setNewComment('');
                onUpdate();
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    const reactions = shoutout.reactions || [];
    const thumbsUpCount = reactions.filter(r => r.type === 'thumbs_up').length;
    const heartCount = reactions.filter(r => r.type === 'heart').length;
    const starCount = reactions.filter(r => r.type === 'star').length;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shoutout.sender.email}`}
                        alt={shoutout.sender.email}
                        className="w-14 h-14 rounded-full border-2 border-orange-100 p-0.5"
                    />
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 leading-none">{shoutout.sender.email.split('@')[0]}</h4>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Product Designer</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 font-bold">{getTimeAgo(shoutout.created_at)}</p>
            </div>

            <p className="text-gray-700 italic leading-relaxed mb-8 text-lg font-medium">
                "{shoutout.message}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <button
                            onClick={() => react('thumbs_up')}
                            className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border-2 border-white hover:z-10 transition-transform hover:scale-110 active:scale-95"
                        >
                            <span className="text-xs flex items-center gap-1 font-black">👍 {thumbsUpCount > 0 && thumbsUpCount}</span>
                        </button>
                        <button
                            onClick={() => react('heart')}
                            className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border-2 border-white hover:z-10 transition-transform hover:scale-110 active:scale-95"
                        >
                            <span className="text-xs flex items-center gap-1 font-black">❤️ {heartCount > 0 && heartCount}</span>
                        </button>
                        <button
                            onClick={() => react('star')}
                            className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border-2 border-white hover:z-10 transition-transform hover:scale-110 active:scale-95"
                        >
                            <span className="text-xs flex items-center gap-1 font-black">⭐ {starCount > 0 && starCount}</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{shoutout.comments?.length || 0} comments</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">To</span>
                        <span className="text-sm font-black text-gray-900 capitalize">{shoutout.receiver.email.split('@')[0]}</span>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="mt-6 pt-6 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {shoutout.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-4 group">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.email}`}
                                className="w-10 h-10 rounded-full border border-gray-100 p-0.5"
                            />
                            <div className="flex-1 bg-gray-50 p-4 rounded-3xl relative">
                                <h5 className="font-bold text-gray-900 text-sm mb-1">{comment.user.email.split('@')[0]}</h5>
                                <p className="text-gray-600 text-sm leading-relaxed">{comment.message}</p>
                                <span className="absolute top-4 right-4 text-[10px] font-bold text-gray-300">
                                    {getTimeAgo(comment.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}

                    <form onSubmit={postComment} className="flex gap-4 mt-6">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0" />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-slate-50 border-none rounded-full px-6 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                className={`absolute right-1 top-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all ${newComment.trim() ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
