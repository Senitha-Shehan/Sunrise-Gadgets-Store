import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

const WA_NUMBER = '94702005088';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', x: '50%', y: '50%' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return; // No zoom on mobile
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ display: 'block', x: `${x}%`, y: `${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ ...zoomStyle, display: 'none' });
  };

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setError('Failed to fetch product details'); setLoading(false); });
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }).format(price);

  const spinner = (
    <div style={{ width: '44px', height: '44px', border: '3px solid rgba(249,115,22,0.2)', borderTop: '3px solid var(--brand-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
  );

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)' }}>
      <div style={{ textAlign: 'center' }}>{spinner}<p style={{ color: '#64748b' }}>Loading product...</p></div>
    </div>
  );

  if (error || !product) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)', padding: '24px' }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '40px 32px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', maxWidth: '380px', width: '100%' }}>
        <div style={{ fontSize: '3rem', marginBottom: '14px' }}>{error ? '⚠️' : '🔍'}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--surface-900)', marginBottom: '8px', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
          {error ? 'Something went wrong' : 'Product Not Found'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>{error || "The product doesn't exist."}</p>
        <button onClick={() => navigate('/')} className="btn-brand">← Back to Products</button>
      </div>
    </div>
  );

  const savings = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div style={{ background: 'var(--surface-50)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--surface-100)', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', height: '52px', overflow: 'hidden' }}>
          <button onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', fontFamily: 'var(--font-sans)', padding: '6px 8px', borderRadius: '8px', transition: 'all 0.2s', minHeight: 'auto', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--surface-50)'; e.currentTarget.style.color='var(--brand-500)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#64748b'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Products
          </button>
          <span style={{ color: 'var(--surface-200)', fontSize: '0.8rem' }}>›</span>
          <span style={{ color: 'var(--surface-900)', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name.length > 35 ? product.name.substring(0, 35) + '…' : product.name}
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="detail-container">
        <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1.5px solid var(--surface-100)' }}>
          <div className="detail-grid">

            {/* Image Gallery */}
            <div className="detail-img-pad">
              {product.images && product.images.length > 0 ? (
                <div>
                  <div 
                    style={{ 
                      aspectRatio: '1/1', background: 'white', borderRadius: '16px', 
                      overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', 
                      marginBottom: '16px', border: '1px solid var(--surface-100)',
                      position: 'relative', cursor: isMobile ? 'default' : 'crosshair'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseMove}
                  >
                      <img 
                        src={`${API_URL}${product.images[selectedImage].url}`} 
                        alt={product.name} 
                        style={{ 
                          width: '100%', height: '100%', objectFit: 'contain',
                          transform: zoomStyle.display === 'block' ? 'scale(2.5)' : 'scale(1)',
                          transformOrigin: `${zoomStyle.x} ${zoomStyle.y}`,
                          transition: zoomStyle.display === 'block' ? 'none' : 'transform 0.3s ease-out',
                          pointerEvents: 'none'
                        }} 
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        {product.images.map((img, i) => (
                          <button key={i} onClick={() => setSelectedImage(i)}
                            style={{
                              flexShrink: 0, width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden',
                              border: i === selectedImage ? '2px solid var(--brand-500)' : '2px solid transparent',
                              boxShadow: i === selectedImage ? '0 4px 12px rgba(249,115,22,0.15)' : '0 2px 6px rgba(0,0,0,0.04)',
                              opacity: i === selectedImage ? 1 : 0.6,
                              cursor: 'pointer', transition: 'all 0.2s', background: 'white', padding: '2px', minHeight: 'auto',
                            }}
                            onMouseEnter={e => { if (i !== selectedImage) e.currentTarget.style.opacity = '1'; }}
                            onMouseLeave={e => { if (i !== selectedImage) e.currentTarget.style.opacity = '0.6'; }}
                          >
                            <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                              <img src={`${API_URL}${img.url}`} alt={`View ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                <div style={{ aspectRatio: '1/1', background: 'var(--surface-50)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: '#94a3b8' }}>📦</div>
              )}
            </div>

            {/* Info */}
            <div className="detail-info-pad">
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.newArrival && <span className="badge badge-new">✨ New Arrival</span>}
                {product.inStock === false && <span className="badge" style={{ background: '#ef4444', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>Out of Stock</span>}
                {product.inStock !== false && <span className="badge" style={{ background: '#10b981', color: 'white', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>In Stock</span>}
                {product.brand && <span style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(249,115,22,0.08)', color: 'var(--brand-600)', border: '1px solid rgba(249,115,22,0.2)' }}>{product.brand}</span>}
                {product.category && <span style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500, background: 'var(--surface-50)', color: '#475569', border: '1px solid var(--surface-200)' }}>{product.category}</span>}
              </div>

              {/* Name */}
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', color: 'var(--surface-900)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0 }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--brand-600)', letterSpacing: '-0.04em' }}>
                  {formatPrice(product.price)}
                </span>
                {savings && (
                  <>
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                    <span style={{ padding: '3px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>Save {savings}%</span>
                  </>
                )}
              </div>

              {/* Actions (Add to Cart / WhatsApp) */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                flexDirection: isMobile ? 'column' : 'row',
                marginTop: '8px' 
              }}>
                {/* Add to Cart */}
                <button
                  disabled={product.inStock === false}
                  onClick={() => {
                    addToCart(product);
                    setJustAdded(true);
                    setTimeout(() => setJustAdded(false), 2000);
                  }}
                  style={{
                    flex: isMobile ? 'none' : '1 1 200px', padding: '15px 24px',
                    background: justAdded ? '#10b981' : (product.inStock === false ? 'var(--surface-200)' : 'var(--brand-500)'),
                    width: isMobile ? '100%' : 'auto',
                    color: product.inStock === false ? '#94a3b8' : 'white',
                    border: 'none', borderRadius: '12px',
                    fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-display)',
                    cursor: product.inStock === false ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: product.inStock === false || justAdded ? 'none' : '0 4px 14px rgba(249,115,22,0.4)',
                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={e => { if (product.inStock !== false && !justAdded) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.5)'; } }}
                  onMouseLeave={e => { if (product.inStock !== false && !justAdded) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.4)'; } }}
                >
                  {justAdded ? (
                    '✓ Added to Cart'
                  ) : product.inStock === false ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-2L23 6H6"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>

                {/* WhatsApp Enquiry */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello! I'm interested in the ${product.brand} ${product.name} (Price: ${formatPrice(product.price)}). Is it currently available?`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: isMobile ? 'none' : '1 1 200px', padding: '15px 24px',
                    background: '#25D366', color: 'white',
                    width: isMobile ? '100%' : 'auto',
                    border: 'none', borderRadius: '12px', textDecoration: 'none',
                    fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-display)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)'; e.currentTarget.style.background = '#1ebe5d'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)'; e.currentTarget.style.background = '#25D366'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enquire via WhatsApp
                </a>
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ background: 'var(--surface-50)', borderRadius: '14px', padding: '18px', border: '1px solid var(--surface-100)', marginTop: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--surface-600)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Description</h3>
                  <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.875rem', margin: 0 }}>{product.description}</p>
                </div>
              )}

              {/* Included */}
              {product.included && product.included.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.04), rgba(234,88,12,0.06))', borderRadius: '14px', padding: '18px', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    What's Included
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {product.included.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.85rem', color: '#475569' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              <div style={{ borderTop: '1px solid var(--surface-100)', paddingTop: '18px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--surface-600)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Product Details</h3>
                <div className="spec-grid">
                  {/* Default static specs */}
                  {[{ label: 'Brand', value: product.brand }, { label: 'Category', value: product.category }].filter(s => s.value).map(spec => (
                    <div key={spec.label} style={{ padding: '12px 14px', background: 'var(--surface-50)', borderRadius: '10px', border: '1px solid var(--surface-100)' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{spec.label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--surface-900)', fontWeight: 600 }}>{spec.value}</div>
                    </div>
                  ))}
                  {/* Dynamic schema specs */}
                  {product.specs && product.specs.map((spec, index) => (
                    <div key={index} style={{ padding: '12px 14px', background: 'var(--surface-50)', borderRadius: '10px', border: '1px solid var(--surface-100)' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{spec.key}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--surface-900)', fontWeight: 600 }}>{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back button */}
              <button onClick={() => navigate('/')}
                style={{ padding: '13px', background: 'var(--surface-50)', border: '1.5px solid var(--surface-200)', borderRadius: '12px', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--brand-500)'; e.currentTarget.style.color='var(--brand-600)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--surface-200)'; e.currentTarget.style.color='#475569'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back to All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;