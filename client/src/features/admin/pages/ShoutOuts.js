import React, { useEffect, useState } from 'react';
import {
    fetchShoutouts,
    createShoutout,
    updateShoutout,
    deleteShoutout
} from '../services/shoutoutService';

const ShoutOuts = () => {
    const [shoutouts, setShoutouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingShoutout, setEditingShoutout] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        recipient_name: '',
        visibility: 'public'
    });

    useEffect(() => {
        loadShoutouts();
    }, []);

    const loadShoutouts = async () => {
        try {
            setLoading(true);
            const data = await fetchShoutouts();
            setShoutouts(data);
        } catch (err) {
            console.error('Error loading shoutouts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createShoutout(formData);
            setShowCreateModal(false);
            setFormData({ content: '', recipient_name: '', visibility: 'public' });
            loadShoutouts();
        } catch (err) {
            alert(`Error creating shoutout: ${err.message}`);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateShoutout(editingShoutout.id, formData);
            setEditingShoutout(null);
            setFormData({ content: '', recipient_name: '', visibility: 'public' });
            loadShoutouts();
        } catch (err) {
            alert(`Error updating shoutout: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shoutout?')) {
            try {
                await deleteShoutout(id);
                loadShoutouts();
            } catch (err) {
                alert(`Error deleting shoutout: ${err.message}`);
            }
        }
    };

    const startEdit = (shoutout) => {
        setEditingShoutout(shoutout);
        setFormData({
            content: shoutout.content,
            recipient_name: shoutout.recipient_name || '',
            visibility: shoutout.visibility
        });
    };

    const cancelEdit = () => {
        setEditingShoutout(null);
        setFormData({ content: '', recipient_name: '', visibility: 'public' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Action Button Component
    const ActionButton = ({ onClick, children, variant = 'primary' }) => {
        const [isActive, setIsActive] = useState(false);

        const baseStyle = {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.15s',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
        };

        const variants = {
            primary: {
                backgroundColor: isActive ? '#059669' : '#10b981',
                color: 'white'
            },
            secondary: {
                backgroundColor: isActive ? '#f3f4f6' : 'white',
                border: '2px solid #d1d5db',
                color: '#374151'
            },
            danger: {
                backgroundColor: isActive ? '#b91c1c' : '#dc2626',
                color: 'white'
            }
        };

        return (
            <button
                onClick={onClick}
                onTouchStart={() => setIsActive(true)}
                onTouchEnd={() => setIsActive(false)}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                style={{ ...baseStyle, ...variants[variant] }}
            >
                {children}
            </button>
        );
    };

    // Form Modal Component
    const FormModal = ({ isEdit }) => {
        const handleSubmit = isEdit ? handleUpdate : handleCreate;
        const title = isEdit ? 'Edit Shoutout' : 'Create New Shoutout';

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>
                    <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                        {title}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Content *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                                placeholder="Write your shoutout here..."
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Recipient Name
                            </label>
                            <input
                                type="text"
                                value={formData.recipient_name}
                                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                                placeholder="Who are you recognizing?"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Visibility
                            </label>
                            <select
                                value={formData.visibility}
                                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="public">Public</option>
                                <option value="team">Team</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <ActionButton
                                onClick={() => {
                                    isEdit ? cancelEdit() : setShowCreateModal(false);
                                    setFormData({ content: '', recipient_name: '', visibility: 'public' });
                                }}
                                variant="secondary"
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton type="submit" variant="primary">
                                {isEdit ? 'Update' : 'Create'}
                            </ActionButton>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                        Shout Outs
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Create and manage team recognitions
                    </p>
                </div>
                <ActionButton onClick={() => setShowCreateModal(true)} variant="primary">
                    + New Shout Out
                </ActionButton>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}

            {/* Shoutouts Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                    Loading shoutouts...
                </div>
            ) : shoutouts.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '60px',
                    textAlign: 'center',
                    color: '#6b7280'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📣</div>
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>No shoutouts yet</div>
                    <div style={{ fontSize: '14px', marginTop: '4px' }}>
                        Click "New Shout Out" to create your first one
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                }}>
                    {shoutouts.map(shoutout => (
                        <div
                            key={shoutout.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                transition: 'box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {/* Visibility Badge */}
                            <div style={{ marginBottom: '12px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    backgroundColor: shoutout.visibility === 'public' ? '#dbeafe' : shoutout.visibility === 'team' ? '#fef3c7' : '#f3e8ff',
                                    color: shoutout.visibility === 'public' ? '#1e40af' : shoutout.visibility === 'team' ? '#92400e' : '#6b21a8',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {shoutout.visibility}
                                </span>
                            </div>

                            {/* Content */}
                            <p style={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#1f2937',
                                marginBottom: '12px',
                                minHeight: '60px'
                            }}>
                                {shoutout.content}
                            </p>

                            {/* Recipient */}
                            {shoutout.recipient_name && (
                                <div style={{
                                    fontSize: '13px',
                                    color: '#10b981',
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}>
                                    📣 To: {shoutout.recipient_name}
                                </div>
                            )}

                            {/* Meta */}
                            <div style={{
                                fontSize: '12px',
                                color: '#9ca3af',
                                marginBottom: '16px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f3f4f6'
                            }}>
                                Created: {formatDate(shoutout.created_at)}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <ActionButton
                                    onClick={() => startEdit(shoutout)}
                                    variant="secondary"
                                >
                                    ✏️ Edit
                                </ActionButton>
                                <ActionButton
                                    onClick={() => handleDelete(shoutout.id)}
                                    variant="danger"
                                >
                                    🗑️ Delete
                                </ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {(showCreateModal || editingShoutout) && (
                <FormModal isEdit={!!editingShoutout} />
            )}
        </div>
    );
};

export default ShoutOuts;
