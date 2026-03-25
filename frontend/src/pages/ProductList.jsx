import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import ProductCard from '../components/ProductCard';

const categories = [
  "4K Projectors", "HD/Full HD Projectors", "Laser Projectors",
  "Mini/Portable Projectors", "Outdoor Projectors", "Accessories",
  "Digital Smart Boards", "Smart Projectors", "Digital Cinema Projectors",
  "Mapping Projectors", "Gobo Projectors", "Audio Systems",
  "Used Products", "Projector Screens", "Uncategorized"
];

const PRODUCTS_PER_PAGE = 8;

function SkeletonCard() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      border: '1.5px solid rgba(226,232,240,0.8)',
      overflow: 'hidden',
      height: '340px',
    }}>
      <div className="skeleton" style={{ height: '55%', width: '100%' }} />
      <div style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '12px', width: '50%', borderRadius: '6px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: '6px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '12px', width: '65%', borderRadius: '6px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '18px', width: '40%', borderRadius: '6px' }} />
      </div>
    </div>
  );
}

function SectionHeader({ title, count, page, totalPages, onPrev, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div className="section-rule" />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            color: 'var(--surface-900)',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            {title}
          </h2>
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: '999px',
          color: 'var(--brand-600)',
          fontSize: '0.8rem',
          fontWeight: 700,
        }}>
          {count}
        </span>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onPrev}
            disabled={page === 0}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1.5px solid var(--surface-200)',
              background: page === 0 ? 'var(--surface-50)' : 'white',
              color: page === 0 ? '#94a3b8' : 'var(--surface-700)',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minHeight: 'auto',
            }}
            onMouseEnter={e => { if (page !== 0) { e.currentTarget.style.borderColor='var(--brand-500)'; e.currentTarget.style.color='var(--brand-500)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--surface-200)'; e.currentTarget.style.color=page===0?'#94a3b8':'var(--surface-700)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, minWidth: '40px', textAlign: 'center' }}>
            {page + 1}/{totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={page >= totalPages - 1}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1.5px solid var(--surface-200)',
              background: page >= totalPages - 1 ? 'var(--surface-50)' : 'white',
              color: page >= totalPages - 1 ? '#94a3b8' : 'var(--surface-700)',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minHeight: 'auto',
            }}
            onMouseEnter={e => { if (page < totalPages-1) { e.currentTarget.style.borderColor='var(--brand-500)'; e.currentTarget.style.color='var(--brand-500)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--surface-200)'; e.currentTarget.style.color=page>=totalPages-1?'#94a3b8':'var(--surface-700)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
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
  const [newArrivalsPage, setNewArrivalsPage] = useState(0);
  const [otherProductsPage, setOtherProductsPage] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => { setProducts(res.data); setFilteredProducts(res.data); setLoading(false); })
      .catch(() => { setError('Failed to fetch products'); setLoading(false); });
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
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    filtered = filtered.slice().sort((a, b) => {
      if (a.newArrival !== b.newArrival) return b.newArrival - a.newArrival;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredProducts(filtered);
    setNewArrivalsPage(0);
    setOtherProductsPage(0);
  }, [products, searchTerm, selectedCategory]);

  const newArrivals = filteredProducts.filter(p => p.newArrival);
  const otherProducts = filteredProducts.filter(p => !p.newArrival);

  const paginate = (arr, page) => arr.slice(page * PRODUCTS_PER_PAGE, (page + 1) * PRODUCTS_PER_PAGE);
  const naPages = Math.ceil(newArrivals.length / PRODUCTS_PER_PAGE);
  const otPages = Math.ceil(otherProducts.length / PRODUCTS_PER_PAGE);

  if (loading) return (
    <div>
      <div style={{ minHeight: '300px', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '48px', height: '48px', border: '3px solid rgba(249,115,22,0.3)',
            borderTop: '3px solid var(--brand-500)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Loading products...</p>
        </div>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--surface-900)', marginBottom: '8px' }}>{error}</h2>
        <button onClick={() => window.location.reload()} className="btn-brand" style={{ marginTop: '16px' }}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div id="products">
      <Hero />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Results pill */}
        {(searchTerm || selectedCategory) && (
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Found <strong style={{ color: 'var(--surface-900)' }}>{filteredProducts.length}</strong> result{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            {searchTerm && (
              <span style={{
                padding: '3px 12px', background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.2)', borderRadius: '999px',
                color: 'var(--brand-600)', fontSize: '0.8rem', fontWeight: 600,
              }}>
                "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span style={{
                padding: '3px 12px', background: 'rgba(100,116,139,0.08)',
                border: '1px solid rgba(100,116,139,0.2)', borderRadius: '999px',
                color: '#475569', fontSize: '0.8rem', fontWeight: 600,
              }}>
                {selectedCategory}
              </span>
            )}
          </div>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <SectionHeader
              title="New Arrivals"
              count={newArrivals.length}
              page={newArrivalsPage}
              totalPages={naPages}
              onPrev={() => setNewArrivalsPage(p => Math.max(0, p - 1))}
              onNext={() => setNewArrivalsPage(p => Math.min(naPages - 1, p + 1))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(264px, 1fr))', gap: '24px' }}>
              {paginate(newArrivals, newArrivalsPage).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        {otherProducts.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <SectionHeader
              title={newArrivals.length > 0 ? 'All Products' : 'Our Products'}
              count={otherProducts.length}
              page={otherProductsPage}
              totalPages={otPages}
              onPrev={() => setOtherProductsPage(p => Math.max(0, p - 1))}
              onNext={() => setOtherProductsPage(p => Math.min(otPages - 1, p + 1))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(264px, 1fr))', gap: '24px' }}>
              {paginate(otherProducts, otherProductsPage).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '96px 24px',
            background: 'white',
            borderRadius: '24px',
            border: '1.5px solid var(--surface-100)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--surface-900)', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Try adjusting your search or filter</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
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