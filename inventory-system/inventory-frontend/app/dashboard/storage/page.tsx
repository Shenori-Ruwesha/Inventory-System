'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';

export default function StoragePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [cupboards, setCupboards] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCupboardModal, setShowCupboardModal] = useState(false);
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [editCupboard, setEditCupboard] = useState<any>(null);
    const [editPlace, setEditPlace] = useState<any>(null);
    const [cupboardForm, setCupboardForm] = useState({ name: '', location: '', description: '' });
    const [placeForm, setPlaceForm] = useState({ name: '', cupboard_id: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => { if (!user) { router.push('/login'); return; } fetchAll(); }, [user]);

    const fetchAll = async () => {
        try {
            const [c, p] = await Promise.all([api.get('/cupboards'), api.get('/places')]);
            setCupboards(c.data); setPlaces(p.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const openCreateCupboard = () => { setEditCupboard(null); setCupboardForm({ name: '', location: '', description: '' }); setError(''); setShowCupboardModal(true); };
    const openEditCupboard = (c: any) => { setEditCupboard(c); setCupboardForm({ name: c.name, location: c.location || '', description: c.description || '' }); setError(''); setShowCupboardModal(true); };
    const handleCupboardSubmit = async () => {
        setError('');
        try {
            if (editCupboard) { await api.put(`/cupboards/${editCupboard.id}`, cupboardForm); }
            else { await api.post('/cupboards', cupboardForm); }
            setShowCupboardModal(false); fetchAll();
        } catch (err: any) { setError(err.response?.data?.message || 'Error'); }
    };
    const handleDeleteCupboard = async (id: any) => {
        if (!confirm('Delete this cupboard?')) return;
        try { await api.delete(`/cupboards/${id}`); fetchAll(); }
        catch { alert('Cannot delete cupboard with places'); }
    };

    const openCreatePlace = () => { setEditPlace(null); setPlaceForm({ name: '', cupboard_id: '', description: '' }); setError(''); setShowPlaceModal(true); };
    const openEditPlace = (p: any) => { setEditPlace(p); setPlaceForm({ name: p.name, cupboard_id: p.cupboard_id, description: p.description || '' }); setError(''); setShowPlaceModal(true); };
    const handlePlaceSubmit = async () => {
        setError('');
        try {
            if (editPlace) { await api.put(`/places/${editPlace.id}`, placeForm); }
            else { await api.post('/places', placeForm); }
            setShowPlaceModal(false); fetchAll();
        } catch (err: any) { setError(err.response?.data?.message || 'Error'); }
    };
    const handleDeletePlace = async (id: any) => {
        if (!confirm('Delete this place?')) return;
        try { await api.delete(`/places/${id}`); fetchAll(); }
        catch { alert('Cannot delete place with items'); }
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Items', href: '/dashboard/items', icon: '◈' },
        { label: 'Borrowings', href: '/dashboard/borrowings', icon: '⇄' },
        { label: 'Storage', href: '/dashboard/storage', icon: '▣' },
        { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: '≡' },
    ];

    const sharedStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0c0e14; color: #e2e8f0; }
        .ims-root { display: flex; flex-direction: column; min-height: 100vh; }
        .topbar { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 64px; background: rgba(12,14,20,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .topbar-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #f1f5f9; display: flex; align-items: center; gap: 10px; }
        .brand-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 12px #6366f1; }
        .back-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; padding: 7px 14px; border-radius: 8px; text-decoration: none; transition: all 0.15s; }
        .back-btn:hover { color: #f1f5f9; }
        .layout { display: flex; flex: 1; }
        .sidebar { width: 216px; flex-shrink: 0; background: rgba(255,255,255,0.015); border-right: 1px solid rgba(255,255,255,0.07); padding: 20px 10px; display: flex; flex-direction: column; gap: 2px; }
        .nav-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; color: #475569; font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all 0.15s; border: 1px solid transparent; }
        .nav-link:hover { background: rgba(255,255,255,0.04); color: #f1f5f9; }
        .nav-link.active { background: rgba(99,102,241,0.1); color: #818cf8; border-color: rgba(99,102,241,0.18); }
        .nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .main { flex: 1; padding: 36px 40px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.8px; margin-bottom: 4px; }
        .page-sub { font-size: 13px; color: #475569; margin-bottom: 32px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #f1f5f9; }
        .btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-blue { background: #6366f1; color: #fff; }
        .btn-blue:hover { background: #4f52d9; }
        .btn-green { background: #10b981; color: #fff; }
        .btn-green:hover { background: #059669; }
        .btn-ghost { background: rgba(255,255,255,0.04); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); }
        .table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead { background: rgba(255,255,255,0.02); }
        th { text-align: left; padding: 11px 14px; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; border-bottom: 1px solid rgba(255,255,255,0.05); }
        td { padding: 11px 14px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #94a3b8; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.015); }
        .td-primary { color: #f1f5f9; font-weight: 500; }
        .td-actions { display: flex; gap: 8px; }
        .btn-link { background: none; border: none; padding: 0; font-size: 11.5px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: underline; }
        .btn-link-blue { color: #818cf8; }
        .btn-link-red { color: #f87171; }
        .td-empty { text-align: center; padding: 40px !important; color: #334155 !important; }
        .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #13151d; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; width: 100%; max-width: 420px; box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 18px; }
        .form-field { margin-bottom: 12px; }
        .form-label { display: block; font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .form-input, .form-select, .form-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 13px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #f1f5f9; outline: none; transition: border-color 0.2s; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #6366f1; }
        .form-select option { background: #13151d; }
        .modal-actions { display: flex; gap: 10px; margin-top: 18px; }
        .modal-actions .btn { flex: 1; justify-content: center; padding: 10px; font-size: 13px; }
        .error-msg { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); color: #f87171; font-size: 13px; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; }
        .loading { display: flex; align-items: center; justify-content: center; color: #475569; font-size: 14px; padding: 48px; }
    `;

    return (
        <>
            <style>{sharedStyles}</style>
            <div className="ims-root">
                <nav className="topbar">
                    <div className="topbar-brand"><div className="brand-dot" />Inventory System</div>
                    <Link href="/dashboard" className="back-btn">← Dashboard</Link>
                </nav>
                <div className="layout">
                    <aside className="sidebar">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={`nav-link${item.href === '/dashboard/storage' ? ' active' : ''}`}>
                                <span className="nav-icon">{item.icon}</span>{item.label}
                            </Link>
                        ))}
                    </aside>
                    <main className="main">
                        <h2 className="page-title">Storage Management</h2>
                        <p className="page-sub">Organize cupboards and storage places</p>
                        {loading ? <div className="loading">Loading…</div> : (
                            <div className="grid-2">
                                <div>
                                    <div className="section-head">
                                        <div className="section-title">Cupboards</div>
                                        <button className="btn btn-blue" onClick={openCreateCupboard}>+ Add</button>
                                    </div>
                                    <div className="table-wrap">
                                        <table>
                                            <thead><tr><th>Name</th><th>Location</th><th>Actions</th></tr></thead>
                                            <tbody>
                                                {(cupboards as any[]).length === 0 ? (
                                                    <tr><td colSpan={3} className="td-empty">No cupboards yet</td></tr>
                                                ) : (cupboards as any[]).map((c) => (
                                                    <tr key={c.id}>
                                                        <td className="td-primary">{c.name}</td>
                                                        <td>{c.location || '—'}</td>
                                                        <td><div className="td-actions">
                                                            <button className="btn-link btn-link-blue" onClick={() => openEditCupboard(c)}>Edit</button>
                                                            <button className="btn-link btn-link-red" onClick={() => handleDeleteCupboard(c.id)}>Delete</button>
                                                        </div></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <div className="section-head">
                                        <div className="section-title">Places</div>
                                        <button className="btn btn-green" onClick={openCreatePlace}>+ Add</button>
                                    </div>
                                    <div className="table-wrap">
                                        <table>
                                            <thead><tr><th>Name</th><th>Cupboard</th><th>Actions</th></tr></thead>
                                            <tbody>
                                                {(places as any[]).length === 0 ? (
                                                    <tr><td colSpan={3} className="td-empty">No places yet</td></tr>
                                                ) : (places as any[]).map((p) => (
                                                    <tr key={p.id}>
                                                        <td className="td-primary">{p.name}</td>
                                                        <td>{p.cupboard?.name || '—'}</td>
                                                        <td><div className="td-actions">
                                                            <button className="btn-link btn-link-blue" onClick={() => openEditPlace(p)}>Edit</button>
                                                            <button className="btn-link btn-link-red" onClick={() => handleDeletePlace(p.id)}>Delete</button>
                                                        </div></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {showCupboardModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-title">{editCupboard ? 'Edit Cupboard' : 'Add Cupboard'}</div>
                            {error && <div className="error-msg">{error}</div>}
                            <div className="form-field"><label className="form-label">Name *</label><input type="text" value={cupboardForm.name} onChange={(e) => setCupboardForm({ ...cupboardForm, name: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Location</label><input type="text" value={cupboardForm.location} onChange={(e) => setCupboardForm({ ...cupboardForm, location: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Description</label><textarea value={cupboardForm.description} onChange={(e) => setCupboardForm({ ...cupboardForm, description: e.target.value })} className="form-textarea" rows={2} /></div>
                            <div className="modal-actions">
                                <button className="btn btn-blue" onClick={handleCupboardSubmit}>{editCupboard ? 'Update' : 'Create'}</button>
                                <button className="btn btn-ghost" onClick={() => setShowCupboardModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showPlaceModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-title">{editPlace ? 'Edit Place' : 'Add Place'}</div>
                            {error && <div className="error-msg">{error}</div>}
                            <div className="form-field"><label className="form-label">Name *</label><input type="text" value={placeForm.name} onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })} className="form-input" /></div>
                            <div className="form-field"><label className="form-label">Cupboard *</label>
                                <select value={placeForm.cupboard_id} onChange={(e) => setPlaceForm({ ...placeForm, cupboard_id: e.target.value })} className="form-select">
                                    <option value="">Select cupboard</option>
                                    {(cupboards as any[]).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-field"><label className="form-label">Description</label><textarea value={placeForm.description} onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })} className="form-textarea" rows={2} /></div>
                            <div className="modal-actions">
                                <button className="btn btn-green" onClick={handlePlaceSubmit}>{editPlace ? 'Update' : 'Create'}</button>
                                <button className="btn btn-ghost" onClick={() => setShowPlaceModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
