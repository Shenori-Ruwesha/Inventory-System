'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../lib/axios';
import Link from 'next/link';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ items: 0, borrowings: 0, cupboards: 0, places: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const [items, borrowings, cupboards, places] = await Promise.all([
                api.get('/items'), api.get('/borrowings'), api.get('/cupboards'), api.get('/places'),
            ]);
            setStats({
                items: items.data.length,
                borrowings: borrowings.data.length,
                cupboards: cupboards.data.length,
                places: places.data.length,
            });
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '🏠', active: true },
        { label: 'Items', href: '/dashboard/items', icon: '📦' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '🤝' },
        { label: 'Storage', href: '/dashboard/storage', icon: '🗄️' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '📋' },
    ];

    const statCards = [
        { label: 'Total Items', value: stats.items, accent: '#6366f1', icon: '📦', bg: 'rgba(99,102,241,0.08)' },
        { label: 'Borrowings', value: stats.borrowings, accent: '#f59e0b', icon: '🤝', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Cupboards', value: stats.cupboards, accent: '#10b981', icon: '🗄️', bg: 'rgba(16,185,129,0.08)' },
        { label: 'Places', value: stats.places, accent: '#8b5cf6', icon: '📍', bg: 'rgba(139,92,246,0.08)' },
    ];

    const quickActions = [
        { label: 'Add New Item', href: '/dashboard/items', accent: '#6366f1', icon: '📦' },
        { label: 'Borrow Item', href: '/dashboard/borrowings', accent: '#f59e0b', icon: '🤝' },
        { label: 'Manage Storage', href: '/dashboard/storage', accent: '#10b981', icon: '🗄️' },
        { label: 'View Audit Logs', href: '/dashboard/audit-logs', accent: '#64748b', icon: '📋' },
    ];
    if (user?.role === 'admin') quickActions.push({ label: 'Manage Users', href: '/dashboard/users', accent: '#8b5cf6', icon: '👥' });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; }
                .page-root { display: flex; min-height: 100vh; background: #0d0f1a; }

                /* ── Sidebar ── */
                .sidebar {
                    width: 240px; min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
                    background: linear-gradient(180deg, #0d0f1a 0%, #111827 100%);
                    border-right: 1px solid rgba(255,255,255,0.06);
                    padding: 24px 14px; display: flex; flex-direction: column;
                }
                .sidebar-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; padding: 0 8px; }
                .logo-icon {
                    width: 40px; height: 40px; border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; box-shadow: 0 4px 16px rgba(99,102,241,0.4);
                }
                .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; color: #f1f5f9; }
                .logo-sub { font-size: 11px; color: #475569; }
                .user-chip {
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px; padding: 12px 14px; margin-bottom: 28px;
                    display: flex; align-items: center; gap: 10px;
                }
                .user-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-weight: 800; font-size: 15px;
                }
                .user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
                .user-role {
                    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
                    background: rgba(99,102,241,0.2); color: #a5b4fc;
                    border: 1px solid rgba(99,102,241,0.3); display: inline-block;
                    text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;
                }
                .nav-section { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 8px; }
                .nav-link {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 12px; border-radius: 12px; margin-bottom: 3px;
                    text-decoration: none; transition: all 0.2s; cursor: pointer;
                    border: 1px solid transparent;
                }
                .nav-link:hover { background: rgba(255,255,255,0.05); }
                .nav-link.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.2); }
                .nav-icon {
                    width: 32px; height: 32px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; font-size: 16px;
                }
                .nav-label { font-size: 13px; font-weight: 500; color: #64748b; }
                .nav-link.active .nav-label { color: #e2e8f0; font-weight: 600; }
                .logout-btn {
                    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
                    border-radius: 12px; width: 100%; margin-top: auto;
                    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15);
                    cursor: pointer; transition: all 0.2s;
                }
                .logout-btn:hover { background: rgba(239,68,68,0.15); }

                /* ── Main ── */
                .main-content { margin-left: 240px; flex: 1; padding: 36px 40px; }
                .page-header { margin-bottom: 32px; }
                .page-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #f1f5f9; margin: 0 0 4px; }
                .page-sub { color: #475569; font-size: 14px; margin: 0; }

                /* ── Stat Cards ── */
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
                .stat-card {
                    border-radius: 16px; padding: 24px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                    position: relative; overflow: hidden;
                    transition: transform 0.2s, border-color 0.2s;
                }
                .stat-card:hover { transform: translateY(-2px); }
                .stat-glow { position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; filter: blur(30px); opacity: 0.3; }
                .stat-icon { font-size: 22px; margin-bottom: 16px; }
                .stat-value { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
                .stat-label { font-size: 13px; color: #64748b; font-weight: 500; }

                /* ── Panel ── */
                .panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
                .panel-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #f1f5f9; margin-bottom: 16px; }
                .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .action-card {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px; border-radius: 12px;
                    text-decoration: none; font-size: 14px; font-weight: 500;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                    color: #94a3b8; transition: all 0.2s;
                }
                .action-card:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; transform: translateY(-1px); }
                .action-icon { font-size: 18px; }

                .loading-state { display: flex; align-items: center; justify-content: center; padding: 80px; color: #475569; font-size: 14px; gap: 10px; }
            `}</style>

            <div className="page-root">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-icon">📦</div>
                        <div>
                            <div className="logo-text">Inventory</div>
                            <div className="logo-sub">Management System</div>
                        </div>
                    </div>

                    <div className="user-chip">
                        <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                            <div className="user-name">{user?.name}</div>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </div>

                    <div className="nav-section">Main Menu</div>
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                            <div className="nav-icon" style={{ background: item.active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)' }}>{item.icon}</div>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}

                    {user?.role === 'admin' && (
                        <>
                            <div className="nav-section" style={{ marginTop: '16px' }}>Admin</div>
                            <Link href="/dashboard/users" className="nav-link">
                                <div className="nav-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>👥</div>
                                <span className="nav-label">Users</span>
                            </Link>
                        </>
                    )}

                    <div style={{ flex: 1 }} />
                    <button className="logout-btn" onClick={logout}>
                        <div className="nav-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>🚪</div>
                        <span style={{ color: '#fca5a5', fontSize: '13px', fontWeight: '500' }}>Logout</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="page-header">
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-sub">Welcome back, {user?.name}. Here's what's happening.</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">⏳ Loading stats...</div>
                    ) : (
                        <>
                            {/* Stat Cards */}
                            <div className="stats-grid">
                                {statCards.map(card => (
                                    <div key={card.label} className="stat-card" style={{ borderColor: `${card.accent}22` }}>
                                        <div className="stat-glow" style={{ background: card.accent }} />
                                        <div className="stat-icon">{card.icon}</div>
                                        <div className="stat-value" style={{ color: card.accent }}>{card.value}</div>
                                        <div className="stat-label">{card.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="panel">
                                <div className="panel-title">Quick Actions</div>
                                <div className="actions-grid">
                                    {quickActions.map(btn => (
                                        <Link key={btn.href} href={btn.href} className="action-card">
                                            <span className="action-icon" style={{ color: btn.accent }}>{btn.icon}</span>
                                            {btn.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
