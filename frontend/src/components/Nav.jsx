import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navLinks = [
  { to: '/', label: 'Products' },
  { to: '#', label: 'About' },
  { to: '#', label: 'Contact' },
];

const mobileLinks = [
  { to: '/', label: '🏠 Products' },
  { to: '/add', label: '➕ Add Product' },
  { to: '#', label: 'ℹ️ About' },
  { to: '#', label: '📞 Contact' },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(15,23,42,0.92)'
            : 'rgba(15,23,42,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(249,115,22,0.2)'
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

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
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(249,115,22,0.5)',
                boxShadow: '0 0 12px rgba(249,115,22,0.3)',
                flexShrink: 0,
              }}>
                <img
                  src="/logo.jpg"
                  alt="Sunrise Gadgets"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'white',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}>
                  Sunrise <span style={{ color: 'var(--brand-400)' }}>Gadgets</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Premium Tech Store
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div style={{ display: 'none', gap: '4px' }} className="nav-desktop">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '8px 18px',
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    borderRadius: '999px',
                    transition: 'all 0.2s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => {
                    e.target.style.color = 'white';
                    e.target.style.background = 'rgba(249,115,22,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.color = 'rgba(255,255,255,0.75)';
                    e.target.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>



            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="nav-hamburger"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Mobile Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          width: '300px',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-900)',
          borderRight: '1px solid rgba(249,115,22,0.2)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(249,115,22,0.4)' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1rem' }}>
              Sunrise <span style={{ color: 'var(--brand-400)' }}>Gadgets</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {mobileLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '14px 16px',
                marginBottom: '4px',
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
                fontSize: '0.95rem',
                textDecoration: 'none',
                borderRadius: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background='rgba(249,115,22,0.12)'; e.target.style.color='white'; }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='rgba(255,255,255,0.75)'; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
            <div>📞 (555) 123-4567</div>
            <div>✉️ info@sunrisegadgets.com</div>
            <div>📍 123 Business Street, City</div>
          </div>

        </div>
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default Nav;