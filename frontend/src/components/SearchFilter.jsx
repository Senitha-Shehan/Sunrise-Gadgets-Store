import { useState } from 'react';

function SearchFilter({
  searchTerm, setSearchTerm,
  selectedCategory, setSelectedCategory, categories,
  minPrice, setMinPrice, maxPrice, setMaxPrice,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = selectedCategory || minPrice || maxPrice;
  const activeCount = [selectedCategory, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      border: '1.5px solid rgba(226,232,240,0.8)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      marginBottom: '28px',
      overflow: 'hidden',
    }}>
      {/* Top Row: Search + Filter Toggle */}
      <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)', width: '17px', height: '17px',
            color: '#94a3b8', pointerEvents: 'none',
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search products, brands..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 36px 13px 42px',
              background: 'var(--surface-50)',
              border: '1.5px solid var(--surface-200)',
              borderRadius: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: 'var(--surface-900)',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              WebkitAppearance: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.1)'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--surface-200)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-50)'; }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--surface-200)', border: 'none', borderRadius: '50%',
                width: '20px', height: '20px', minHeight: 'unset', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFiltersOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '13px 14px',
            background: filtersOpen || hasActiveFilters ? 'rgba(6,182,212,0.08)' : 'var(--surface-50)',
            border: `1.5px solid ${filtersOpen || hasActiveFilters ? 'rgba(6,182,212,0.3)' : 'var(--surface-200)'}`,
            borderRadius: '12px',
            color: filtersOpen || hasActiveFilters ? 'var(--brand-600)' : '#64748b',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
            whiteSpace: 'nowrap', flexShrink: 0, position: 'relative',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          <span className="sf-filter-label">Filters</span>
          {activeCount > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: 'var(--brand-500)', color: 'white',
              borderRadius: '999px', minWidth: '18px', height: '18px',
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', border: '2px solid white',
            }}>{activeCount}</span>
          )}
        </button>

        {(searchTerm || hasActiveFilters) && (
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); }}
            style={{
              padding: '12px', background: 'none',
              border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '12px',
              color: '#ef4444', fontWeight: 600, fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="sf-clear-label">Clear</span>
          </button>
        )}
      </div>

      {/* Expandable Filter Panel */}
      <div style={{
        maxHeight: filtersOpen ? '320px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--surface-100)',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Category Pills */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
              Category
            </label>
            <div className="category-scroll scroll-hide" style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
              {['', ...categories].map(cat => (
                <button
                  key={cat || 'all'}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px', borderRadius: '999px', border: '1.5px solid',
                    borderColor: selectedCategory === cat ? 'var(--brand-500)' : 'var(--surface-200)',
                    background: selectedCategory === cat ? 'rgba(6,182,212,0.08)' : 'var(--surface-50)',
                    color: selectedCategory === cat ? 'var(--brand-600)' : '#64748b',
                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                  }}
                >{cat || 'All'}</button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
              Price Range (LKR)
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                min="0"
                inputMode="numeric"
                style={{
                  flex: 1, padding: '12px 12px',
                  background: 'var(--surface-50)',
                  border: '1.5px solid var(--surface-200)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  color: 'var(--surface-900)',
                  outline: 'none', transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--surface-200)'; e.target.style.background = 'var(--surface-50)'; }}
              />
              <span style={{ color: '#94a3b8', fontSize: '0.9rem', flexShrink: 0, fontWeight: 500 }}>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min="0"
                inputMode="numeric"
                style={{
                  flex: 1, padding: '12px 12px',
                  background: 'var(--surface-50)',
                  border: '1.5px solid var(--surface-200)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  color: 'var(--surface-900)',
                  outline: 'none', transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--surface-200)'; e.target.style.background = 'var(--surface-50)'; }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .sf-filter-label { display: none; }
        }
        @media (max-width: 360px) {
          .sf-clear-label { display: none; }
        }
      `}</style>
    </div>
  );
}

export default SearchFilter;
