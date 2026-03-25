import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socialLinks = [
  { icon: <FaFacebook />, href: '#', label: 'Facebook', color: '#1877f2' },
  { icon: <FaTwitter />, href: '#', label: 'Twitter', color: '#1da1f2' },
  { icon: <FaInstagram />, href: '#', label: 'Instagram', color: '#e1306c' },
  { icon: <FaLinkedin />, href: '#', label: 'LinkedIn', color: '#0a66c2' },
  { icon: <FaYoutube />, href: '#', label: 'YouTube', color: '#ff0000' },
];

function Footer() {
  return (
    <footer style={{
      background: 'var(--surface-950)',
      borderTop: '1px solid rgba(249,115,22,0.12)',
      paddingTop: '64px',
      paddingBottom: '32px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '56px',
        }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(249,115,22,0.4)',
                boxShadow: '0 0 12px rgba(249,115,22,0.25)',
                flexShrink: 0,
              }}>
                <img src="/logo.jpg" alt="Sunrise Gadgets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                  Sunrise <span style={{ color: 'var(--brand-400)' }}>Gadgets</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Tech Store</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '28px', maxWidth: '240px' }}>
              Your trusted source for premium projectors, smart boards, and audio systems in Sri Lanka.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    minHeight: 'auto',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = s.color + '22';
                    e.currentTarget.style.borderColor = s.color + '55';
                    e.currentTarget.style.color = s.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '#', label: 'About Us' },
                { to: '#', label: 'Contact' },
                { to: '/admin', label: 'Admin' },
              ].map(l => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'block',
                      padding: '6px 0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--brand-400)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['4K Projectors', 'Laser Projectors', 'Smart Boards', 'Audio Systems', 'Accessories', 'Projector Screens'].map(cat => (
                <li key={cat}>
                  <a
                    href="#"
                    style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.875rem', display: 'block', padding: '6px 0', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--brand-400)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >
                    → {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '📍', text: '123 Business Street, City, State 12345' },
                { icon: '📞', text: '(555) 123-4567' },
                { icon: '✉️', text: 'info@sunrisegadgets.com' },
              ].map(c => (
                <div key={c.text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
            {/* Newsletter */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>Stay updated:</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    minWidth: 0,
                  }}
                />
                <button
                  style={{
                    padding: '10px 16px',
                    background: 'var(--gradient-brand)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.opacity='0.85'}
                  onMouseLeave={e => e.target.style.opacity='1'}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)', marginBottom: '28px' }} />

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', margin: 0 }}>
            © 2024 Sunrise Gadgets Store. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--brand-400)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;