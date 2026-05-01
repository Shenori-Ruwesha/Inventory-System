'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; }
                .login-root {
                    min-height: 100vh;
                    background: #0c0e14;
                    display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;
                }
                .bg-orb {
                    position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
                }
                .orb1 { width: 400px; height: 400px; background: rgba(99,102,241,0.15); top: -100px; right: -100px; }
                .orb2 { width: 300px; height: 300px; background: rgba(139,92,246,0.1); bottom: -80px; left: -60px; }
                .login-card {
                    position: relative; z-index: 1;
                    width: 100%; max-width: 420px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    padding: 48px 40px;
                    backdrop-filter: blur(20px);
                }
                .login-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
                .brand-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #fff; font-family: 'Syne', sans-serif; }
                .brand-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #f1f5f9; }
                .login-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.8px; margin-bottom: 6px; }
                .login-sub { font-size: 14px; color: #475569; margin-bottom: 32px; }
                .field { margin-bottom: 18px; }
                .field-label { display: block; font-size: 13px; font-weight: 500; color: #94a3b8; margin-bottom: 8px; }
                .field-input {
                    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; padding: 12px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif;
                    color: #e2e8f0; outline: none; transition: border-color 0.2s, background 0.2s;
                }
                .field-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.06); }
                .field-input::placeholder { color: #334155; }
                .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; font-size: 13px; padding: 12px 16px; border-radius: 10px; margin-bottom: 18px; }
                .submit-btn {
                    width: 100%; padding: 13px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none; border-radius: 10px; color: #fff;
                    font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
                    cursor: pointer; transition: opacity 0.2s, transform 0.1s;
                    margin-top: 8px;
                }
                .submit-btn:hover { opacity: 0.9; }
                .submit-btn:active { transform: scale(0.99); }
                .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
            <div className="login-root">
                <div className="bg-orb orb1" />
                <div className="bg-orb orb2" />
                <div className="login-card">
                    <div className="login-brand">
                        <div className="brand-mark">I</div>
                        <div className="brand-name">Inventory System</div>
                    </div>
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-sub">Sign in to your account to continue</p>
                    {error && <div className="error-box">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="field-label">Email address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="you@company.com" required />
                        </div>
                        <div className="field">
                            <label className="field-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" placeholder="••••••••" required />
                        </div>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
