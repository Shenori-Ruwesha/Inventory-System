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

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const [items, borrowings, cupboards, places] = await Promise.all([
                api.get('/items'), api.get('/borrowings'), api.get('/cupboards'), api.get('/places'),
            ]);
            setStats({ items: items.data.length, borrowings: borrowings.data.length, cupboards: cupboards.data.length, places: places.data.length });
        } catch (err) { console.error(err); }
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Items', href: '/dashboard/items', icon: '◈' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '⇄' },
        { label: 'Storage', href: '/dashboard/storage', icon: '▣' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '≡' },
    ];
    if (user?.role === 'admin') navItems.push({ label: 'Users', href: '/dashboard/users', icon: '◎' });

    const statCards = [
        { label: 'Total Items', value: stats.items, accent: '#6366f1', icon: '◈', bg: 'rgba(99,102,241,0.08)' },
        { label: 'Borrowings', value: stats.borrowings, accent: '#f59e0b', icon: '⇄', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Cupboards', value: stats.cupboards, accent: '#10b981', icon: '▣', bg: 'rgba(16,185,129,0.08)' },
        { label: 'Places', value: stats.places, accent: '#8b5cf6', icon: '◎', bg: 'rgba(139,92,246,0.08)' },
    ];

    const quickActions = [
        { label: 'Add New Item', href: '/dashboard/items', accent: '#6366f1', icon: '+ ◈' },
        { label: 'Borrow Item', href: '/dashboard/borrowings', accent: '#f59e0b', icon: '⇄' },
        { label: 'Manage Storage', href: '/dashboard/storage', accent: '#10b981', icon: '▣' },
        { label: 'View Audit Logs', href: '/dashboard/audit-logs', accent: '#64748b', icon: '≡' },
    ];
    if (user?.role === 'admin') quickActions.push({ label: 'Manage Users', href: '/dashboard/users', accent: '#8b5cf6', icon: '◎' });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; background: #0c0e14; color: #e2e8f0; }
                .ims-root { display: flex; flex-direction: column; min-height: 100vh; background: #0c0e14; }
                .topbar {
                    position: sticky; top: 0; z-index: 100;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 32px; height: 64px;
                    background: rgba(12,14,20,0.85);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .topbar-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; }
                .brand-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 12px #6366f1; }
                .topbar-right { display: flex; align-items: center; gap: 16px; }
                .user-chip { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; padding: 6px 14px 6px 8px; }
                .user-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
                .user-name { font-size: 13px; color: #94a3b8; }
                .user-role { font-size: 11px; color: #6366f1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .logout-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171; font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500; padding: 7px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .logout-btn:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.4); }
                .layout { display: flex; flex: 1; }
                .sidebar {
                    width: 220px; flex-shrink: 0;
                    background: rgba(255,255,255,0.02);
                    border-right: 1px solid rgba(255,255,255,0.05);
                    padding: 24px 12px;
                    display: flex; flex-direction: column; gap: 4px;
                }
                .nav-link {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 14px; border-radius: 10px;
                    color: #64748b; font-size: 14px; font-weight: 500;
                    text-decoration: none; transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .nav-link:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; border-color: rgba(255,255,255,0.06); }
                .nav-link.active { background: rgba(99,102,241,0.12); color: #818cf8; border-color: rgba(99,102,241,0.2); }
                .nav-icon { font-size: 16px; width: 20px; text-align: center; }
                .main { flex: 1; padding: 36px 40px; }
                .page-header { margin-bottom: 36px; }
                .page-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.8px; }
                .page-sub { font-size: 14px; color: #475569; margin-top: 4px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
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
                .section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.3px; margin-bottom: 16px; }
                .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .action-card {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px; border-radius: 12px;
                    text-decoration: none; font-size: 14px; font-weight: 500;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                    color: #94a3b8;
                    transition: all 0.2s;
                }
                .action-card:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; transform: translateY(-1px); }
                .action-icon { font-size: 18px; }
                .card-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
            `}</style>
            <div className="ims-root">
                <nav className="topbar">
                    <div className="topbar-brand">
                        <div className="brand-dot" />
                        Inventory System
                    </div>
                    <div className="topbar-right">
                        <div className="user-chip">
                            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                            <div>
                                <div className="user-name">{user?.name}</div>
                                <div className="user-role">{user?.role}</div>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={logout}>Logout</button>
                    </div>
                </nav>
                <div className="layout">
                    <aside className="sidebar">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={`nav-link${item.href === '/dashboard' ? ' active' : ''}`}>
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </aside>
                    <main className="main">
                        <div className="page-header">
                            <h2 className="page-title">Dashboard</h2>
                            <p className="page-sub">Welcome back, {user?.name}. Here's what's happening.</p>
                        </div>
                        <div className="stats-grid">
                            {statCards.map((card) => (
                                <div key={card.label} className="stat-card" style={{ borderColor: `${card.accent}20` }}>
                                    <div className="stat-glow" style={{ background: card.accent }} />
                                    <div className="stat-icon" style={{ color: card.accent }}>{card.icon}</div>
                                    <div className="stat-value" style={{ color: card.accent }}>{card.value}</div>
                                    <div className="stat-label">{card.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="card-panel">
                            <div className="section-title">Quick Actions</div>
                            <div className="actions-grid">
                                {quickActions.map((btn) => (
                                    <a key={btn.href} href={btn.href} className="action-card" style={{ '--hover-accent': btn.accent } as any}>
                                        <span className="action-icon" style={{ color: btn.accent }}>{btn.icon}</span>
                                        {btn.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
