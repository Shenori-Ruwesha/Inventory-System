'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';

export default function UsersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        if (user.role !== 'admin') { router.push('/dashboard'); return; }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        try {
            await api.post('/users', form);
            setShowModal(false);
            setForm({ name: '', email: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (id === user.id) {
            alert('You cannot delete yourself');
            return;
        }
        if (!confirm('Delete this user?')) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Items', href: '/dashboard/items', icon: '◈' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '⇄' },
        { label: 'Storage', href: '/dashboard/storage', icon: '▣' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '≡' },
        { label: 'Users', href: '/dashboard/users', icon: '◎' },
    ];

    return (
        <>
            <div className="ims-root">
                <nav className="topbar">
                    <div className="topbar-brand">
                        <div className="brand-dot" />
                        Inventory System
                    </div>
                    <Link href="/dashboard" className="back-btn">
                        ← Dashboard
                    </Link>
                </nav>

                <div className="layout">
                    <aside className="sidebar">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link${item.href === '/dashboard/users' ? ' active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </aside>

                    <main className="main">
                        <div className="page-header">
                            <div>
                                <h2 className="page-title">Users</h2>
                                <p className="page-sub">Manage system access and roles</p>
                            </div>
                            <button
                                className="btn btn-purple"
                                onClick={() => {
                                    setShowModal(true);
                                    setError('');
                                }}
                            >
                                + Add User
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading">Loading…</div>
                        ) : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="td-empty">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((u) => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span className="user-row-avatar">
                                                                {u.name[0].toUpperCase()}
                                                            </span>
                                                            <span className="td-primary">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                u.role === 'admin'
                                                                    ? 'badge-purple'
                                                                    : 'badge-blue'
                                                            }`}
                                                        >
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {u.id !== user.id && (
                                                            <button
                                                                className="btn-link"
                                                                onClick={() => handleDelete(u.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-title">Add New User</div>

                            {error && <div className="error-msg">{error}</div>}

                            <div className="form-field">
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Password *</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Role *</label>
                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({ ...form, role: e.target.value })
                                    }
                                    className="form-select"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-purple" onClick={handleSubmit}>
                                    Create User
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}