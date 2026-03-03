import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ReportModal = ({ isOpen, onClose, shoutoutId, userId }) => {
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [reasons, setReasons] = useState([]);
    const { apiUrl } = useAuth();

    useEffect(() => {
        if (isOpen) {
            fetchReasons();
        }
    }, [isOpen]);

    const fetchReasons = async () => {
        try {
            const response = await axios.get(`${apiUrl}/reasons`);
            setReasons(response.data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
            // Fallback options if API fails
            setReasons([
                "Inappropriate Content",
                "Spam or Misleading",
                "Harassment or Bullying",
                "Offensive Language",
                "Other"
            ]);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/reports/?user_id=${userId}`, {
                reason,
                details,
                shoutout_id: shoutoutId
            });
            onClose();
            alert("Report submitted successfully.");
            setReason('');
            setDetails('');
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur and slight darkness, NOT pitch black */}
            <div
                className="absolute inset-0 bg-brand-dark/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-brand-yellow/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-yellow to-brand-orange p-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <AlertTriangle size={20} className="text-white" />
                        Report Shout-Out
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Why are you reporting this?
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a reason</option>
                                {reasons.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Additional Details
                            </label>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all h-24 resize-none"
                                placeholder="Please provide more context..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-dark text-white font-bold hover:shadow-lg hover:shadow-brand-orange/30 transition-all disabled:opacity-70"
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
