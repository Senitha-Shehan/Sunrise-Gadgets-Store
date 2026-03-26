import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

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
    <div
      style={{ display: 'block', height: '100%', textDecoration: 'none' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: '20px',
          border: hovered ? '1.5px solid rgba(249,115,22,0.25)' : '1.5px solid rgba(226,232,240,0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: hovered
            ? '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(249,115,22,0.08)'
            : '0 4px 16px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Image */}
        <div className="product-card-img" style={{
          position: 'relative',
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          flexShrink: 0,
        }}>
          {product.images && product.images.length > 0 && !imgError ? (
            <img
              src={`http://localhost:5000${product.images[0].url}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              }}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '3rem',
            }}>
              📦
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 50%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.newArrival && (
                <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>
                  ✨ New Arrival
                </span>
              )}
              {product.inStock === false && (
                <span className="badge" style={{ fontSize: '0.7rem', background: '#ef4444', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
                  Out of Stock
                </span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <span style={{
                marginLeft: 'auto',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '999px',
              }}>
                +{product.images.length - 1}
              </span>
            )}
          </div>
        </div>

        {/* Link overlay to handle navigation without wrapping the buttons */}
        <Link to={`/product/${product._id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${product.name}`} />

        {/* Content */}
        <div className="product-card-body" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tags */}
          <div className="product-card-tags" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {product.brand && (
              <span style={{
                background: 'rgba(249,115,22,0.08)',
                color: 'var(--brand-600)',
                border: '1px solid rgba(249,115,22,0.2)',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}>
                {product.brand}
              </span>
            )}
            {product.category && (
              <span style={{
                background: 'var(--surface-50)',
                color: '#64748b',
                border: '1px solid var(--surface-200)',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 500,
              }}>
                {product.category}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="product-card-name" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: hovered ? 'var(--brand-600)' : 'var(--surface-900)',
            lineHeight: 1.35,
            marginBottom: '6px',
            transition: 'color 0.2s',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="product-card-desc" style={{
              color: '#64748b',
              fontSize: '0.78rem',
              lineHeight: 1.55,
              flex: 1,
              marginBottom: '12px',
            }}>
              {truncate(product.description, 75)}
            </p>
          )}

          {/* Price + CTA */}
          <div className="product-card-footer" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid var(--surface-100)',
            marginTop: 'auto',
            gap: '6px',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: 'var(--surface-900)',
                letterSpacing: '-0.02em',
              }}>
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
            <button 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: justAdded ? '#10b981' : (hovered ? 'var(--brand-500)' : 'var(--surface-50)'),
                color: justAdded ? 'white' : (hovered ? 'white' : 'var(--brand-600)'), // Always use orange icon except on hover
                border: hovered || justAdded ? 'none' : '1px solid var(--surface-200)',
                padding: '8px 14px', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-sans)',
                cursor: product.inStock === false ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                zIndex: 2, position: 'relative',
                opacity: product.inStock === false ? 0.5 : 1,
              }}
              disabled={product.inStock === false}
              onClick={(e) => {
                e.preventDefault(); // Stop click from bubbling to Link
                e.stopPropagation();
                if (product.inStock === false) return;
                addToCart(product);
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 2000);
              }}
            >
              {justAdded ? (
                <>✓ Added</>
              ) : product.inStock === false ? (
                <>Out of Stock</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  Add <span style={{ display: 'none' }} className="hidden-mobile">to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProductCard;