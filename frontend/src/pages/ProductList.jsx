import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import ProductCarousel from '../components/ProductCarousel';
import PromoBanner from '../components/PromoBanner';

// Categories are now fetched dynamically from the backend

function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid rgba(226,232,240,0.8)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '180px', width: '100%' }} />
      <div style={{ padding: '14px' }}>
        <div className="skeleton" style={{ height: '10px', width: '45%', borderRadius: '6px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '13px', width: '80%', borderRadius: '6px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '38%', borderRadius: '6px' }} />
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div className="section-rule" />
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', color: 'var(--surface-900)',
        letterSpacing: '-0.03em', margin: 0,
      }}>{title}</h2>
      <span style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
        background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '999px', color: 'var(--brand-600)', fontSize: '0.78rem', fontWeight: 700,
      }}>{count}</span>
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

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch products
    axios.get('http://localhost:5000/products')
      .then(res => { setProducts(res.data); setFilteredProducts(res.data); setLoading(false); })
      .catch(() => { setError('Failed to fetch products'); setLoading(false); });
      
    // Fetch categories
    axios.get('http://localhost:5000/categories')
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

  // Handle any products that might have a category not in the main categories list (e.g. Uncategorized)
  const uncategorizedProducts = filteredProducts.filter(p => !categories.includes(p.category));
  if (uncategorizedProducts.length > 0) {
    productsByCategory['Other Products'] = uncategorizedProducts;
  }

  if (loading) return (
    <div>
      <div style={{ minHeight: '260px', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249,115,22,0.3)', borderTop: '3px solid var(--brand-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Loading products...</p>
        </div>
      </div>
      <div className="page-container">
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
    <div id="products">
      <Hero />

      <div className="page-container">
        <SearchFilter
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          categories={categories}
        />

        {/* Active filter pills */}
        {(searchTerm || selectedCategory || minPrice || maxPrice) && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              <strong style={{ color: 'var(--surface-900)' }}>{filteredProducts.length}</strong> result{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            {searchTerm && (
              <span style={{ padding: '2px 10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '999px', color: 'var(--brand-600)', fontSize: '0.78rem', fontWeight: 600 }}>
                "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span style={{ padding: '2px 10px', background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', borderRadius: '999px', color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>
                {selectedCategory}
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span style={{ padding: '2px 10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', color: '#059669', fontSize: '0.78rem', fontWeight: 600 }}>
                {minPrice ? `LKR ${minPrice}` : '0'} - {maxPrice ? `LKR ${maxPrice}` : 'Any'}
              </span>
            )}
          </div>
        )}

        {/* New Arrivals — horizontal carousel */}
        {newArrivals.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader title="New Arrivals" count={newArrivals.length} />
            <ProductCarousel products={newArrivals} sectionId="new-arrivals-carousel" />
          </section>
        )}

        {/* All Products — horizontal carousel */}
        {otherProducts.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <SectionHeader title={newArrivals.length > 0 ? 'All Products' : 'Our Products'} count={otherProducts.length} />
            <ProductCarousel products={otherProducts} sectionId="all-products-carousel" />
          </section>
        )}

        {/* Mid-page Lifestyle Banner */}
        <PromoBanner />

        {/* Category Sections — dynamically looped */}
        {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
          <section key={categoryName} style={{ marginBottom: '56px' }}>
            <SectionHeader title={categoryName} count={categoryProducts.length} />
            <ProductCarousel products={categoryProducts} sectionId={`carousel-${categoryName.replace(/\s+/g, '-').toLowerCase()}`} />
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