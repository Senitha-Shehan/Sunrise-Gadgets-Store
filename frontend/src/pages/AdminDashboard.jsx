import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProduct from './AddProduct';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) { navigate('/admin'); return; }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      setProducts(res.data);
      setLoading(false);
    } catch {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => { setEditingProduct(product); setShowAddForm(true); };
  const handleFormClose = () => { setShowAddForm(false); setEditingProduct(null); fetchProducts(); };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦', color: '#3b82f6' },
    { label: 'New Arrivals', value: products.filter(p => p.newArrival).length, icon: '✨', color: '#10b981' },
    { label: 'Categories', value: [...new Set(products.map(p => p.category))].length, icon: '🗂️', color: '#8b5cf6' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(249,115,22,0.2)', borderTop: '3px solid var(--brand-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <p style={{ color: '#fca5a5' }}>{error}</p>
        <button onClick={fetchProducts} className="btn-brand" style={{ marginTop: '16px' }}>Retry</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', fontFamily: 'var(--font-sans)' }}>
      {/* Top Bar */}
      <div style={{
        background: 'rgba(15,23,42,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(249,115,22,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(249,115,22,0.4)', flexShrink: 0 }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: '1rem' }}>
                Admin <span style={{ color: 'var(--brand-400)' }}>Dashboard</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sunrise Gadgets</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-brand"
              style={{ padding: '10px 20px', fontSize: '0.875rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '9px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500, fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '9px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px', color: '#fca5a5', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500, fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px 24px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Products Table Card */}
        <div style={{
          background: 'rgba(30,41,59,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1.1rem', margin: 0 }}>
                Products
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: '2px 0 0' }}>{filteredProducts.length} of {products.length} items</p>
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '9px 16px 9px 38px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '220px',
                  transition: 'all 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor='rgba(249,115,22,0.4)'; e.target.style.background='rgba(255,255,255,0.09)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Product', 'Brand', 'Category', 'Price', 'Status', 'Actions'].map(col => (
                    <th key={col} style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      color: 'rgba(255,255,255,0.35)',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, rowIdx) => (
                  <tr
                    key={product._id}
                    style={{
                      background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                  >
                    {/* Product */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {product.images?.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.images[0].url}`}
                            alt={product.name}
                            style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📦</div>
                        )}
                        <div>
                          <div style={{ color: 'white', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }}>
                            {product.name}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }}>
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Brand */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                      {product.brand}
                    </td>
                    {/* Category */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{
                        padding: '3px 10px', background: 'rgba(139,92,246,0.12)',
                        border: '1px solid rgba(139,92,246,0.2)', borderRadius: '999px',
                        color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap',
                      }}>
                        {product.category}
                      </span>
                    </td>
                    {/* Price */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-400)', fontWeight: 700 }}>
                        Rs. {parseInt(product.price).toLocaleString()}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {product.newArrival ? (
                        <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>✨ New</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>—</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            padding: '6px 14px', background: 'rgba(59,130,246,0.12)',
                            border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px',
                            color: '#93c5fd', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                            fontFamily: 'var(--font-sans)', transition: 'all 0.2s', minHeight: 'auto',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(59,130,246,0.12)'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          style={{
                            padding: '6px 14px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                            color: '#fca5a5', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                            fontFamily: 'var(--font-sans)', transition: 'all 0.2s', minHeight: 'auto',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: 'var(--surface-900)',
            border: '1px solid rgba(249,115,22,0.15)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            animation: 'fadeInUp 0.3s ease',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              position: 'sticky',
              top: 0,
              background: 'var(--surface-900)',
              zIndex: 1,
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1.1rem', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleFormClose}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', width: '36px', height: '36px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', minHeight: 'auto', padding: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ padding: '28px' }}>
              <AddProduct editingProduct={editingProduct} onSuccess={handleFormClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;