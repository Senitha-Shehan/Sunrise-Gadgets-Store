import { useState } from 'react';

const contactInfo = [
  { icon: '📍', label: 'Showroom', value: '123 Galle Road, Colombo 03, Sri Lanka', sub: 'Open Mon–Sat, 9 AM – 6 PM' },
  { icon: '📞', label: 'Phone', value: '+94 11 234 5678', sub: 'We reply within 1 business day' },
  { icon: '✉️', label: 'Email', value: 'info@sunrisegadgets.lk', sub: 'We reply within 1 business day' },
  { icon: '💬', label: 'WhatsApp', value: '+94 77 987 6543', sub: 'Fast replies, 9 AM – 9 PM' },
];

const faqs = [
  { q: 'Do you offer island-wide delivery?', a: 'Yes! We deliver to all 25 districts of Sri Lanka. Standard delivery takes 2–5 business days.' },
  { q: 'Do products come with a warranty?', a: 'All products are 100% authentic and come with the manufacturer\'s official warranty.' },
  { q: 'Can I visit your showroom to see products?', a: 'Absolutely. Our Colombo showroom is open Monday to Saturday, 9 AM to 6 PM. No appointment needed.' },
  { q: 'Do you offer installation services?', a: 'Yes — our certified AV technicians can handle professional installation across the Western Province.' },
];

function ContactUs() {
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
            💬 We'd love to hear from you
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: 'clamp(48px, 8vw, 72px)' }}>
          {contactInfo.map(c => (
            <div key={c.label} style={{ background: 'white', borderRadius: '20px', padding: '24px 20px', border: '1.5px solid var(--surface-100)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='rgba(249,115,22,0.2)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--surface-100)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{c.icon}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--brand-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--surface-900)', marginBottom: '4px' }}>{c.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{c.sub}</div>
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
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--surface-900)', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Thank you! We'll be in touch within 1 business day.</p>
                <button onClick={() => setStatus(null)} className="btn-brand" style={{ fontSize: '0.875rem' }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/></svg>
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
                🕐 Business Hours
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
