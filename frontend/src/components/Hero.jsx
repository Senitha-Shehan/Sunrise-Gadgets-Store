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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTinyMobile, setIsTinyMobile] = useState(window.innerWidth < 420);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTinyMobile(window.innerWidth < 420);
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
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => goNext(), 8000);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = (idx) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 600);
  };

  const goNext = () => goTo((current + 1) % activeSlides.length);
  const goPrev = () => goTo((current - 1 + activeSlides.length) % activeSlides.length);

  const slide = activeSlides[current];

  return (
    <div style={{
      position: 'relative',
      minHeight: isTinyMobile ? '320px' : 'clamp(480px, 88vh, 780px)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--surface-950)',
    }}>
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
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        animation: 'pulse-brand 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 1
      }} />

      {/* Content */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px' }}>
          {/* Tag */}
          <div key={`tag-${current}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px',
            color: 'var(--brand-400)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-500)', boxShadow: '0 0 8px var(--brand-500)' }} />
            {slide.tag}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
            <h1 key={`h1-${current}`} style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(2.5rem, 12vw, 3.5rem)' : 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.05em',
              marginBottom: '4px', color: 'white',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s',
            }}>{slide.headline}</h1>
            <h1 key={`h1b-${current}`} style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(2.5rem, 12vw, 3.5rem)' : 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.05em',
              background: 'linear-gradient(to right, #f97316, #fb923c, #f97316)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s',
              animation: 'shimmer 4s linear infinite',
            }}>{slide.sub}</h1>
          </div>

          {/* Description */}
          <p key={`desc-${current}`} style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.6, maxWidth: '540px', marginBottom: '40px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(15px)' : 'translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s',
            fontWeight: 400,
          }}>{slide.desc}</p>

          {/* CTA */}
          <div className="hero-cta" style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s',
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '100%' : 'auto',
          }}>
            <a href={primaryCta?.link || "/"} className="btn-brand" style={{ 
              fontSize: isTinyMobile ? '0.95rem' : '1.1rem', padding: isTinyMobile ? '12px 24px' : '16px 36px', textDecoration: 'none', borderRadius: '14px',
              justifyContent: 'center', width: isMobile ? '100%' : 'auto'
            }}>
              {primaryCta?.text || "Shop Now"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href={secondaryCta?.link || "/"} className="btn-ghost" style={{ 
              fontSize: isTinyMobile ? '0.95rem' : '1.1rem', padding: isTinyMobile ? '12px 24px' : '16px 36px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', borderRadius: '14px',
              justifyContent: 'center', width: isMobile ? '100%' : 'auto'
            }}>
              {secondaryCta?.text || "Explore All"}
            </a>
          </div>
        </div>

        {/* Stats - Minimalist Row */}
        {!hideStats && !isMobile && (
          <div style={{ 
            display: 'flex', gap: '48px', marginTop: '64px',
            opacity: animating ? 0 : 1, transition: 'opacity 1s ease 0.6s'
          }}>
            {[
              { value: '500+', label: 'Premium Products' },
              { value: '10k+', label: 'Active Users' },
              { value: 'Islandwide', label: 'Express Shipping' },
            ].map(stat => (
              <div key={stat.label} style={{ borderLeft: '1px solid rgba(249,115,22,0.3)', paddingLeft: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrow Controls - Hidden on mobile in favor of swipe/dots */}
      {!isMobile && (
        <>
          <button className="hero-arrow" style={{ left: '20px', zIndex: 20 }}
            onClick={goPrev} aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="hero-arrow" style={{ right: '20px', zIndex: 20 }}
            onClick={goNext} aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Dots - Positioned Bottom Center */}
      <div style={{
        position: 'absolute', bottom: isMobile ? '20px' : '32px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', gap: '10px', alignItems: 'center',
        background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '40px', backdropFilter: 'blur(10px)'
      }}>
        {activeSlides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)}
            style={{
              width: idx === current ? '24px' : '8px', height: '8px',
              borderRadius: '999px', padding: 0, border: 'none', cursor: 'pointer',
              background: idx === current ? 'var(--brand-500)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              boxShadow: idx === current ? '0 0 10px rgba(249,115,22,0.4)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;