import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const mobileLinks = [
  { to: '/', label: 'Products', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to: '/about', label: 'About', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  { to: '/contact', label: 'Contact', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg> },
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
    if (!menuOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

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
        <div className="nav-shell" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
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
                <span className="nav-brand-title">
                  Sunrise <span style={{ color: 'var(--brand-400)' }}>Gadgets</span>
                </span>
                <span className="nav-brand-subtitle">
                  Premium Tech Store
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div style={{ display: 'none', gap: '4px' }} className="nav-desktop">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    if (link.label === 'Products' && location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{
                    padding: '8px 18px',
                    color: location.pathname === link.to ? 'white' : 'rgba(255,255,255,0.75)',
                    background: location.pathname === link.to ? 'rgba(249,115,22,0.12)' : 'transparent',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    borderRadius: '999px',
                    transition: 'all 0.2s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => {
                    if (location.pathname !== link.to) {
                      e.target.style.color = 'white';
                      e.target.style.background = 'rgba(249,115,22,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (location.pathname !== link.to) {
                      e.target.style.color = 'rgba(255,255,255,0.75)';
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>



            {/* Cart Icon + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                aria-label="Shopping cart"
                style={{
                  position: 'relative', background: cartCount > 0 ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.08)',
                  border: cartCount > 0 ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px', padding: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cartCount > 0 ? 'var(--brand-400)' : 'white', transition: 'all 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: 'var(--brand-500)', color: 'white',
                    borderRadius: '999px', minWidth: '18px', height: '18px',
                    fontSize: '0.65rem', fontWeight: 700, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                    animation: 'fadeIn 0.2s ease', border: '2px solid rgba(15,23,42,0.9)',
                  }}>{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="nav-hamburger"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.2s',
                  minWidth: '44px',
                  minHeight: '44px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>{/* end cart+hamburger */}
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
        className="nav-drawer"
        id="mobile-menu"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          width: 'min(300px, 85vw)',
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                color: location.pathname === link.to ? 'white' : 'rgba(255,255,255,0.75)',
                background: location.pathname === link.to ? 'rgba(249,115,22,0.12)' : 'transparent',
                fontWeight: 500,
                fontSize: '0.95rem',
                textDecoration: 'none',
                borderRadius: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (location.pathname !== link.to) {
                  e.target.style.background = 'rgba(249,115,22,0.08)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== link.to) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.75)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--brand-500)', display: 'flex' }}>{link.icon}</span>
                {link.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--brand-500)', display: 'flex' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg></span>
              (555) 123-4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--brand-500)', display: 'flex' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
              info@sunrisegadgets.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--brand-500)', display: 'flex' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
              123 Business Street, City
            </div>
          </div>

        </div>
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }

        .nav-brand-title {
          display: block;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .nav-brand-subtitle {
          display: block;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 420px) {
          .nav-brand-title {
            font-size: 0.95rem;
          }

          .nav-brand-subtitle {
            font-size: 0.55rem;
          }
        }

        .nav-drawer nav a {
          min-height: 48px;
        }

        .nav-shell {
          padding: 0 20px;
        }

        @media (max-width: 520px) {
          .nav-shell {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  );
}

export default Nav;