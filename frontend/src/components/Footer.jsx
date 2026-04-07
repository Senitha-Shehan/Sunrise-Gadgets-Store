import { Link } from 'react-router-dom';

const socialLinks = [
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>, 
    href: 'https://web.facebook.com/sunrisegadgets.lk', 
    label: 'Facebook', 
    color: '#1877f2' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>, 
    href: 'https://wa.me/94784488955', 
    label: 'WhatsApp', 
    color: '#25d366' 
  },
];

function Footer() {
  return (
    <footer style={{
      background: 'var(--surface-950)',
      borderTop: '1px solid rgba(249,115,22,0.12)',
      paddingTop: '56px',
      paddingBottom: '28px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Responsive grid via CSS class */}
        <div className="footer-grid">

          {/* Brand Column — spans 2 cols on tablet */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden',
                border: '2px solid rgba(249,115,22,0.4)', boxShadow: '0 0 12px rgba(249,115,22,0.25)', flexShrink: 0,
              }}>
                <img src="/logo.jpg" alt="Sunrise Gadgets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                  Sunrise <span style={{ color: 'var(--brand-400)' }}>Gadgets</span>
                </div>
                <div className="nav-tagline" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Premium Tech Store
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.75, marginBottom: '24px', maxWidth: '260px' }}>
              Your trusted source for premium projectors, smart boards, and audio systems in Sri Lanka.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)', fontSize: '1rem', textDecoration: 'none',
                    transition: 'all 0.2s ease', minHeight: 'auto',
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
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }].map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', padding: '5px 0', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--brand-400)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                  >→ {l.label}</Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, 
                  text: '123 Business Street, City, State 12345' 
                },
                { 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>, 
                  text: '(555) 123-4567' 
                },
                { 
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 
                  text: 'info@sunrisegadgets.com' 
                },
              ].map(c => (
                <div key={c.text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
            {/* Newsletter */}
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Stay updated:</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" placeholder="your@email.com"
                style={{
                  flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  color: 'white', fontSize: '0.85rem', outline: 'none',
                  fontFamily: 'var(--font-sans)', minWidth: 0,
                }}
              />
              <button
                style={{
                  padding: '10px 14px', background: 'var(--gradient-brand)',
                  border: 'none', borderRadius: '8px', color: 'white',
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'opacity 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => e.target.style.opacity = '0.85'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >Subscribe</button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)', marginBottom: '24px' }} />

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', margin: 0 }}>
            © 2024 Sunrise Gadgets Store. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
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