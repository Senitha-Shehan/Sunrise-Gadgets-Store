import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProduct from './AddProduct';
import { API_URL } from '../config';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) { navigate('/admin'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setLoading(false);
    } catch { 
      setError('Failed to fetch dashboard data'); 
      setLoading(false); 
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch { alert('Failed to refresh products'); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch { alert('Failed to refresh categories'); }
  };

  const handleLogout = () => { localStorage.removeItem('adminLoggedIn'); localStorage.removeItem('adminLoginTime'); navigate('/admin'); };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await axios.delete(`${API_URL}/products/${id}`); fetchProducts(); }
    catch { alert('Failed to delete product'); }
  };

  const handleEdit = (product) => { setEditingProduct(product); setShowAddForm(true); };
  const handleFormClose = () => { setShowAddForm(false); setEditingProduct(null); fetchProducts(); };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      await axios.post(`${API_URL}/categories`, { name: newCatName });
      setNewCatName('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products using it might lose their grouping.')) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      fetchCategories();
    } catch {
      alert('Failed to delete category');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦' },
    { label: 'New Arrivals', value: products.filter(p => p.newArrival).length, icon: '✨' },
    { label: 'Categories', value: [...new Set(products.map(p => p.category))].length, icon: '🗂️' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(249,115,22,0.2)', borderTop: '3px solid var(--brand-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>⚠️</div>
        <p style={{ color: '#fca5a5', marginBottom: '16px' }}>{error}</p>
        <button onClick={fetchData} className="btn-brand">Retry</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', fontFamily: 'var(--font-sans)' }}>

      {/* Top Bar */}
      <div style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,115,22,0.15)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(249,115,22,0.4)', flexShrink: 0 }}>
                <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>
                  Admin <span style={{ color: 'var(--brand-400)' }}>Dashboard</span>
                </div>
                <div className="nav-tagline" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sunrise Gadgets</div>
              </div>
            </div>
            <div className="admin-topbar-actions">
              <button onClick={() => setShowAddForm(true)} className="btn-brand" style={{ padding: '9px 16px', fontSize: '0.82rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Product
              </button>
              <button onClick={() => navigate('/')}
                style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
              >View Site</button>
              <button onClick={handleLogout}
                style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#fca5a5', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
              >Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-page-container">
        {/* Stats */}
        <div className="admin-stats-grid">
          {stats.map(stat => (
            <div key={stat.label} style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
          {/* Table header */}
          <div className="admin-table-header">
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1rem', margin: 0 }}>Products</h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '2px 0 0' }}>{filteredProducts.length} of {products.length} items</p>
            </div>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="admin-search-input"
                style={{ padding: '8px 14px 8px 34px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor='rgba(249,115,22,0.4)'; e.target.style.background='rgba(255,255,255,0.09)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px' }}>
              <thead>
                <tr>
                  {['Product', 'Brand', 'Category', 'Price', 'Status', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '10px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, rowIdx) => (
                  <tr key={product._id}
                    style={{ background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                  >
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {product.images?.length > 0 ? (
                          <img src={`${API_URL}${product.images[0].url}`} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📦</div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{product.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{product.description?.substring(0, 45)}...</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>{product.brand}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ padding: '3px 9px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '999px', color: '#c4b5fd', fontSize: '0.72rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{product.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-400)', fontWeight: 700, fontSize: '0.85rem' }}>Rs. {parseInt(product.price).toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {product.newArrival ? <span className="badge badge-new" style={{ fontSize: '0.68rem' }}>✨ New</span> : <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEdit(product)}
                          style={{ padding: '5px 12px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '7px', color: '#93c5fd', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', minHeight: 'auto' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(59,130,246,0.12)'}
                        >Edit</button>
                        <button onClick={() => handleDelete(product._id)}
                          style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', color: '#fca5a5', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', minHeight: 'auto' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>No products found
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Card */}
        <div style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden', marginTop: '32px' }}>
          <div className="admin-table-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1rem', margin: 0 }}>Categories</h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '2px 0 0' }}>Manage product categories shown in the dropdown</p>
            </div>
            
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="New Category Name..." 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)}
                style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', outline: 'none', transition: 'all 0.2s', width: '200px' }}
                onFocus={e => { e.target.style.borderColor='rgba(249,115,22,0.4)'; e.target.style.background='rgba(255,255,255,0.09)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; }}
                required
              />
              <button 
                type="submit" 
                disabled={isAddingCat}
                style={{ padding: '8px 16px', background: 'var(--brand-500)', border: 'none', borderRadius: '10px', color: 'white', cursor: isAddingCat ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-sans)', opacity: isAddingCat ? 0.7 : 1 }}
              >
                {isAddingCat ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>

          <div style={{ padding: '16px 20px' }}>
            {categories.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>No categories found in database. Add one above.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map(cat => (
                  <div key={cat._id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                    {cat.name}
                    <button 
                      onClick={() => handleDeleteCategory(cat._id)}
                      style={{ background: 'none', border: 'none', padding: '2px', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}
                      title={`Delete ${cat.name}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ background: 'var(--surface-900)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '24px', width: '100%', maxWidth: '620px', maxHeight: '92dvh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, background: 'var(--surface-900)', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1rem', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleFormClose}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', minHeight: 'auto', padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="admin-modal-inner">
              <AddProduct editingProduct={editingProduct} onSuccess={handleFormClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;