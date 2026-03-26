import { useRef, useState, useCallback, useEffect } from 'react';
import ProductCard from './ProductCard';

/* ─── Constants ───────────────────────────────────────────── */
// Gap between cards in px — must match CSS variable --carousel-gap
const GAP = 20;

/**
 * ProductCarousel
 * Responsive horizontal-scroll carousel.
 *  - Mobile  (<640px):  2 cards visible (50% width each)
 *  - Tablet  (<1024px): 3 cards visible (33.33% width each)
 *  - Desktop (≥1024px): 4 cards visible (25% width each)
 * Supports:
 *  - Arrow button navigation (scrolls by one full "page" of cards)
 *  - Touch/mouse drag scrolling
 *  - Smooth CSS scroll behavior
 *  - Dot indicators
 */
function ProductCarousel({ products = [], sectionId = 'carousel' }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  // Drag state
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  /* ── Calculate visible count based on viewport width ── */
  const getVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  }, []);

  /* ── Scroll state sync ── */
  const syncState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    // Active dot: which "page" are we on?
    const visCount = getVisibleCount();
    const cardW = (el.clientWidth - GAP * (visCount - 1)) / visCount;
    const step = cardW + GAP;
    const page = Math.round(el.scrollLeft / step / visCount);
    const totalPages = Math.ceil(products.length / visCount);
    setActiveDot(Math.min(page, totalPages - 1));
  }, [getVisibleCount, products.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncState, { passive: true });
    syncState();
    window.addEventListener('resize', syncState);
    return () => {
      el.removeEventListener('scroll', syncState);
      window.removeEventListener('resize', syncState);
    };
  }, [syncState]);

  /* ── Arrow navigation — scrolls exactly one page ── */
  const scrollByPage = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const visCount = getVisibleCount();
    const cardW = (el.clientWidth - GAP * (visCount - 1)) / visCount;
    const step = (cardW + GAP) * visCount;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, [getVisibleCount]);

  /* ── Dot navigation ── */
  const scrollToPage = useCallback((page) => {
    const el = trackRef.current;
    if (!el) return;
    const visCount = getVisibleCount();
    const cardW = (el.clientWidth - GAP * (visCount - 1)) / visCount;
    const step = (cardW + GAP) * visCount;
    el.scrollTo({ left: page * step, behavior: 'smooth' });
  }, [getVisibleCount]);

  /* ── Mouse drag ── */
  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft };
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.userSelect = 'none';
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    trackRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };
  const onMouseUp = () => {
    drag.current.active = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = '';
      trackRef.current.style.userSelect = '';
    }
  };

  /* ── Dot count ── */
  const visCount = getVisibleCount();
  const totalPages = Math.ceil(products.length / visCount);

  /* ── Styles ── */
  const arrowBase = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1.5px solid rgba(226,232,240,0.9)',
    background: 'white',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'var(--surface-700)',
    minHeight: 'unset',
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Left Arrow ── */}
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          onClick={() => scrollByPage(-1)}
          style={{ ...arrowBase, left: '-22px' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--brand-500)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'var(--brand-500)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = 'var(--surface-700)';
            e.currentTarget.style.borderColor = 'rgba(226,232,240,0.9)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* ── Track ── */}
      <div
        id={sectionId}
        ref={trackRef}
        className="carousel-track"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex',
          gap: `${GAP}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          paddingBottom: '8px',
          cursor: 'grab',
          /* Hide scrollbar — browsers show dots instead */
          scrollbarWidth: 'none',   /* Firefox */
          msOverflowStyle: 'none',  /* IE/Edge */
        }}
      >
        {products.map(product => (
          <div
            key={product._id}
            className="carousel-item"
            style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* ── Right Arrow ── */}
      {canScrollRight && (
        <button
          aria-label="Scroll right"
          onClick={() => scrollByPage(1)}
          style={{ ...arrowBase, right: '-22px' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--brand-500)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'var(--brand-500)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = 'var(--surface-700)';
            e.currentTarget.style.borderColor = 'rgba(226,232,240,0.9)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* ── Dot Indicators ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => scrollToPage(i)}
              style={{
                width: activeDot === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                border: 'none',
                background: activeDot === i ? 'var(--brand-500)' : '#cbd5e1',
                cursor: 'pointer',
                padding: 0,
                minHeight: 'unset',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCarousel;
