import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import {
    Users,
    Search,
    UserPlus,
    Pencil,
    Trash2,
    X,
    User as UserIcon,
    Shield,
} from 'lucide-react';

/* ── helpers ── */
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toISOString().split('T')[0];
}

const AVATAR_COLORS = 8; // matches .color-0 … .color-7

/* ── modals ── */
function AddUserModal({ onClose, onSaved }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.post('/auth/register', form);
            onSaved();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add user');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add New User</h3>
                {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', margin: '0 0 1rem' }}>{error}</p>}
                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                    </div>
                    <div className="input-group">
                        <label>Department</label>
                        <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering" />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Adding…' : 'Add User'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditUserModal({ user, onClose, onSaved }) {
    const [form, setForm] = useState({ name: user.name, department: user.department || '', role: user.role });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.put(`/users/${user.id}`, form);
            onSaved();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit User</h3>
                {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', margin: '0 0 1rem' }}>{error}</p>}
                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Department</label>
                        <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option value="user">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteConfirmModal({ user, onClose, onConfirm }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await onConfirm();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Delete User</h3>
                <p className="confirm-text">
                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                </p>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-danger" disabled={deleting} onClick={handleDelete}>
                        {deleting ? 'Deleting…' : 'Delete User'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── main page ── */
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to load users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.department && u.department.toLowerCase().includes(q))
        );
    }, [users, search]);

    const handleDelete = async () => {
        try {
            await api.delete(`/users/${deleteUser.id}`);
            setDeleteUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Delete failed', err);
            setDeleteUser(null);
        }
    };

    const handleSaved = () => {
        setShowAdd(false);
        setEditUser(null);
        fetchUsers();
    };

    return (
        <>
            {/* Page header */}
            <div className="page-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage your team members and their access</p>
                </div>
                <button className="btn-add" onClick={() => setShowAdd(true)}>
                    <UserPlus size={16} />
                    Add User
                </button>
            </div>

            {/* Table card */}
            <div className="users-card">
                <div className="users-card-header">
                    <div className="card-title">
                        <Users size={16} />
                        All Users ({filtered.length})
                    </div>
                    <div className="search-box">
                        <Search size={14} className="search-icon" />
                        <input
                            placeholder="Search users…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <p>Loading users…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <Users size={32} />
                        <p>{search ? 'No users match your search' : 'No users found'}</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, idx) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className={`user-avatar color-${idx % AVATAR_COLORS}`}>
                                                {getInitials(u.name)}
                                            </div>
                                            {u.name}
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>{u.department || '—'}</td>
                                    <td>
                                        <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'employee'}`}>
                                            {u.role === 'admin' ? (
                                                <><Shield size={12} /> admin</>
                                            ) : (
                                                <><UserIcon size={12} /> employee</>
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="status-badge">active</span>
                                    </td>
                                    <td>{fmtDate(u.joined_at)}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button
                                                className="action-btn"
                                                title="Edit user"
                                                onClick={() => setEditUser(u)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                title="Delete user"
                                                onClick={() => setDeleteUser(u)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onSaved={handleSaved} />}
            {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleSaved} />}
            {deleteUser && <DeleteConfirmModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} />}
        </>
    );
};

export default UserManagement;
