import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: isMobile ? '12px' : '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: hovered ? '0 20px 40px -12px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: hovered ? 'rgba(24, 95, 165, 0.15)' : '#f0f0f0',
          transform: (hovered && !isMobile) ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginBottom: isMobile ? '12px' : '16px'
          }}
        >
          {product.images && product.images.length > 0 && !imgError ? (
            <img
              src={`${product.images[0].url}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: isMobile ? '12px' : '20px',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
              }}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>🔌</div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, display: 'flex', gap: '4px' }}>
            {product.newArrival && (
              <span style={{
                background: 'var(--brand-500)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.6rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>New</span>
            )}
          </div>
          
          {product.inStock === false && (
            <div style={{ 
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
              backdropFilter: 'blur(2px)'
            }}>
              <span style={{ 
                background: '#000', color: 'white', padding: '6px 12px', 
                borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase'
              }}>Sold Out</span>
            </div>
          )}
        </div>

        {/* Link overlay */}
        <Link to={`/product/${product._id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${product.name}`} />

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ 
              color: '#6B7280', 
              fontSize: '0.65rem', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em'
            }}>
              {product.brand || 'Premium'}
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: isMobile ? '0.85rem' : '1rem',
            color: '#000000',
            lineHeight: 1.4,
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em'
          }}>
            {product.name}
          </h3>

          <div style={{ flex: 1 }} />

          {/* Pricing and Action */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', textDecoration: 'line-through', marginBottom: '1px' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span style={{
                fontFamily: 'var(--font-sans)', 
                fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.15rem',
                color: '#000000',
                lineHeight: 1
              }}>
                {formatPrice(product.price)}
              </span>
              {product.quantity !== undefined && (
                <span style={{
                  fontSize: '0.65rem',
                  color: product.quantity > 0 ? '#059669' : '#dc2626',
                  fontWeight: 600,
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </span>
              )}
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
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: justAdded ? '#10b981' : (hovered ? 'var(--brand-500)' : '#000'),
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 2, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              )}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProductCard;
