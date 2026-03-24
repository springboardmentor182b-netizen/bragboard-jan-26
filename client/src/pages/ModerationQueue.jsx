import React, { useState, useEffect } from 'react';
import adminAPI from '../services/adminAPI';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import '../layout/admin.css';

const ModerationQueue = () => {
    const [reports, setReports] = useState([]);
    const [shoutouts, setShoutouts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchModerationData();
    }, []);

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

    const handleDismissReport = async (reportId) => {
        if (!window.confirm("Are you sure you want to dismiss this report? The shoutout will remain visible.")) return;

        try {
            setActionLoading(reportId);
            await adminAPI.deleteReport(reportId);
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (error) {
            console.error("Failed to dismiss report", error);
            alert("Failed to dismiss report. See console for details.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteShoutout = async (shoutoutId) => {
        if (!window.confirm("Are you sure you want to delete this shoutout? This action cannot be undone.")) return;

        try {
            setActionLoading(`shoutout-${shoutoutId}`);
            await adminAPI.deleteShoutout(shoutoutId);
            // Removing the shoutout cascade-deletes its reports on the backend.
            // We should remove any reports linked to this shoutout from the UI.
            setReports(prev => prev.filter(r => r.shoutout_id !== shoutoutId));
            setShoutouts(prev => prev.filter(s => s.id !== shoutoutId));
        } catch (error) {
            console.error("Failed to delete shoutout", error);
            alert("Failed to delete shoutout. See console for details.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading moderation queue...</div>;

    // Enhance reports with related details
    const enhancedReports = reports.map(report => {
        const shoutout = shoutouts.find(s => s.id === report.shoutout_id);
        const reporter = users.find(u => u.id === report.reported_by);

        return {
            ...report,
            shoutoutDetails: shoutout || { message: "Shoutout not found (may be deleted)", sender_name: "Unknown" },
            reporterName: reporter ? reporter.name : "Unknown User"
        };
    });

    return (
        <div className="moderation-queue-container" style={{ padding: '1rem' }}>
            {enhancedReports.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <CheckCircle size={48} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>All caught up!</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No pending reports in the moderation queue.</p>
                </div>
            ) : (
                <div className="reports-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                    {enhancedReports.map(report => (
                        <div key={report.id} style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-color)', fontWeight: 600, marginBottom: '4px' }}>
                                        <AlertTriangle size={18} />
                                        Reported by {report.reporterName}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(report.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleDismissReport(report.id)}
                                        disabled={actionLoading === report.id || actionLoading === `shoutout-${report.shoutout_id}`}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            color: 'var(--text-main)'
                                        }}
                                    >
                                        Dismiss Report
                                    </button>
                                    <button
                                        onClick={() => handleDeleteShoutout(report.shoutout_id)}
                                        disabled={actionLoading === report.id || actionLoading === `shoutout-${report.shoutout_id}`}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: 'var(--danger-color)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete Shoutout
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: 'var(--bg-main)',
                                padding: '12px',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--danger-color)'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Reason:</strong>
                                {report.reason}
                            </div>

                            <div style={{
                                padding: '16px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    Reported Content:
                                </strong>
                                {report.shoutoutDetails.message === "Shoutout not found (may be deleted)" ? (
                                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        {report.shoutoutDetails.message}
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                            From: {report.shoutoutDetails.sender_name}
                                        </div>
                                        {report.shoutoutDetails.recipient_names && report.shoutoutDetails.recipient_names.length > 0 && (
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                                                To: {report.shoutoutDetails.recipient_names.join(', ')}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
                                            "{report.shoutoutDetails.message}"
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModerationQueue;
