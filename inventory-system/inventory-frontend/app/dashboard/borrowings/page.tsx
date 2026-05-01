'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';

export default function BorrowingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [borrowings, setBorrowings] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ item_id: '', borrower_name: '', contact: '', borrow_date: '', expected_return_date: '', quantity_borrowed: 1 });

    useEffect(() => { if (!user) { router.push('/login'); return; } fetchAll(); }, [user]);

    const fetchAll = async () => {
        try {
            const [b, i] = await Promise.all([api.get('/borrowings'), api.get('/items')]);
            setBorrowings(b.data);
            setItems(i.data.filter((item: any) => item.quantity > 0));
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleSubmit = async () => {
        setError('');
        try {
            await api.post('/borrowings', form);
            setShowModal(false);
            setForm({ item_id: '', borrower_name: '', contact: '', borrow_date: '', expected_return_date: '', quantity_borrowed: 1 });
            fetchAll();
        } catch (err: any) { setError(err.response?.data?.message || 'Something went wrong'); }
    };

    const handleReturn = async (id: any) => {
        if (!confirm('Mark this as returned?')) return;
        try { await api.patch(`/borrowings/${id}/return`); fetchAll(); }
        catch { alert('Error processing return'); }
    };

    const today = new Date().toISOString().split('T')[0];

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Items', href: '/dashboard/items', icon: '◈' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '⇄' },
        { label: 'Storage', href: '/dashboard/storage', icon: '▣' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '≡' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; background: #0c0e14; color: #e2e8f0; }
                .ims-root { display: flex; flex-direction: column; min-height: 100vh; }
                .topbar { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 64px; background: rgba(12,14,20,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); }
                .topbar-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #f1f5f9; display: flex; align-items: center; gap: 10px; }
                .brand-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 12px #6366f1; }
                .topbar-right { display: flex; align-items: center; gap: 10px; }
                .back-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; padding: 7px 14px; border-radius: 8px; text-decoration: none; transition: all 0.15s; }
                .back-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.07); }
                .layout { display: flex; flex: 1; }
                .sidebar { width: 216px; flex-shrink: 0; background: rgba(255,255,255,0.015); border-right: 1px solid rgba(255,255,255,0.07); padding: 20px 10px; display: flex; flex-direction: column; gap: 2px; }
                .nav-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; color: #475569; font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all 0.15s; border: 1px solid transparent; }
                .nav-link:hover { background: rgba(255,255,255,0.04); color: #f1f5f9; }
                .nav-link.active { background: rgba(99,102,241,0.1); color: #818cf8; border-color: rgba(99,102,241,0.18); }
                .nav-icon { font-size: 15px; width: 18px; text-align: center; }
                .main { flex: 1; padding: 36px 40px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
                .page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.8px; }
                .page-sub { font-size: 13px; color: #475569; margin-top: 4px; }
                .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; border: none; transition: all 0.15s; }
                .btn-amber { background: #f59e0b; color: #fff; }
                .btn-amber:hover { background: #d97706; }
                .btn-green { background: #10b981; color: #fff; }
                .btn-ghost { background: rgba(255,255,255,0.04); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
                .btn-ghost:hover { background: rgba(255,255,255,0.08); }
                .table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
                table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
                thead { background: rgba(255,255,255,0.02); }
                th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; border-bottom: 1px solid rgba(255,255,255,0.05); }
                td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #94a3b8; vertical-align: middle; }
                tr:last-child td { border-bottom: none; }
                tr:hover td { background: rgba(255,255,255,0.015); }
                .td-primary { color: #f1f5f9; font-weight: 500; }
                .badge { display: inline-flex; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
                .badge-yellow { background: rgba(245,158,11,0.12); color: #fbbf24; }
                .badge-green { background: rgba(16,185,129,0.12); color: #34d399; }
                .btn-link { background: none; border: none; padding: 0; font-size: 12px; font-weight: 600; cursor: pointer; color: #34d399; text-decoration: underline; font-family: 'DM Sans', sans-serif; }
                .td-empty { text-align: center; padding: 52px !important; color: #334155 !important; }
                .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
                .modal { background: #13151d; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
                .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 20px; }
                .form-field { margin-bottom: 14px; }
                .form-label { display: block; font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
                .form-input, .form-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #f1f5f9; outline: none; transition: border-color 0.2s; }
                .form-input:focus, .form-select:focus { border-color: #f59e0b; background: rgba(245,158,11,0.04); }
                .form-select option { background: #13151d; }
                .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
                .modal-actions .btn { flex: 1; justify-content: center; padding: 10px; }
                .error-msg { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); color: #f87171; font-size: 13px; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; }
                .loading { display: flex; align-items: center; gap: 8px; color: #475569; font-size: 14px; padding: 48px; justify-content: center; }
            `}</style>
            <div className="ims-root">
                <nav className="topbar">
                    <div className="topbar-brand"><div className="brand-dot" />Inventory System</div>
                    <div className="topbar-right">
                        <Link href="/dashboard" className="back-btn">← Dashboard</Link>
                    </div>
                </nav>
                <div className="layout">
                    <aside className="sidebar">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={`nav-link${item.href === '/dashboard/borrowings' ? ' active' : ''}`}>
                                <span className="nav-icon">{item.icon}</span>{item.label}
                            </Link>
                        ))}
                    </aside>
                    <main className="main">
                        <div className="page-header">
                            <div>
                                <h2 className="page-title">Borrowings</h2>
                                <p className="page-sub">Track items borrowed and their return status</p>
                            </div>
                            <button className="btn btn-amber" onClick={() => { setShowModal(true); setError(''); }}>+ New Borrowing</button>
                        </div>
                        {loading ? <div className="loading">Loading…</div> : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th><th>Borrower</th><th>Contact</th><th>Qty</th>
                                            <th>Borrow Date</th><th>Expected Return</th><th>Status</th><th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowings.length === 0 ? (
                                            <tr><td colSpan={8} className="td-empty">No borrowings recorded yet</td></tr>
                                        ) : (borrowings as any[]).map((b) => (
                                            <tr key={b.id}>
                                                <td className="td-primary">{b.item?.name || '—'}</td>
                                                <td>{b.borrower_name}</td>
                                                <td>{b.contact}</td>
                                                <td>{b.quantity_borrowed}</td>
                                                <td>{b.borrow_date}</td>
                                                <td>{b.expected_return_date}</td>
                                                <td><span className={`badge ${b.status === 'active' ? 'badge-yellow' : 'badge-green'}`}>{b.status}</span></td>
                                                <td>{b.status === 'active' && <button className="btn-link" onClick={() => handleReturn(b.id)}>Return</button>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-title">New Borrowing</div>
                            {error && <div className="error-msg">{error}</div>}
                            <div className="form-field"><label className="form-label">Item *</label>
                                <select value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })} className="form-select">
                                    <option value="">Select item</option>
                                    {(items as any[]).map((i) => <option key={i.id} value={i.id}>{i.name} (Qty: {i.quantity})</option>)}
                                </select>
                            </div>
                            <div className="form-field"><label className="form-label">Borrower Name *</label><input type="text" value={form.borrower_name} onChange={(e) => setForm({ ...form, borrower_name: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Contact *</label><input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Quantity *</label><input type="number" min={1} value={form.quantity_borrowed} onChange={(e) => setForm({ ...form, quantity_borrowed: parseInt(e.target.value) })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Borrow Date *</label><input type="date" value={form.borrow_date} min={today} onChange={(e) => setForm({ ...form, borrow_date: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Expected Return Date *</label><input type="date" value={form.expected_return_date} min={form.borrow_date || today} onChange={(e) => setForm({ ...form, expected_return_date: e.target.value })} className="form-input" /></div>
                            <div className="modal-actions">
                                <button className="btn btn-amber" onClick={handleSubmit}>Create</button>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
