import { Link } from 'react-router-dom';

function PromoBanner() {
  const isMobile = window.innerWidth < 768;

  return (
    <section style={{ marginBottom: isMobile ? '32px' : '56px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'relative',
        minHeight: isMobile ? '320px' : '400px',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '32px 24px' : '48px',
        background: 'var(--surface-950)', // Fallback
      }}>
        {/* Background Layer: We use a placeholder image URL for now that gives a home theater vibe, or just a dark gradient if image fails */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.6,
        }} />
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, transparent 100%)' }} />
        
        {/* Decorative Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '-10%', transform: 'translateY(-50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 12px', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px',
            color: 'var(--brand-400)', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px',
            backdropFilter: 'blur(8px)',
          }}>
            Ultimate Experience
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(1.8rem, 10vw, 2.5rem)' : 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '16px',
            letterSpacing: '-0.03em',
          }}>
            Transform Your <span style={{ color: 'var(--brand-500)' }}>Living Room</span> Into a Cinema.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Shop our curated bundles of ultra-HD projectors, acoustic screens, and immersive audio systems designed for home entertainment.
          </p>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-brand" style={{ display: 'inline-flex', padding: '12px 28px', textDecoration: 'none' }}>
            Explore Bundles
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
