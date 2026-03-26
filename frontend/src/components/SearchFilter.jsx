function SearchFilter({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      border: '1.5px solid rgba(226,232,240,0.8)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      padding: '18px 20px',
      marginBottom: '28px',
    }}>
      <div className="search-row">
        {/* Search */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <svg style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)', width: '17px', height: '17px',
            color: '#94a3b8', pointerEvents: 'none',
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projectors, brands, models..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              background: 'var(--surface-50)',
              border: '1.5px solid var(--surface-200)',
              borderRadius: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              color: 'var(--surface-900)',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--surface-200)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-50)'; }}
          />
        </div>

        {/* Category */}
        <div className="category-select-wrap">
          <svg style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#94a3b8', pointerEvents: 'none' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 38px 12px 14px',
              background: 'var(--surface-50)',
              border: '1.5px solid var(--surface-200)',
              borderRadius: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              color: selectedCategory ? 'var(--surface-900)' : '#94a3b8',
              outline: 'none', appearance: 'none', cursor: 'pointer',
              transition: 'all 0.2s ease', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--brand-500)'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--surface-200)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface-50)'; }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Clear */}
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '11px 16px',
              background: 'rgba(249,115,22,0.08)', border: '1.5px solid rgba(249,115,22,0.2)',
              borderRadius: '12px', color: 'var(--brand-600)', fontWeight: 600,
              fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;