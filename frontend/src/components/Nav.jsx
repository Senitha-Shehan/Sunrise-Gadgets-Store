import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const mobileLinks = [
  { to: '/', label: 'Products', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
  { to: '/about', label: 'About', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> },
  { to: '/contact', label: 'Contact', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg> },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(10, 17, 40, 0.98)' : 'rgba(10, 17, 40, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.28)' : 'none',
        }}
      >
        <div className="nav-shell" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: '20px' }}>

            {/* Logo + Brand */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}>
                <img
                  src="/logo.jpg"
                  alt="Sunrise Gadgets"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="nav-brand-title">
                  Sunrise Gadgets Store
                </span>
                <span className="nav-brand-subtitle">
                  Expect More Pay Less
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Search gadgets, accessories..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-2.5 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Desktop Links */}
            <div style={{ display: 'none', gap: '4px' }} className="nav-desktop">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    padding: '8px 18px',
                    color: 'white',
                    opacity: location.pathname === link.to ? 1 : 0.8,
                    background: location.pathname === link.to ? 'rgba(255,255,255,0.1)' : 'transparent',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (location.pathname !== link.to) { e.target.style.opacity = '1'; e.target.style.background = 'rgba(255,255,255,0.08)'; } }}
                  onMouseLeave={e => { if (location.pathname !== link.to) { e.target.style.opacity = '0.8'; e.target.style.background = 'transparent'; } }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate('/cart')}
                style={{
                  position: 'relative', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '10px', cursor: 'pointer',
                  color: 'white', display: 'flex', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: 'var(--brand-600)', color: 'white',
                    borderRadius: '999px', minWidth: '18px', height: '18px',
                    fontSize: '0.65rem', fontWeight: 800, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                    border: '2px solid var(--surface-950)',
                  }}>{cartCount}</span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                className="nav-hamburger"
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'white',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.3s ease',
        }}
      />

      {/* Mobile Drawer */}
      <aside
        style={{
          position: 'fixed', top: 0, left: 0, height: '100dvh', width: '300px',
          zIndex: 60, display: 'flex', flexDirection: 'column',
          background: 'var(--surface-950)', borderRight: '1px solid rgba(255,255,255,0.1)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>Sunrise Gadgets <span style={{ color: 'var(--brand-400)' }}>Store</span></span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <nav style={{ padding: '20px' }}>
          {mobileLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                color: 'white', textDecoration: 'none', borderRadius: '12px',
                marginBottom: '6px', background: location.pathname === link.to ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: 500,
              }}
            >
              <span style={{ color: 'var(--brand-700)' }}>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <style>{`
        @media (min-width: 768px) { .nav-desktop { display: flex !important; } .nav-hamburger { display: none !important; } }
        .nav-brand-title { display: block; font-family: var(--font-display); font-weight: 800; font-size: 1.1rem; color: white; letter-spacing: -0.03em; line-height: 1.1; }
        .nav-brand-subtitle { display: block; font-size: 0.65rem; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; text-transform: uppercase; }
        @media (max-width: 480px) {
          .nav-brand-title { font-size: 0.9rem; }
          .nav-brand-subtitle { font-size: 0.55rem; }
        }
        .hidden { display: none; }
        @media (min-width: 640px) { .sm\\:block { display: block; } }
      `}</style>
    </>
  );
}

export default Nav;
