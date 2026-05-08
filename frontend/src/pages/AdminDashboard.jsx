import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProduct from './AddProduct';

const ORDER_STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const ORDER_STATUS_META = {
  Pending: { label: 'Pending review', className: 'bg-brand-50 text-brand-600 border-brand-100', step: 0 },
  Processing: { label: 'Processing', className: 'bg-blue-50 text-blue-600 border-blue-100', step: 1 },
  Shipped: { label: 'Shipped', className: 'bg-amber-50 text-amber-600 border-amber-100', step: 2 },
  Delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-600 border-emerald-100', step: 3 },
  Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-100', step: -1 },
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const formatOrderId = (id) => `#${String(id || '').slice(-6).toUpperCase()}`;

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notice, setNotice] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        axios.get('/products'),
        axios.get('/categories'),
        axios.get('/orders'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);
    } catch {
      // Keep the UI responsive even if one request fails.
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setUpdatingOrderId(id);
      const res = await axios.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(order => (order._id === id ? res.data : order)));
      if (selectedOrder?._id === id) {
        setSelectedOrder(res.data);
      }
      setNotice(`Order ${formatOrderId(id)} moved to ${status}.`);
      window.setTimeout(() => setNotice(''), 2500);
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchData();
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      await axios.post('/categories', { name: newCatName });
      setNewCatName('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchData();
    } catch {
      alert('Failed to delete category');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders
    .filter(order =>
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(order => statusFilter === 'All' || order.status === statusFilter);

  const stats = {
    orders: orders.length,
    pending: orders.filter(order => order.status === 'Pending').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    revenue: orders.reduce((sum, order) => sum + (order.summary?.total || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-60vh flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans selection:bg-brand-100 selection:text-brand-900">
      <aside className="w-full lg:w-72 bg-white border-b lg:border-r border-slate-200 lg:h-screen lg:sticky lg:top-0 z-50">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">S</div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">Sunrise</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Studio</p>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {[
              { id: 'inventory', label: 'Inventory', icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
              { id: 'orders', label: 'Orders', icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, badge: stats.pending },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all shrink-0 lg:shrink ${activeTab === tab.id ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge > 0 && <span className="ml-auto px-1.5 py-0.5 bg-brand-500 text-white rounded-full text-[9px]">{tab.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 hidden lg:block">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold text-sm hover:text-slate-900 transition-all">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              View Storefront
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:text-red-600 transition-all">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-10 max-w-[1440px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">{activeTab}</h2>
            <p className="text-slate-400 font-medium text-sm mt-1">Everything you need to run your business.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder={activeTab === 'orders' ? 'Search orders or customer name...' : 'Search products or collections...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[20px] text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {activeTab === 'inventory' && (
              <button onClick={() => { setEditingProduct(null); setShowAddForm(true); }} className="px-6 py-3.5 bg-slate-900 text-white rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 shrink-0">
                New Product
              </button>
            )}
          </div>
        </header>

        {notice && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
            {notice}
          </div>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              {[
                { label: 'All Orders', value: stats.orders, tone: 'bg-white' },
                { label: 'Pending Review', value: stats.pending, tone: 'bg-brand-50' },
                { label: 'Processing', value: stats.processing, tone: 'bg-blue-50' },
                { label: 'Revenue', value: formatCurrency(stats.revenue), tone: 'bg-emerald-50' },
              ].map(card => (
                <div key={card.label} className={`rounded-[24px] border border-slate-200 p-5 shadow-sm ${card.tone}`}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {['All', ...ORDER_STATUS_OPTIONS].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border ${statusFilter === status ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'inventory' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pricing</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredProducts.length > 0 ? filteredProducts.map(product => (
                          <tr key={product._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                <img src={product.images?.[0]?.url} alt={product.name} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-100 shadow-sm" />
                                <div>
                                  <div className="font-bold text-slate-900 text-base">{product.name}</div>
                                  <div className="text-xs font-bold text-brand-500 uppercase tracking-tight">{product.brand} • {product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {product.inStock ? 'Active' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="font-black text-slate-900">{formatCurrency(product.price)}</div>
                              {product.originalPrice > product.price && <div className="text-[10px] text-slate-400 line-through">{formatCurrency(product.originalPrice)}</div>}
                            </td>
                            <td className="px-8 py-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setEditingProduct(product); setShowAddForm(true); }} className="p-2.5 bg-slate-50 rounded-xl hover:bg-brand-50 hover:text-brand-500 transition-all">
                                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-8 py-16 text-center text-slate-500">No products match your search.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Collections</h3>
                  <div className="space-y-3 mb-8">
                    {categories.map(category => (
                      <div key={category._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group transition-all">
                        <span className="text-sm font-bold text-slate-700">{category.name}</span>
                        <button onClick={() => handleDeleteCategory(category._id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <input
                      type="text"
                      placeholder="New collection..."
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-brand-500 outline-none transition-all"
                    />
                    <button disabled={isAddingCat} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-200">
                      {isAddingCat ? 'Saving...' : 'Add Collection'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1100px]">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-mono text-xs text-slate-400 mb-1">{formatOrderId(order._id)}</div>
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900 text-base">{order.customer?.name}</div>
                          <a
                            href={`https://wa.me/${String(order.customer?.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-100 transition-all shadow-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Connect to WhatsApp
                          </a>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order._id}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl appearance-none cursor-pointer outline-none border transition-all disabled:opacity-60 ${ORDER_STATUS_META[order.status]?.className || 'bg-slate-50 text-slate-600 border-slate-100'}`}
                          >
                            {ORDER_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="font-black text-slate-900 text-lg tracking-tight leading-none">{formatCurrency(order.summary?.total)}</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.items?.length || 0} Product(s)</div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button onClick={() => setSelectedOrder(order)} className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                            Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center text-slate-500">
                          No orders match the current search or status filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 lg:p-8 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-slate-400 mb-2">{formatOrderId(selectedOrder._id)}</div>
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">{selectedOrder.customer?.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">Placed {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ORDER_STATUS_META[selectedOrder.status]?.className || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {ORDER_STATUS_META[selectedOrder.status]?.label || selectedOrder.status}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-200">
                  {formatCurrency(selectedOrder.summary?.total)}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-200">
                  {selectedOrder.items?.length || 0} items
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => { updateOrderStatus(selectedOrder._id, 'Processing'); setSelectedOrder(null); }}
                  className="px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm bg-slate-900 text-white hover:bg-slate-800"
                  disabled={updatingOrderId === selectedOrder._id}
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => { updateOrderStatus(selectedOrder._id, 'Cancelled'); setSelectedOrder(null); }}
                  className="px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm bg-red-600 text-white hover:bg-red-500"
                  disabled={updatingOrderId === selectedOrder._id}
                >
                  Cancel Order
                </button>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                  const isCancelled = selectedOrder.status === 'Cancelled';
                  const isActive = !isCancelled && ORDER_STATUS_META[selectedOrder.status]?.step === index;
                  const isDone = !isCancelled && ORDER_STATUS_META[selectedOrder.status]?.step > index;

                  return (
                    <div key={step} className={`rounded-2xl border p-3 text-center ${isDone ? 'bg-emerald-50 border-emerald-100' : isActive ? 'bg-brand-50 border-brand-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-emerald-600' : isActive ? 'text-brand-600' : 'text-slate-400'}`}>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/40 custom-scrollbar">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight mb-5">Customer & order details</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Order ID</span>
                      <span className="font-bold text-slate-900">{formatOrderId(selectedOrder._id)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</span>
                      <span className="font-bold text-slate-900">{ORDER_STATUS_META[selectedOrder.status]?.label || selectedOrder.status}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">District</span>
                      <span className="font-bold text-slate-900">{selectedOrder.customer?.district}</span>
                    </div>
                    <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <div className="font-black text-slate-900">{selectedOrder.customer?.name}</div>
                      <div className="text-slate-600">{selectedOrder.customer?.address}</div>
                      <div className="text-slate-600">{selectedOrder.customer?.email}</div>
                      <div className="text-slate-600">{selectedOrder.customer?.phone}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Notes</div>
                      <div className="font-semibold text-slate-700">{selectedOrder.customer?.notes || 'No notes provided.'}</div>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                      <span className="font-bold text-slate-900">{formatCurrency(selectedOrder.summary?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Total</span>
                      <span className="font-black text-slate-900 text-lg">{formatCurrency(selectedOrder.summary?.total)}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Order items</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedOrder.items?.length || 0} items</span>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-900 truncate">{item.name}</div>
                          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Qty {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{formatCurrency(item.price)} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="text-center pt-6 pb-2">
                <button onClick={() => setSelectedOrder(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowAddForm(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="p-8 lg:p-10 flex justify-between items-center bg-white shrink-0 border-b border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                {editingProduct ? 'Update Inventory' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddForm(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
              <AddProduct editingProduct={editingProduct} onSuccess={() => { setShowAddForm(false); fetchData(); }} />
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fade-in 0.3s ease-out; }
      ` }} />
    </div>
  );
}

export default AdminDashboard;
