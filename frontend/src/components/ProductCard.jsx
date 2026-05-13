import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product, showImageSlideshow = false, highlightPricing = false, compactMode = false, badgeLabel }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product._id]);

  useEffect(() => {
    if (!showImageSlideshow) return undefined;
    if (!product.images || product.images.length < 2) return undefined;

    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [showImageSlideshow, product.images]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isHotDealCard = highlightPricing && compactMode;
  const showButtonLabel = !compactMode && !isMobile;

  return (
    <div style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: isHotDealCard
            ? 'linear-gradient(180deg, #ffffff 0%, #f9fcff 100%)'
            : 'white',
          borderRadius: 'var(--radius-lg)',
          padding: compactMode ? (isMobile ? '10px' : '12px') : (isMobile ? '12px' : '16px'),
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: isHotDealCard
            ? (hovered ? '0 18px 32px -16px rgba(24,95,165,0.28)' : '0 8px 20px -14px rgba(24,95,165,0.2)')
            : (hovered ? '0 20px 40px -12px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)'),
          border: '1px solid',
          borderColor: isHotDealCard
            ? (hovered ? 'rgba(24,95,165,0.35)' : 'rgba(24,95,165,0.2)')
            : (hovered ? 'rgba(24, 95, 165, 0.15)' : '#f0f0f0'),
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
            aspectRatio: compactMode ? '1 / 1' : '1/1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: isHotDealCard
              ? 'radial-gradient(circle at top, #f3faff 0%, #eef5fb 55%, #eaf1f8 100%)'
              : '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginBottom: compactMode ? (isMobile ? '10px' : '12px') : (isMobile ? '12px' : '16px')
          }}
        >
          {product.images && product.images.length > 0 && !imgError ? (
            <>
              <img
                src={`${product.images[activeImageIndex]?.url || product.images[0].url}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: compactMode ? (isMobile ? '4px' : '8px') : (isMobile ? '12px' : '20px'),
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'opacity 0.45s ease, transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
                }}
                loading="lazy"
                onError={() => setImgError(true)}
                key={showImageSlideshow ? `${product._id}-${activeImageIndex}` : product._id}
              />
              {showImageSlideshow && product.images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '4px',
                  zIndex: 2,
                }}>
                  {product.images.map((_, index) => (
                    <span
                      key={index}
                      style={{
                        width: index === activeImageIndex ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '999px',
                        background: index === activeImageIndex ? 'var(--brand-500)' : 'rgba(255,255,255,0.45)',
                        transition: 'all 0.3s ease',
                        boxShadow: index === activeImageIndex ? '0 0 0 2px rgba(255,255,255,0.14)' : 'none',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
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
              }}>{badgeLabel || 'Hot'}</span>
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
              fontSize: highlightPricing ? '0.6rem' : '0.65rem', 
              fontWeight: highlightPricing ? 500 : 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em'
            }}>
              {product.brand || 'Premium'}
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: highlightPricing ? 500 : 600,
            fontSize: highlightPricing ? (isMobile ? '0.76rem' : '0.88rem') : (isMobile ? '0.85rem' : '1rem'),
            color: '#000000',
            lineHeight: 1.35,
            marginBottom: compactMode ? '8px' : (highlightPricing ? '8px' : '12px'),
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: compactMode ? '2.2em' : '2.8em'
          }}>
            {product.name}
          </h3>

          <div style={{ flex: 1 }} />

          {/* Pricing and Action */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', gap: '12px',
            paddingTop: highlightPricing ? '10px' : '4px',
            borderTop: highlightPricing ? '1px solid rgba(24,95,165,0.12)' : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              {highlightPricing && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-600)',
                  marginBottom: '4px'
                }}>
                  Hot Deal Price
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: highlightPricing ? '0.68rem' : '0.7rem', color: '#9CA3AF', textDecoration: 'line-through', marginBottom: '2px' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span style={{
                fontFamily: 'var(--font-sans)', 
                fontWeight: 700,
                fontSize: highlightPricing ? (isMobile ? '1.34rem' : '1.78rem') : (isMobile ? '1rem' : '1.15rem'),
                color: highlightPricing ? '#000000' : '#000000',
                lineHeight: 0.92,
                letterSpacing: highlightPricing ? '-0.04em' : 'normal',
                textShadow: highlightPricing ? '0 1px 0 rgba(255,255,255,0.65)' : 'none',
              }}>
                {formatPrice(product.price)}
              </span>
              {product.quantity !== undefined && (
                <span style={{
                  fontSize: '0.65rem',
                  color: highlightPricing ? 'var(--brand-600)' : (product.quantity > 0 ? '#059669' : '#dc2626'),
                  fontWeight: 700,
                  marginTop: '6px',
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
                minWidth: compactMode ? '34px' : (isMobile ? '34px' : '86px'),
                height: compactMode ? '34px' : (isMobile ? '34px' : '38px'),
                borderRadius: compactMode ? '10px' : (isMobile ? '10px' : '12px'),
                padding: compactMode ? '0 8px' : (isMobile ? '0 8px' : '0 12px'),
                background: justAdded
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : (hovered
                    ? 'linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%)'
                    : (isHotDealCard
                      ? 'linear-gradient(135deg, #0F6E56 0%, #0C5A47 100%)'
                      : 'linear-gradient(135deg, #111827 0%, #0f172a 100%)')),
                color: 'white',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 2, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: compactMode ? '0.72rem' : '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.2)' : '0 3px 8px rgba(0,0,0,0.12)',
                flexShrink: 0,
              }}
              aria-label="Add to cart"
            >
              {justAdded ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {showButtonLabel && <span>Added</span>}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                    <path d="M2 3h2l2.6 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H7" />
                  </svg>
                  {showButtonLabel && <span>Add</span>}
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
