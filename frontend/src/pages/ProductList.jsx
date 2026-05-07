import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import ProductCarousel from '../components/ProductCarousel';
import ProductCard from '../components/ProductCard';

// Categories are now fetched dynamically from the backend

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

function SectionHeader({ title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--surface-900)',
        letterSpacing: '-0.03em', margin: 0,
      }}>{title}</h2>
      {count !== undefined && (
        <span style={{
          padding: '2px 8px', background: 'var(--surface-50)', 
          border: '1px solid var(--surface-100)', borderRadius: '6px',
          color: '#64748b', fontSize: '0.7rem', fontWeight: 600,
        }}>{count} items</span>
      )}
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch products
    axios.get('/products')
      .then(res => { setProducts(res.data); setFilteredProducts(res.data); setLoading(false); })
      .catch(() => { setError('Failed to fetch products'); setLoading(false); });
      
    // Fetch categories
    axios.get('/categories')
      .then(res => { setCategories(res.data.map(cat => cat.name)); })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    let filtered = products;
    if (searchTerm?.trim()) {
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
    
    // Price filtering
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);
    }

    filtered = filtered.slice().sort((a, b) => {
      if (a.newArrival !== b.newArrival) return b.newArrival - a.newArrival;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice]);

  const newArrivals = filteredProducts.filter(p => p.newArrival);
  const otherProducts = filteredProducts.filter(p => !p.newArrival);

  // Group filtered products by category dynamically
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(p => p.category === category);
    if (categoryProducts.length > 0) {
      acc[category] = categoryProducts;
    }
    return acc;
  }, {});

  const uncategorizedProducts = filteredProducts.filter(p => !categories.includes(p.category));
  if (uncategorizedProducts.length > 0) {
    productsByCategory['Other Products'] = uncategorizedProducts;
  }

  if (loading) return (
    <div style={{ background: 'white' }}>
      <div style={{ minHeight: '300px', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(6,182,212,0.3)', borderTop: '3px solid var(--brand-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'white', opacity: 0.5, fontSize: '0.875rem' }}>Preparing Boutique...</p>
        </div>
      </div>
      <div className="page-container" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--surface-900)', marginBottom: '8px', fontSize: '1.2rem' }}>{error}</h2>
        <button onClick={() => window.location.reload()} className="btn-brand" style={{ marginTop: '12px' }}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div id="products" style={{ background: 'white' }}>
      <Hero />

      <div className="page-container" style={{ paddingTop: '32px' }}>
        <SearchFilter
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          categories={categories}
        />

        {/* Active filter pills */}
        {(searchTerm || selectedCategory || minPrice || maxPrice) && (
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing <strong style={{ color: 'var(--surface-900)' }}>{filteredProducts.length}</strong> products
            </span>
            {searchTerm && (
              <span style={{ padding: '4px 12px', background: 'var(--surface-50)', border: '1px solid var(--surface-200)', borderRadius: '8px', color: 'var(--surface-700)', fontSize: '0.75rem', fontWeight: 600 }}>
                "{searchTerm}"
              </span>
            )}
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); }}
              style={{ border: 'none', background: 'none', color: 'var(--brand-600)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '4px' }}
            >Clear All</button>
          </div>
        )}

        {/* New Arrivals — Always Featured as Carousel */}
        {newArrivals.length > 0 && (
          <section style={{ marginBottom: isMobile ? '48px' : '64px' }}>
            <SectionHeader title="New Arrivals" count={newArrivals.length} />
            <ProductCarousel products={newArrivals} sectionId="new-arrivals-carousel" />
          </section>
        )}

        {/* Dynamic Category Sections — Clean boutique grid */}
        {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
          <section key={categoryName} style={{ marginBottom: isMobile ? '56px' : '80px' }}>
            <SectionHeader title={categoryName} />
            <div className="product-grid">
              {categoryProducts.map(p => (
                <div key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'white', borderRadius: '20px', border: '1.5px solid var(--surface-100)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--surface-900)', marginBottom: '6px' }}>No products found</h3>
            <p style={{ color: '#64748b', marginBottom: '18px', fontSize: '0.9rem' }}>Try adjusting your search or filter</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); }} className="btn-brand">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
