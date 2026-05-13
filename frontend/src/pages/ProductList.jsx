import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import ProductCard from '../components/ProductCard';

// ============================================================================
// UPGRADED PRODUCT LIST COMPONENT WITH COLLAPSIBLE CATEGORIES
// Features: Dynamic category loading, collapsible sections, price filtering,
//           search functionality, new arrivals carousel, responsive design
// ============================================================================

/**
 * CollapsibleIcon - Animated chevron icon for expand/collapse visual feedback
 * @param {boolean} isOpen - Whether the section is expanded
 */
function CollapsibleIcon({ isOpen }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease',
      }}
    >
      <polyline points="6 9 10 13 14 9"></polyline>
    </svg>
  );
}

/**
 * SkeletonCard - Loading placeholder while fetching products
 */
function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--surface-100)', padding: '8px' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%', borderRadius: '8px' }} />
      <div style={{ padding: '8px 4px' }}>
        <div className="skeleton" style={{ height: '8px', width: '30%', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '12px', width: '70%', borderRadius: '4px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

/**
 * SectionHeader - Clickable category header with collapse/expand icon
 * @param {string} title - Category title
 * @param {number} count - Number of products in category
 * @param {boolean} isOpen - Whether section is expanded
 * @param {function} onToggle - Callback when header is clicked
 */
function SectionHeader({ title, subtitle, count, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-50)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* Collapsible Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--surface-600)',
          }}
        >
          <CollapsibleIcon isOpen={isOpen} />
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              color: 'var(--surface-900)',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Item Count Badge */}
      {count !== undefined && (
        <span
          style={{
            padding: '2px 8px',
            background: 'var(--surface-50)',
            border: '1px solid var(--surface-100)',
            borderRadius: '6px',
            color: '#64748b',
            fontSize: '0.7rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {count} items
        </span>
      )}
    </div>
  );
}

/**
 * ProductList - Main component for displaying products with filtering and collapsible categories
 */
function ProductList() {
  // ===== STATE MANAGEMENT =====
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // UI state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  // ===== WINDOW RESIZE HANDLER =====
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ===== DATA FETCHING =====
  useEffect(() => {
    // Fetch products from backend
    axios.get('/products')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch products');
        setLoading(false);
      });
      
    // Fetch categories from backend
    axios.get('/categories')
      .then(res => { 
        const categoryNames = res.data.map(cat => cat.name);
        setCategories(categoryNames);
        
        // Initialize all categories as expanded by default
        const expandedState = categoryNames.reduce((acc, cat) => {
          acc[cat] = true;
          return acc;
        }, {});
        expandedState['Hot Deals'] = true; // Also initialize Hot Deals
        setExpandedCategories(expandedState);
      })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  // ===== FILTERING LOGIC =====
  useEffect(() => {
    let filtered = [...products];

    // Search filtering (by name, brand, description, category)
    if (searchTerm?.trim()) {
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
      );
    }

    // Category filtering
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Price range filtering
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);
    }

    // Sorting: New arrivals first, then by creation date (newest first)
    filtered = filtered.slice().sort((a, b) => {
      if (a.newArrival !== b.newArrival) return b.newArrival - a.newArrival;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice]);

  // ===== DERIVED STATE =====
  const hotDeals = filteredProducts.filter(p => p.newArrival);

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(p => p.category === category);
    if (categoryProducts.length > 0) {
      acc[category] = categoryProducts;
    }
    return acc;
  }, {});

  // Handle uncategorized products
  const uncategorizedProducts = filteredProducts.filter(p => !categories.includes(p.category));
  if (uncategorizedProducts.length > 0) {
    productsByCategory['Other Products'] = uncategorizedProducts;
  }

  // ===== EVENT HANDLERS =====
  /**
   * Toggle category expand/collapse state
   */
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  /**
   * Clear all active filters
   */
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div style={{ background: 'white' }}>
        {/* Loading Hero */}
        <div style={{
          minHeight: '300px',
          background: 'var(--surface-950)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(6,182,212,0.3)',
              borderTop: '3px solid var(--brand-500)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }} />
            <p style={{ color: 'white', opacity: 0.5, fontSize: '0.875rem' }}>Preparing Boutique...</p>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="page-container" style={{ paddingTop: '40px' }}>
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--surface-900)',
            marginBottom: '8px',
            fontSize: '1.2rem'
          }}>
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="btn-brand"
            style={{ marginTop: '12px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <div id="products" style={{ background: 'white' }}>
      {/* Hero Section */}
      <Hero />

      <div className="page-container" style={{ paddingTop: '32px' }}>
        
        {/* Search & Filter Component */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={categories}
        />

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory || minPrice || maxPrice) && (
          <div style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing <strong style={{ color: 'var(--surface-900)' }}>{filteredProducts.length}</strong> products
            </span>

            {/* Search Term Badge */}
            {searchTerm && (
              <span style={{
                padding: '4px 12px',
                background: 'var(--surface-50)',
                border: '1px solid var(--surface-200)',
                borderRadius: '8px',
                color: 'var(--surface-700)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                "{searchTerm}"
              </span>
            )}

            {/* Clear All Button */}
            <button
              onClick={clearAllFilters}
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--brand-600)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px',
                textDecoration: 'underline'
              }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* HOT DEALS SECTION - Grid Format with Collapse */}
        {hotDeals.length > 0 && (
          <section style={{
            marginBottom: isMobile ? '48px' : '64px',
            padding: isMobile ? '16px 0 18px' : '20px 0 24px',
            background: 'linear-gradient(135deg, rgba(24,95,165,0.07) 0%, rgba(15,110,86,0.05) 100%)',
            border: '1px solid rgba(24,95,165,0.10)',
            borderRadius: '24px',
          }}>
            <SectionHeader
              title="Hot Deals"
              subtitle="Best offers, limited stock"
              count={hotDeals.length}
              isOpen={expandedCategories['Hot Deals'] !== false}
              onToggle={() => toggleCategory('Hot Deals')}
              
            />
            {expandedCategories['Hot Deals'] !== false && (
              <div className="product-grid" style={{ padding: isMobile ? '0 16px' : '0 20px' }}>
                {hotDeals.map(p => (
                  <div key={p._id}>
                    <ProductCard
                      product={p}
                      showImageSlideshow
                      highlightPricing
                      compactMode
                      badgeLabel="Hot Deal"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* DYNAMIC CATEGORY SECTIONS - Grid Format with Collapse */}
        {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
          <section
            key={categoryName}
            style={{ marginBottom: isMobile ? '56px' : '80px' }}
          >
            {/* Collapsible Header */}
            <SectionHeader
              title={categoryName}
              count={categoryProducts.length}
              isOpen={expandedCategories[categoryName] !== false}
              onToggle={() => toggleCategory(categoryName)}
            />

            {/* Products Grid - Only shows when section is expanded */}
            {expandedCategories[categoryName] !== false && (
              <div className="product-grid">
                {categoryProducts.map(p => (
                  <div key={p._id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* EMPTY STATE - No products found */}
        {filteredProducts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            background: 'white',
            borderRadius: '20px',
            border: '1.5px solid var(--surface-100)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🔍</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: 'var(--surface-900)',
              marginBottom: '6px'
            }}>
              No products found
            </h3>
            <p style={{
              color: '#64748b',
              marginBottom: '18px',
              fontSize: '0.9rem'
            }}>
              Try adjusting your search or filter
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-brand"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductList;