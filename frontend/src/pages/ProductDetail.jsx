import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setError('Failed to fetch product details'); setLoading(false); });
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }).format(price);

  const spinnerStyle = {
    width: '48px', height: '48px',
    border: '3px solid rgba(249,115,22,0.2)',
    borderTop: '3px solid var(--brand-500)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 16px',
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={spinnerStyle} />
        <p style={{ color: '#64748b' }}>Loading product...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)' }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', maxWidth: '400px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{error ? '⚠️' : '🔍'}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--surface-900)', marginBottom: '8px' }}>{error ? 'Something went wrong' : 'Product Not Found'}</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>{error || "The product you're looking for doesn't exist."}</p>
        <button onClick={() => navigate('/')} className="btn-brand">← Back to Products</button>
      </div>
    </div>
  );

  const savings = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div style={{ background: 'var(--surface-50)', minHeight: '100vh' }}>
      {/* Breadcrumb Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--surface-100)',
        position: 'sticky',
        top: '0',
        zIndex: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', height: '56px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748b',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
              fontFamily: 'var(--font-sans)',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              minHeight: 'auto',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--surface-50)'; e.currentTarget.style.color='var(--brand-500)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#64748b'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Products
          </button>
          <span style={{ color: 'var(--surface-200)', fontSize: '0.75rem' }}>›</span>
          <span style={{ color: 'var(--surface-900)', fontSize: '0.875rem', fontWeight: 500 }}
            title={product.name}
          >{product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          background: 'white',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1.5px solid var(--surface-100)',
        }}>
          {/* Image Gallery */}
          <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '32px' }}>
            {product.images && product.images.length > 0 ? (
              <div>
                {/* Main Image */}
                <div style={{
                  aspectRatio: '1/1',
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  marginBottom: '16px',
                  border: '1px solid var(--surface-100)',
                }}>
                  <img
                    src={`http://localhost:5000${product.images[selectedImage].url}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        style={{
                          flexShrink: 0,
                          width: '72px',
                          height: '72px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: i === selectedImage ? '2.5px solid var(--brand-500)' : '2px solid transparent',
                          boxShadow: i === selectedImage ? '0 0 0 3px rgba(249,115,22,0.2)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: 'none',
                          padding: 0,
                          minHeight: 'auto',
                        }}
                      >
                        <img src={`http://localhost:5000${img.url}`} alt={`View ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                aspectRatio: '1/1',
                background: 'white',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--surface-100)',
                color: '#94a3b8',
                fontSize: '5rem',
              }}>📦</div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.newArrival && (
                <span className="badge badge-new">✨ New Arrival</span>
              )}
              {product.brand && (
                <span style={{
                  padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(249,115,22,0.08)', color: 'var(--brand-600)',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}>
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span style={{
                  padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500,
                  background: 'var(--surface-50)', color: '#475569',
                  border: '1px solid var(--surface-200)',
                }}>
                  {product.category}
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                color: 'var(--surface-900)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                margin: 0,
              }}>
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--brand-600)',
                letterSpacing: '-0.04em',
              }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span style={{
                    padding: '3px 10px', background: '#dcfce7', color: '#16a34a',
                    borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    Save {savings}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ background: 'var(--surface-50)', borderRadius: '16px', padding: '20px', border: '1px solid var(--surface-100)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--surface-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', margin: '0 0 10px' }}>
                  Description
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.9rem', margin: 0 }}>{product.description}</p>
              </div>
            )}

            {/* What's Included */}
            {product.included && product.included.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(234,88,12,0.06) 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(249,115,22,0.15)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem',
                  color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.06em',
                  margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  What's Included
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.included.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#475569' }}>
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '50%', background: 'var(--brand-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            <div style={{ borderTop: '1px solid var(--surface-100)', paddingTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--surface-600)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
                Product Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Category', value: product.category },
                ].filter(s => s.value).map(spec => (
                  <div key={spec.label} style={{
                    padding: '14px 16px',
                    background: 'var(--surface-50)',
                    borderRadius: '12px',
                    border: '1px solid var(--surface-100)',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{spec.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--surface-900)', fontWeight: 600 }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '14px 24px',
                background: 'var(--surface-50)',
                border: '1.5px solid var(--surface-200)',
                borderRadius: '14px',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--brand-500)'; e.currentTarget.style.color='var(--brand-600)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--surface-200)'; e.currentTarget.style.color='#475569'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;