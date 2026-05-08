import { Link } from 'react-router-dom';

const socialLinks = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
    href: 'https://web.facebook.com/sunrisegadgets.lk',
    label: 'Facebook',
    color: '#1877f2'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
    href: 'https://wa.me/94702005088',
    label: 'WhatsApp',
    color: '#25d366'
  },
];

function Footer() {
  return (
    <footer style={{
      background: 'var(--surface-950)',
      borderTop: '1px solid rgba(25, 110, 86, 0.2)',
      paddingTop: '64px',
      paddingBottom: '32px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', overflow: 'hidden',
                border: '2px solid var(--brand-700)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', flexShrink: 0,
              }}>
                <img src="/logo.jpg" alt="Sunrise Gadgets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'white', letterSpacing: '-0.02em' }}>
                  Sunrise Gadgets Store
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Expect More, Pay Less
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '28px', maxWidth: '280px' }}>
              Leading provider of high-end gadgets, professional audio systems, and smart office solutions in Sri Lanka.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--brand-700)';
                    e.currentTarget.style.borderColor = 'var(--brand-700)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }].map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s', display: 'inline-block' }}
                    onMouseEnter={e => { e.target.style.color = 'var(--brand-700)'; e.target.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.5)'; e.target.style.transform = 'none'; }}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>, text: 'No53/A, 6th Ln, Piliyandala 10304' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>, text: '+94 77 848 8955' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, text: 'sunrisegadgetsstore.lk@gmail.com' },
              ].map(c => (
                <div key={c.text} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--brand-700)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>

           
          </div>
        </div>


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', margin: 0 }}>
            © 2026 Sunrise Gadgets Store. Expect More, Pay Less.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Warranty'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
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
