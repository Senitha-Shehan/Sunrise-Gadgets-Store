import { useState } from 'react';

const contactInfo = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, 
    label: 'Showroom', 
    value: '123 Galle Road, Colombo 03, Sri Lanka', 
    sub: 'Open Mon–Sat, 9 AM – 6 PM' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>, 
    label: 'Phone', 
    value: '+94 11 234 5678', 
    sub: 'We reply within 1 business day' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 
    label: 'Email', 
    value: 'info@sunrisegadgets.lk', 
    sub: 'We reply within 1 business day' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>, 
    label: 'WhatsApp', 
    value: '+94 78 448 8955', 
    sub: 'Fast replies, 9 AM – 9 PM' 
  },
];

const faqs = [
  { q: 'Do you offer island-wide delivery?', a: 'Yes! We deliver to all 25 districts of Sri Lanka. Standard delivery takes 2–5 business days.' },
  { q: 'Do products come with a warranty?', a: 'All products are 100% authentic and come with the manufacturer\'s official warranty.' },
  { q: 'Can I visit your showroom to see products?', a: 'Absolutely. Our Colombo showroom is open Monday to Saturday, 9 AM to 6 PM. No appointment needed.' },
  { q: 'Do you offer installation services?', a: 'Yes — our certified AV technicians can handle professional installation across the Western Province.' },
];

function ContactUs() {
  const isMobile = window.innerWidth < 768;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate async send
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1200);
  };

  const inputBase = {
    width: '100%',
    padding: '13px 16px',
    background: 'var(--surface-50)',
    border: '1.5px solid var(--surface-200)',
    borderRadius: '12px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    color: 'var(--surface-900)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  const focusCss = (e) => { e.target.style.borderColor='var(--brand-500)'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)'; e.target.style.background='white'; };
  const blurCss  = (e) => { e.target.style.borderColor='var(--surface-200)'; e.target.style.boxShadow='none'; e.target.style.background='var(--surface-50)'; };

  return (
    <div style={{ background: 'var(--surface-50)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── Hero Banner ─────────────────────────────── */}
      <div style={{ background: 'var(--surface-950)', position: 'relative', overflow: 'hidden', padding: 'clamp(60px, 12vw, 110px) 24px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '999px', color: 'var(--brand-400)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            We'd love to hear from you
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 4rem)', letterSpacing: '-0.04em', color: 'white', margin: '0 0 14px' }}>
            Get in <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
            Have a question or need a quote? Our team is here to help you find the perfect AV solution.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 8vw, 72px) 24px' }}>

        {/* ── Contact Info Cards ───────────────────── */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: isMobile ? '12px' : '16px', 
          marginBottom: 'clamp(48px, 8vw, 72px)' 
        }}>
          {contactInfo.map(c => (
            <div key={c.label} style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: isMobile ? '16px 12px' : '24px 20px', 
              border: '1.5px solid var(--surface-100)', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)', 
              transition: 'all 0.3s ease',
              textAlign: isMobile ? 'center' : 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='rgba(249,115,22,0.2)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--surface-100)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ color: 'var(--brand-500)', marginBottom: isMobile ? '8px' : '12px', display: 'flex' }}>{c.icon}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--brand-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{c.label}</div>
              <div style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 700, 
                fontSize: isMobile ? '0.85rem' : '0.95rem', 
                color: 'var(--surface-900)', 
                marginBottom: '4px',
                wordBreak: 'break-word',
                lineHeight: 1.3
              }}>
                {c.value}
              </div>
              <div style={{ fontSize: isMobile ? '0.7rem' : '0.78rem', color: '#94a3b8' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid: Form + Map ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: 'clamp(48px, 8vw, 80px)' }}>

          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(24px, 5vw, 40px)', border: '1.5px solid var(--surface-100)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--surface-900)', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Send us a message</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 28px' }}>Fill in the form and we'll get back to you within 24 hours.</p>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--surface-900)', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Thank you! We'll be in touch within 1 business day.</p>
                <button onClick={() => setStatus(null)} className="btn-brand" style={{ fontSize: '0.875rem' }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '14px' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Kasun Perera" style={inputBase} onFocus={focusCss} onBlur={blurCss} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 000 0000" style={inputBase} onFocus={focusCss} onBlur={blurCss} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" style={inputBase} onFocus={focusCss} onBlur={blurCss} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: form.subject ? 'var(--surface-900)' : '#94a3b8' }} onFocus={focusCss} onBlur={blurCss}>
                    <option value="">Select a subject...</option>
                    <option>Product Enquiry</option>
                    <option>Price Quote</option>
                    <option>Installation Service</option>
                    <option>Warranty / Support</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Tell us how we can help..." rows={5} style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }} onFocus={focusCss} onBlur={blurCss} />
                </div>
                <button type="submit" disabled={status === 'sending'} className="btn-brand" style={{ padding: '14px', fontSize: '0.95rem', marginTop: '4px', opacity: status === 'sending' ? 0.7 : 1 }}>
                  {status === 'sending' ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map + Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Map Embed */}
            <div style={{ flex: 1, minHeight: '300px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--surface-200)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', display: 'flex' }}>
              <iframe 
                title="Store Location - Siddamulla 6th Lane Piliyandala"
                src="https://maps.google.com/maps?q=Siddamulla,+6th+Lane,+Piliyandala&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, flex: 1 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Business Hours */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1.5px solid var(--surface-100)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-900)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Business Hours
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM', open: true },
                  { day: 'Saturday', hours: '9:00 AM – 3:00 PM', open: true },
                  { day: 'Sunday & Holidays', hours: 'Closed', open: false },
                ].map(row => (
                  <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-50)', borderRadius: '10px', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{row.day}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: row.open ? 'var(--brand-600)' : '#94a3b8' }}>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────── */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="section-rule" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '-0.03em', color: 'var(--surface-900)', margin: 0 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {faqs.map(faq => (
              <div key={faq.q} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1.5px solid var(--surface-100)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>Q</div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--surface-900)', fontSize: '0.9rem', margin: '0 0 8px', lineHeight: 1.4 }}>{faq.q}</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
