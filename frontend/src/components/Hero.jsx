import { useState, useEffect } from 'react';

const defaultHeroSlides = [
  {
    bg: '/hero-bg.jpg',
    tag: '🇱🇰 #1 in Sri Lanka',
    headline: 'Experience Cinema at Home',
    desc: 'Ultra-premium 4K projectors, laser systems & smart boards — unbeatable prices delivered island-wide.',
  },
  {
    bg: '/hero-bg-2.jpg',
    tag: '🔥 New Arrivals 2026',
    headline: 'Next-Level Smart Tech',
    desc: 'From portable projectors to pro-grade digital cinema — we bring the future to your doorstep.',
  },
  {
    bg: '/hero-bg.jpg',
    tag: '⚡ Exclusive Deals',
    headline: 'Up to 40% Off Premium Gear',
    desc: 'Limited-time offers on our curated selection of audio, visual, and projection equipment.',
  },
];

function Hero({ slides, hideStats }) {
  const activeSlides = slides || defaultHeroSlides;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTinyMobile, setIsTinyMobile] = useState(window.innerWidth < 420);
  const [isMobilePhone, setIsMobilePhone] = useState(window.innerWidth >= 420 && window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLandscape, setIsLandscape] = useState(window.innerHeight < window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsTinyMobile(w < 420);
      setIsMobilePhone(w >= 420 && w < 768);
      setIsTablet(w >= 768 && w < 1024);
      setIsMobile(w < 768);
      setIsLandscape(h < w);
    };
    const handleMouseMove = (e) => {
      if (isMobile) return; // Disable parallax on mobile to save battery/reduce jitter
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (animating) return;
    const interval = setInterval(() => goNext(), 8000);
    return () => clearInterval(interval);
  }, [current, animating]);

  const goTo = (idx) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 600);
  };

  const goNext = () => goTo((current + 1) % activeSlides.length);
  const goPrev = () => goTo((current - 1 + activeSlides.length) % activeSlides.length);

  const slide = activeSlides[current];

  return (
    <div
      onMouseEnter={() => setAnimating(true)}
      onMouseLeave={() => setAnimating(false)}
      style={{
        position: 'relative',
        minHeight: isTinyMobile ? (isLandscape ? '240px' : '320px') : (isMobilePhone ? '360px' : (isTablet ? 'clamp(440px, 65vh, 520px)' : 'clamp(500px, 80vh, 700px)')),
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--surface-950)',
      }}
    >
      {/* Backgrounds with Parallax */}
      {activeSlides.map((s, idx) => (
        <div key={idx} className="hero-reveal" style={{
          position: 'absolute', inset: '-20px',
          backgroundImage: `url('${s.bg}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: idx === current ? 1 : 0,
          transform: `scale(${idx === current ? 1.05 : 1.1}) translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: idx === current ? 'opacity 1.5s ease-out, transform 0.1s linear' : 'opacity 1.5s ease-out',
          zIndex: 0,
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.7) 50%, rgba(2,6,23,0.4) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(2,6,23,1) 0%, transparent 40%)', zIndex: 1 }} />

      {/* Decorative Brand Glow */}
      {!isTinyMobile && (
      <div style={{
        position: 'absolute', top: '10%', right: isMobile ? '-10%' : '5%',
        width: isMobile ? '400px' : '600px', height: isMobile ? '400px' : '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        animation: 'pulse-brand 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 1
      }} />
      )}

      {/* Content */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10, padding: isTinyMobile ? '0 14px' : (isMobilePhone ? '0 18px' : (isTablet ? '0 40px' : '0')) }}>  
        <div style={{ maxWidth: isMobile ? '520px' : '800px' }}>
          {/* Tag */}
          <div key={`tag-${current}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: isTinyMobile ? '5px 10px' : '6px 14px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px',
            color: 'var(--brand-400)', fontSize: isTinyMobile ? '0.6rem' : 'clamp(0.65rem, 2vw, 0.85rem)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: isTinyMobile ? '10px' : (isMobilePhone ? '12px' : '20px'),
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-500)', boxShadow: '0 0 8px var(--brand-500)' }} />
            {slide.tag}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: isTinyMobile ? '6px' : (isMobilePhone ? '10px' : '20px') }}>
            <h1 key={`h1-${current}`} style={{
              fontFamily: 'var(--font-display)',
              fontSize: isTinyMobile ? 'clamp(1.45rem, 8vw, 2rem)' : (isMobilePhone ? 'clamp(1.7rem, 7vw, 2.35rem)' : (isMobile ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.5rem, 6vw, 5rem)')),
              fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em',
              marginBottom: isTinyMobile ? '4px' : '8px', color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(10px)' : 'translateY(0)',
              transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}>{slide.headline}</h1>
            <h1 key={`h1b-${current}`} style={{
              fontFamily: 'var(--font-display)',
              fontSize: isTinyMobile ? 'clamp(1.45rem, 8vw, 2rem)' : (isMobilePhone ? 'clamp(1.7rem, 7vw, 2.35rem)' : (isMobile ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.5rem, 6vw, 5rem)')),
              fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em',
              background: 'linear-gradient(to right, #0891b2, #0e7490, #0891b2)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s',
              animation: 'shimmer 4s linear infinite',
            }}>{slide.sub}</h1>
          </div>

          {/* Description */}
          <p key={`desc-${current}`} style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: isTinyMobile ? '0.8rem' : 'clamp(0.875rem, 2.5vw, 1.15rem)',
            lineHeight: 1.45, maxWidth: '540px', marginBottom: isTinyMobile ? '12px' : (isMobilePhone ? '16px' : (isTablet ? '28px' : '32px')),
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(15px)' : 'translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s',
            fontWeight: 400,
          }}>{slide.desc}</p>

          {/* Scroll Indicator */}
          {!isMobile && (
          <div style={{
            marginTop: isTinyMobile ? '24px' : (isMobilePhone ? '28px' : '48px'),
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: animating ? 0 : 1,
            transition: 'opacity 0.8s ease 0.5s',
          }}>
            <div style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, var(--brand-500), transparent)',
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>Scroll to explore</span>
          </div>
          )}
        </div>

        {/* Stats - Minimalist Row */}
        {!hideStats && !isMobile && (
          <div style={{
            display: 'flex', gap: isTablet ? '32px' : '48px', marginTop: isTablet ? '40px' : '64px',
            opacity: animating ? 0 : 1, transition: 'opacity 1s ease 0.6s'
          }}>
            {[
              { value: '500+', label: 'Premium Products' },
              { value: '10k+', label: 'Active Users' },
              { value: 'Islandwide', label: 'Express Shipping' },
            ].map(stat => (
              <div key={stat.label} style={{ borderLeft: '1px solid rgba(6,182,212,0.3)', paddingLeft: isTablet ? '12px' : '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: isTablet ? '1.25rem' : '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: isTablet ? '0.6rem' : '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Dots - Responsive */}
      <div style={{ 
        position: 'absolute', 
        bottom: isTinyMobile ? '10px' : (isMobilePhone ? '12px' : (isTablet ? '20px' : '40px')), 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex', 
        gap: '8px', 
        zIndex: 20,
        justifyContent: 'center'
      }}>
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === current ? 'var(--brand-400)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              opacity: animating ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (idx !== current) e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={e => { if (idx !== current) e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
          />
        ))}
      </div>

      {/* Arrow Controls - Desktop Only */}
      {!isMobile && (
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', gap: '12px', zIndex: 20 }}>
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer', transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer', transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}


    </div>
  );
}

export default Hero;
