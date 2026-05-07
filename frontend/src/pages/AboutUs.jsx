import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const aboutSlides = [
  {
    bg: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    tag: '🌟 Our Journey',
    headline: 'Passionate About',
    sub: 'Quality Tech',
    desc: 'We started Sunrise Gadgets to bring premium, reliable electronics directly to your home and business with a personal touch.',
  },
  {
    bg: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80',
    tag: '🤝 Trusted Partner',
    headline: 'Your Local',
    sub: 'Tech Experts',
    desc: 'From custom projector setups to everyday smart gadgets, we focus on honest advice, fair prices, and uncompromised quality.',
  }
];

function AboutUs() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--surface-900)' }}>

      {/* Hero Section */}
      <Hero 
        slides={aboutSlides} 
        primaryCta={{ text: "Browse Store", link: "/" }} 
        secondaryCta={{ text: "Contact Us", link: "/contact" }}
        hideStats={true}
      />

      {/* Our Story Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="animate-slide-up" style={{ maxWidth: '800px', textAlign: 'left' }}>
            
            <div style={{ width: '60px', height: '4px', background: 'var(--brand-500)', borderRadius: '2px', marginBottom: '24px' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '32px', letterSpacing: '-0.03em', color: 'var(--surface-950)' }}>
              Our Story
            </h2>
            
            <div style={{ color: 'var(--surface-700)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px' }}>
              <p style={{ marginBottom: '24px' }}>
                We started as a small, passionate team with a simple goal: to provide reliable, high-quality electronics to our local community without the overwhelming, impersonal feel of a mega-corporation.
              </p>
              <p>
                From installing the perfect living room projector to sourcing specialized parts for hot water projects, we put customer satisfaction first. You deal directly with us, ensuring fair prices and honest advice every single time.
              </p>
            </div>

            <Link to="/contact" style={{ 
              display: 'inline-block', padding: '12px 32px', textDecoration: 'none',
              background: 'white', color: 'var(--brand-600)', border: '1.5px solid var(--brand-400)',
              borderRadius: '12px', fontWeight: 600, transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(249,115,22,0.08)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--brand-50)'; e.currentTarget.style.borderColor='var(--brand-500)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='var(--brand-400)'; }}>
              Get in Touch With Our Team
            </Link>

          </div>
        </div>
      </section>

      {/* What We Sell Section */}
      <section className="about-section bg-white" style={{ borderTop: '1px solid var(--surface-200)', borderBottom: '1px solid var(--surface-200)' }}>
        <div className="about-container">
          
          <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '12px', letterSpacing: '-0.03em', color: 'var(--surface-950)' }}>
              What We Sell
            </h2>
            <p style={{ color: 'var(--surface-600)', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>
              A curated selection of high-performance gear for your home and office.
            </p>
          </div>

          <div className="about-grid-4">
            {[
              { image: '/hot-water.jpg', title: 'Hot Water Products', desc: 'Reliable heating solutions for modern homes.' },
              { image: '/projectors.webp', title: 'Projectors', desc: 'Cinematic 4K and portable HD setups.' },
              { image: '/smart gadets.jpg', title: 'Smart Gadgets', desc: 'Everyday tech to make life easier.' },
              { image: '/accessories.webp', title: 'Accessories', desc: 'High-quality cables, mounts, and audio components.' }
            ].map(item => (
              <div 
                key={item.title} 
                className="about-card" 
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-200)' }}
              >
                <div style={{ height: '220px', width: '100%', background: 'var(--surface-100)', overflow: 'hidden' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} 
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} 
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--surface-950)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--surface-600)', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Why Choose Us Section - Full Banner */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(80px, 12vw, 120px) 24px',
        overflow: 'hidden'
      }}>
        {/* Background Image & Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="/why-choose-us.png" 
            alt="Why Choose Us Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Dark overlay for readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }} />
        </div>

        <div className="about-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '16px', letterSpacing: '-0.03em', color: 'white' }}>
              Why Choose Us?
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--brand-500)', borderRadius: '2px', margin: '0 auto' }} />
          </div>

          <div className="about-grid-4">
            {[
              { title: 'Quality Products', desc: 'Tested and proven reliable for long-term use across all your tech needs.' },
              { title: 'Affordable Prices', desc: 'Fair, transparent pricing with no hidden markups on premium equipment.' },
              { title: 'Fast Support', desc: 'Direct, friendly, and expert assistance locally whenever you need it most.' },
              { title: 'Trusted Service', desc: 'We stand resolutely by what we sell to guarantee your complete satisfaction.' }
            ].map(item => (
              <div key={item.title} className="about-card" style={{ 
                background: 'rgba(255,255,255,0.06)', 
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                color: 'white',
                padding: '32px 24px',
                textAlign: 'left',
                display: 'block'
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(249,115,22,0.4)'; e.currentTarget.style.transform='translateY(-6px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none'; }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'white' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Closing CTA - Full Width */}
      <section style={{ 
        width: '100%', 
        background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(249,115,22,0.12) 100%)', 
        padding: 'clamp(80px, 10vw, 120px) 24px', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '24px', letterSpacing: '-0.03em', color: 'var(--surface-950)' }}>
            Ready to find your perfect gadget?
          </h2>
          <p style={{ color: 'var(--surface-700)', fontSize: '1.15rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Browse our catalogue to see what's new, or reach out to our team if you need personalized advice for your next project.
          </p>
          <div style={{ display: 'inline-flex' }}>
            <Link 
              to="/" 
              className="btn-brand" 
              style={{ 
                padding: '16px 40px', 
                fontSize: '1.1rem', 
                textDecoration: 'none', 
                boxShadow: '0 8px 32px rgba(249,115,22,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Shop Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;
