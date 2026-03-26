import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const truncate = (text, max = 90) => {
    if (!text) return '';
    return text.length > max ? `${text.substring(0, max)}...` : text;
  };

  return (
    <div style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: hovered
            ? '0 24px 48px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.03)'
            : '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid',
          borderColor: hovered ? 'rgba(249,115,22,0.15)' : 'rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Inset Image Frame */}
        <div style={{
          position: 'relative',
          aspectRatio: '4/3',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--surface-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {product.images && product.images.length > 0 && !imgError ? (
            <img
              src={`${API_URL}${product.images[0].url}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '16px',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ color: '#cbd5e1', fontSize: '3rem' }}>📦</div>
          )}

          {/* Premium Glassmorphism Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.newArrival && (
                <span style={{
                  background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                  color: 'var(--brand-600)', border: '1px solid rgba(255,255,255,0.4)',
                  padding: '4px 10px', borderRadius: '999px', fontSize: '0.65rem',
                  fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  ✨ New
                </span>
              )}
              {product.inStock === false && (
                <span style={{
                  background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)',
                  color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                  padding: '4px 10px', borderRadius: '999px', fontSize: '0.65rem',
                  fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
                }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Link overlay */}
        <Link to={`/product/${product._id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${product.name}`} />

        {/* Content Body */}
        <div style={{ padding: '16px 8px 8px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {product.brand || product.category || 'Gadget'}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--surface-900)',
            lineHeight: 1.3,
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>

          {/* Footer: Price & Minimal CTA */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--surface-50)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', lineHeight: 1 }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '1.15rem', color: 'var(--surface-900)',
                letterSpacing: '-0.02em', lineHeight: 1.2
              }}>
                {formatPrice(product.price)}
              </span>
            </div>

            <button 
              disabled={product.inStock === false}
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (product.inStock === false) return;
                addToCart(product);
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 2000);
              }}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: justAdded ? '#10b981' : (hovered ? 'var(--brand-500)' : 'var(--surface-50)'),
                color: justAdded ? 'white' : (hovered ? 'white' : 'var(--brand-500)'),
                border: 'none',
                boxShadow: hovered && !justAdded ? '0 8px 16px rgba(249,115,22,0.25)' : 'none',
                cursor: product.inStock === false ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: 2, position: 'relative',
                opacity: product.inStock === false ? 0.3 : 1,
                transform: hovered && product.inStock !== false ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProductCard;