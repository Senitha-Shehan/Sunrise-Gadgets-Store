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
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: hovered
            ? '0 12px 32px rgba(24, 95, 165, 0.1)'
            : '0 4px 12px rgba(0,0,0,0.03)',
          border: '1px solid',
          borderColor: hovered ? 'rgba(25, 110, 86, 0.1)' : 'rgba(0,0,0,0.04)',
          transform: (hovered && !isMobile) ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--surface-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginBottom: '12px'
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
                padding: '12px',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.5s ease',
              }}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ fontSize: '2.5rem' }}>🔌</div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, display: 'flex', gap: '4px' }}>
            {product.newArrival && (
              <span style={{
                background: 'var(--brand-600)', /* Teal */
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 12px rgba(15, 110, 86, 0.2)'
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
                background: 'var(--surface-900)', color: 'white', padding: '6px 12px', 
                borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' 
              }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Link overlay */}
        <Link to={`/product/${product._id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${product.name}`} />

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: 'var(--brand-700)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand || 'Premium Accessory'}
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--brand-500)', /* Dark Blue */
            lineHeight: 1.3,
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Rating placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '12px' }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= 4 ? "var(--brand-700)" : "rgba(0,0,0,0.1)"}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ))}
            <span style={{ fontSize: '0.65rem', color: 'var(--surface-400)', marginLeft: '4px' }}>(24)</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-display)', 
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em', 
                color: 'var(--surface-900)'
              }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '0.7rem', color: 'var(--surface-400)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
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
                padding: '10px 14px',
                borderRadius: '10px',
                background: justAdded ? '#10b981' : (hovered ? 'var(--brand-600)' : 'var(--brand-500)'),
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 2, 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                boxShadow: hovered ? '0 4px 12px rgba(24, 95, 165, 0.2)' : 'none',
              }}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    </div>
      </article>
    </div>
  );
}

export default ProductCard;

