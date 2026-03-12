import React, { useState, useEffect, useRef } from 'react';
import adminAPI from '../services/adminAPI';
import { Trash2, CheckCircle, AlertTriangle, Eye, Send, X, MessageSquare, ShieldCheck, ShieldX } from 'lucide-react';
import '../layout/admin.css';

const ModerationQueue = () => {
    const [reports, setReports] = useState([]);
    const [shoutouts, setShoutouts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Popup state
    const [selectedShoutout, setSelectedShoutout] = useState(null);
    const [selectedReports, setSelectedReports] = useState([]);

    // Thread state
    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [noteSending, setNoteSending] = useState(false);
    const threadEndRef = useRef(null);

    // Reject dialog
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchModerationData();
    }, []);

    useEffect(() => {
        if (threadEndRef.current) {
            threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [notes]);

    const fetchModerationData = async () => {
        try {
            setLoading(true);
            const [repRes, shoRes, usrRes] = await Promise.all([
                adminAPI.getReports(),
                adminAPI.listShoutouts(200),
                adminAPI.listUsers()
            ]);
            setReports(repRes.data);
            setShoutouts(shoRes.data);
            setUsers(usrRes.data);
        } catch (error) {
            console.error('Error fetching moderation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openShoutoutPopup = async (shoutout, relatedReports) => {
        setSelectedShoutout(shoutout);
        setSelectedReports(relatedReports);
        setShowRejectDialog(false);
        setRejectReason('');
        setNewNote('');

        // Fetch moderation notes for this shoutout
        try {
            setNotesLoading(true);
            const res = await adminAPI.getModerationNotes(shoutout.id);
            setNotes(res.data);
        } catch (error) {
            console.error('Error fetching moderation notes:', error);
            setNotes([]);
        } finally {
            setNotesLoading(false);
        }
    };

    const closePopup = () => {
        setSelectedShoutout(null);
        setSelectedReports([]);
        setNotes([]);
        setNewNote('');
        setShowRejectDialog(false);
        setRejectReason('');
    };

    const handleSendNote = async () => {
        if (!newNote.trim() || !selectedShoutout) return;
        try {
            setNoteSending(true);
            const res = await adminAPI.addModerationNote(selectedShoutout.id, newNote.trim());
            setNotes(prev => [...prev, res.data]);
            setNewNote('');
        } catch (error) {
            console.error('Failed to add note:', error);
            alert('Failed to add note. See console for details.');
        } finally {
            setNoteSending(false);
        }
    };

    const handleAcceptShoutout = async () => {
        if (!selectedShoutout) return;
        if (!window.confirm('Accept this shoutout? All reports will be dismissed.')) return;

        try {
            setActionLoading(`accept-${selectedShoutout.id}`);
            await adminAPI.acceptShoutout(selectedShoutout.id);
            // Remove reports related to this shoutout from the UI
            setReports(prev => prev.filter(r => r.shoutout_id !== selectedShoutout.id));
            closePopup();
        } catch (error) {
            console.error('Failed to accept shoutout:', error);
            alert('Failed to accept shoutout. See console for details.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectShoutout = async () => {
        if (!selectedShoutout || !rejectReason.trim()) return;

        try {
            setActionLoading(`reject-${selectedShoutout.id}`);
            await adminAPI.rejectShoutout(selectedShoutout.id, rejectReason.trim());
            // Remove shoutout and its reports from the UI
            setReports(prev => prev.filter(r => r.shoutout_id !== selectedShoutout.id));
            setShoutouts(prev => prev.filter(s => s.id !== selectedShoutout.id));
            closePopup();
        } catch (error) {
            console.error('Failed to reject shoutout:', error);
            alert('Failed to reject shoutout. See console for details.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendNote();
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading moderation queue...</div>;

    // Group reports by shoutout_id
    const reportsByShoutout = {};
    reports.forEach(report => {
        if (!reportsByShoutout[report.shoutout_id]) {
            reportsByShoutout[report.shoutout_id] = [];
        }
        reportsByShoutout[report.shoutout_id].push(report);
    });

    // Build cards: one per unique shoutout
    const groupedCards = Object.entries(reportsByShoutout).map(([shoutoutId, shoutoutReports]) => {
        const shoutout = shoutouts.find(s => s.id === parseInt(shoutoutId));
        const enrichedReports = shoutoutReports.map(r => {
            const reporter = users.find(u => u.id === r.reported_by);
            return { ...r, reporterName: reporter ? reporter.name : 'Unknown User' };
        });

        return {
            shoutoutId: parseInt(shoutoutId),
            shoutout: shoutout || { message: 'Shoutout not found (may be deleted)', sender_name: 'Unknown' },
            reports: enrichedReports,
            reportCount: enrichedReports.length,
            latestReport: enrichedReports.reduce((a, b) => new Date(a.created_at) > new Date(b.created_at) ? a : b),
        };
    });

    return (
        <div className="moderation-queue-container" style={{ padding: '1rem' }}>
            {groupedCards.length === 0 ? (
                <div className="mod-empty-state">
                    <CheckCircle size={48} color="var(--success-color, #22c55e)" style={{ marginBottom: '1rem' }} />
                    <h3>All caught up!</h3>
                    <p>No pending reports in the moderation queue.</p>
                </div>
            ) : (
                <div className="mod-reports-grid">
                    {groupedCards.map(card => (
                        <div key={card.shoutoutId} className="mod-report-card">
                            <div className="mod-report-card-header">
                                <div>
                                    <div className="mod-report-badge">
                                        <AlertTriangle size={16} />
                                        {card.reportCount} {card.reportCount === 1 ? 'Report' : 'Reports'}
                                    </div>
                                    <div className="mod-report-meta">
                                        Latest: {new Date(card.latestReport.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <button
                                    className="mod-view-btn"
                                    onClick={() => openShoutoutPopup(card.shoutout, card.reports)}
                                >
                                    <Eye size={16} /> View Details
                                </button>
                            </div>

                            <div className="mod-report-content">
                                <div className="mod-report-sender">
                                    From: <strong>{card.shoutout.sender_name}</strong>
                                    {card.shoutout.recipient_names && card.shoutout.recipient_names.length > 0 && (
                                        <span className="mod-report-recipients">
                                            → {card.shoutout.recipient_names.join(', ')}
                                        </span>
                                    )}
                                </div>
                                <div className="mod-report-message">
                                    "{card.shoutout.message?.substring(0, 120)}{card.shoutout.message?.length > 120 ? '...' : ''}"
                                </div>
                            </div>

                            <div className="mod-report-reasons">
                                {card.reports.slice(0, 2).map(r => (
                                    <div key={r.id} className="mod-reason-chip">
                                        <strong>{r.reporterName}:</strong> {r.reason}
                                    </div>
                                ))}
                                {card.reports.length > 2 && (
                                    <div className="mod-reason-more">
                                        +{card.reports.length - 2} more report{card.reports.length - 2 > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Shoutout Detail Popup ─────────────────────────────── */}
            {selectedShoutout && (
                <div className="modal-overlay" onClick={closePopup}>
                    <div className="mod-detail-modal" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="mod-modal-header">
                            <h3><AlertTriangle size={20} /> Reported Shoutout</h3>
                            <button className="mod-close-btn" onClick={closePopup}><X size={20} /></button>
                        </div>

                        {/* Shoutout Content */}
                        <div className="mod-shoutout-detail">
                            <div className="mod-detail-row">
                                <span className="mod-detail-label">From</span>
                                <span>{selectedShoutout.sender_name}</span>
                            </div>
                            {selectedShoutout.recipient_names && selectedShoutout.recipient_names.length > 0 && (
                                <div className="mod-detail-row">
                                    <span className="mod-detail-label">To</span>
                                    <span>{selectedShoutout.recipient_names.join(', ')}</span>
                                </div>
                            )}
                            {selectedShoutout.tags && (
                                <div className="mod-detail-row">
                                    <span className="mod-detail-label">Tags</span>
                                    <span className="mod-tags">{selectedShoutout.tags}</span>
                                </div>
                            )}
                            <div className="mod-detail-row">
                                <span className="mod-detail-label">Date</span>
                                <span>{selectedShoutout.created_at ? new Date(selectedShoutout.created_at).toLocaleString() : 'N/A'}</span>
                            </div>
                            <div className="mod-detail-message">
                                "{selectedShoutout.message}"
                            </div>
                        </div>

                        {/* Reports List */}
                        <div className="mod-reports-section">
                            <h4><AlertTriangle size={16} /> Reports ({selectedReports.length})</h4>
                            {selectedReports.map(r => (
                                <div key={r.id} className="mod-report-item">
                                    <strong>{r.reporterName}</strong>
                                    <span className="mod-report-time">{new Date(r.created_at).toLocaleString()}</span>
                                    <p>{r.reason}</p>
                                </div>
                            ))}
                        </div>

                        {/* Moderation Thread */}
                        <div className="mod-thread-section">
                            <h4><MessageSquare size={16} /> Moderation Thread</h4>
                            <div className="mod-thread-list">
                                {notesLoading ? (
                                    <div className="mod-thread-empty">Loading notes...</div>
                                ) : notes.length === 0 ? (
                                    <div className="mod-thread-empty">No moderation notes yet. Add one below.</div>
                                ) : (
                                    notes.map(note => (
                                        <div key={note.id} className="mod-thread-note">
                                            <div className="mod-note-header">
                                                <strong>{note.admin_name}</strong>
                                                <span className="mod-note-time">{new Date(note.created_at).toLocaleString()}</span>
                                            </div>
                                            <p>{note.message}</p>
                                        </div>
                                    ))
                                )}
                                <div ref={threadEndRef} />
                            </div>

                            <div className="mod-thread-input">
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add a moderation note..."
                                    rows={2}
                                    disabled={noteSending}
                                />
                                <button
                                    onClick={handleSendNote}
                                    disabled={noteSending || !newNote.trim()}
                                    className="mod-send-btn"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!showRejectDialog ? (
                            <div className="mod-actions">
                                <button
                                    className="mod-accept-btn"
                                    onClick={handleAcceptShoutout}
                                    disabled={!!actionLoading}
                                >
                                    <ShieldCheck size={18} /> Accept Shoutout
                                </button>
                                <button
                                    className="mod-reject-btn"
                                    onClick={() => setShowRejectDialog(true)}
                                    disabled={!!actionLoading}
                                >
                                    <ShieldX size={18} /> Reject & Remove
                                </button>
                            </div>
                        ) : (
                            <div className="mod-reject-dialog">
                                <h4><ShieldX size={16} /> Rejection Reason</h4>
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder="Enter why this shoutout is being rejected..."
                                    rows={3}
                                    autoFocus
                                />
                                <div className="mod-reject-actions">
                                    <button
                                        className="btn-cancel"
                                        onClick={() => { setShowRejectDialog(false); setRejectReason(''); }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="mod-confirm-reject-btn"
                                        onClick={handleRejectShoutout}
                                        disabled={!rejectReason.trim() || !!actionLoading}
                                    >
                                        <Trash2 size={16} /> Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModerationQueue;
