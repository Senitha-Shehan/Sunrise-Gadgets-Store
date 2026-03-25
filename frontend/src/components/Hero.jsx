import { useState, useEffect } from 'react';

const heroSlides = [
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

function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = (idx) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  const goNext = () => goTo((current + 1) % heroSlides.length);
  const goPrev = () => goTo((current - 1 + heroSlides.length) % heroSlides.length);

  const slide = heroSlides[current];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'clamp(520px, 90vh, 780px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--surface-950)',
      }}
    >
      {/* Background Images */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${s.bg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === current ? 1 : 0,
            transform: idx === current ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 1.2s ease, transform 6s ease',
          }}
        />
      ))}

      {/* Multi-layer gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.6) 60%, rgba(15,23,42,0.3) 100%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(0deg, rgba(15,23,42,0.9) 0%, transparent 50%)',
      }} />

      {/* Animated brand accent orb */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
        animation: 'pulse-brand 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 32px',
      }}>
        <div style={{ maxWidth: '680px' }}>
          {/* Tag */}
          <div
            key={`tag-${current}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(249,115,22,0.15)',
              border: '1px solid rgba(249,115,22,0.35)',
              borderRadius: '999px',
              color: 'var(--brand-400)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginBottom: '24px',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
              transition: 'all 0.5s ease 0.1s',
            }}
          >
            {slide.tag}
          </div>

          {/* Headline */}
          <h1
            key={`h1-${current}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '8px',
              color: 'white',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(16px)' : 'translateY(0)',
              transition: 'all 0.5s ease 0.15s',
            }}
          >
            {slide.headline}
          </h1>
          <h1
            key={`h1b-${current}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '24px',
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(16px)' : 'translateY(0)',
              transition: 'all 0.5s ease 0.2s',
            }}
          >
            {slide.sub}
          </h1>

          {/* Description */}
          <p
            key={`desc-${current}`}
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '40px',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'all 0.5s ease 0.25s',
            }}
          >
            {slide.desc}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#products"
              className="btn-brand"
              style={{ fontSize: '1rem', padding: '14px 32px' }}
            >
              Shop Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#products" className="btn-ghost" style={{ fontSize: '1rem' }}>
              View All Products
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '40px',
          marginTop: '64px',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Products' },
            { value: '10k+', label: 'Happy Customers' },
            { value: '5★', label: 'Rated' },
            { value: 'Island-Wide', label: 'Delivery' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.03em',
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Slide Dots */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: idx === current ? 'var(--brand-500)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              padding: 0,
              minHeight: 'auto',
              boxShadow: idx === current ? '0 0 8px rgba(249,115,22,0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;