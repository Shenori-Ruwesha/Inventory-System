'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';

export default function AuditLogsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchLogs();
    }, [user]);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/audit-logs');
            setLogs(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const actionBadge = (action) => {
        if (!action) return 'badge-gray';
        if (action.includes('created')) return 'badge-green';
        if (action.includes('updated') || action.includes('quantity')) return 'badge-blue';
        if (action.includes('deleted')) return 'badge-red';
        if (action.includes('borrowed')) return 'badge-yellow';
        if (action.includes('returned')) return 'badge-purple';
        return 'badge-gray';
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Items', href: '/dashboard/items', icon: '◈' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '⇄' },
        { label: 'Storage', href: '/dashboard/storage', icon: '▣' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '≡' },
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
                                className={`nav-link${item.href === '/dashboard/audit-logs' ? ' active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </aside>

                    <main className="main">
                        <h2 className="page-title">Audit Logs</h2>
                        <p className="page-sub">Complete history of all system activity</p>

                        {loading ? (
                            <div className="loading">Loading…</div>
                        ) : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>User</th>
                                            <th>Model</th>
                                            <th>Old Values</th>
                                            <th>New Values</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="td-empty">
                                                    No audit logs yet
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr key={log.id}>
                                                    <td>
                                                        <span className={`badge ${actionBadge(log.action)}`}>
                                                            {log.action}
                                                        </span>
                                                    </td>

                                                    <td>{log.user?.name || 'System'}</td>

                                                    <td style={{ color: '#64748b' }}>
                                                        {log.auditable_type?.split('\\').pop()}
                                                        <span style={{ opacity: 0.5 }}>
                                                            {' '}#{log.auditable_id}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {log.old_values ? (
                                                            <pre className="mono">
                                                                {JSON.stringify(log.old_values, null, 1)}
                                                            </pre>
                                                        ) : (
                                                            <span style={{ color: '#334155' }}>—</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {log.new_values ? (
                                                            <pre className="mono">
                                                                {JSON.stringify(log.new_values, null, 1)}
                                                            </pre>
                                                        ) : (
                                                            <span style={{ color: '#334155' }}>—</span>
                                                        )}
                                                    </td>

                                                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                                                        {new Date(log.created_at).toLocaleString()}
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
            </div>
        </>
    );
}