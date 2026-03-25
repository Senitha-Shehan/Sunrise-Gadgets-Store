import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-950)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-200px', left: '-200px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(30,41,59,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderRadius: '28px',
        padding: '48px 40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'fadeInUp 0.5s ease',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2.5px solid rgba(249,115,22,0.5)',
            boxShadow: '0 0 24px rgba(249,115,22,0.25)',
            margin: '0 auto 20px',
          }}>
            <img src="/logo.jpg" alt="Sunrise Gadgets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.7rem',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
          }}>
            Admin Access
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: error ? '1.5px solid rgba(239,68,68,0.5)' : '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(249,115,22,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                  e.target.style.background = 'rgba(255,255,255,0.09)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: '4px',
                  display: 'flex',
                  minHeight: 'auto',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '0.875rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand"
            style={{ width: '100%', padding: '15px', fontSize: '1rem', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem',
              fontFamily: 'var(--font-sans)', transition: 'color 0.2s',
              minHeight: 'auto', padding: '4px 8px',
            }}
            onMouseEnter={e => e.target.style.color='var(--brand-400)'}
            onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.35)'}
          >
            ← Back to store
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;