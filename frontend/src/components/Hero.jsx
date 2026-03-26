import { useState, useEffect } from 'react';

const defaultHeroSlides = [
  {
    bg: '/hero-bg.jpg',
    tag: '🇱🇰 #1 in Sri Lanka',
    headline: 'Experience Cinema',
    sub: 'at Home',
    desc: 'Ultra-premium 4K projectors, laser systems & smart boards — unbeatable prices delivered island-wide.',
  },
  {
    bg: '/hero-bg-2.jpg',
    tag: '🔥 New Arrivals 2024',
    headline: 'Next-Level',
    sub: 'Smart Tech',
    desc: 'From portable projectors to pro-grade digital cinema — we bring the future to your doorstep.',
  },
  {
    bg: '/hero-bg.jpg',
    tag: '⚡ Exclusive Deals',
    headline: 'Up to 40% Off',
    sub: 'Premium Gear',
    desc: 'Limited-time offers on our curated selection of audio, visual, and projection equipment.',
  },
];

function Hero({ slides, primaryCta, secondaryCta, hideStats }) {
  const activeSlides = slides || defaultHeroSlides;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => goNext(), 6000);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = (idx) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 400);
  };

  const goNext = () => goTo((current + 1) % activeSlides.length);
  const goPrev = () => goTo((current - 1 + activeSlides.length) % activeSlides.length);

  const slide = activeSlides[current];

  return (
    <div style={{
      position: 'relative',
      minHeight: 'clamp(480px, 88vh, 780px)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--surface-950)',
    }}>
      {/* Backgrounds */}
      {activeSlides.map((s, idx) => (
        <div key={idx} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${s.bg}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: idx === current ? 1 : 0,
          transform: idx === current ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 1.2s ease, transform 6s ease',
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.6) 60%, rgba(15,23,42,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(15,23,42,0.9) 0%, transparent 50%)' }} />
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
        animation: 'pulse-brand 4s ease-in-out infinite', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div className="hero-content">
        <div style={{ maxWidth: '680px' }}>
          {/* Tag */}
          <div key={`tag-${current}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.35)', borderRadius: '999px',
            color: 'var(--brand-400)', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.05em', marginBottom: '20px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'all 0.5s ease 0.1s',
          }}>{slide.tag}</div>

          {/* Headline */}
          <h1 key={`h1-${current}`} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
            fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: '6px', color: 'white',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(16px)' : 'translateY(0)',
            transition: 'all 0.5s ease 0.15s',
          }}>{slide.headline}</h1>
          <h1 key={`h1b-${current}`} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
            fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: '20px',
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(16px)' : 'translateY(0)',
            transition: 'all 0.5s ease 0.2s',
          }}>{slide.sub}</h1>

          {/* Description */}
          <p key={`desc-${current}`} style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            lineHeight: 1.7, maxWidth: '520px', marginBottom: '36px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(12px)' : 'translateY(0)',
            transition: 'all 0.5s ease 0.25s',
          }}>{slide.desc}</p>

          {/* CTA */}
          <div className="hero-cta">
            <a href={primaryCta?.link || "/"} className="btn-brand" style={{ fontSize: '1rem', padding: '14px 32px', textDecoration: 'none' }}>
              {primaryCta?.text || "Shop Now"}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href={secondaryCta?.link || "/"} className="btn-ghost" style={{ fontSize: '1rem', textDecoration: 'none' }}>
              {secondaryCta?.text || "View All Products"}
            </a>
          </div>
        </div>

        {/* Stats */}
        {!hideStats && (
          <div className="hero-stats">
            {[
              { value: '500+', label: 'Products' },
              { value: '10k+', label: 'Happy Customers' },
              { value: '5★', label: 'Rated' },
              { value: 'Island-Wide', label: 'Delivery' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrows */}
      <button className="hero-arrow" style={{ left: '16px' }}
        onClick={goPrev} aria-label="Previous slide"
        onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button className="hero-arrow" style={{ right: '16px' }}
        onClick={goNext} aria-label="Next slide"
        onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', gap: '8px', alignItems: 'center',
      }}>
        {activeSlides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)} aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === current ? '28px' : '8px', height: '8px',
              borderRadius: '999px', padding: 0, border: 'none', cursor: 'pointer',
              background: idx === current ? 'var(--brand-500)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.4s ease', minHeight: 'auto',
              boxShadow: idx === current ? '0 0 8px rgba(249,115,22,0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;