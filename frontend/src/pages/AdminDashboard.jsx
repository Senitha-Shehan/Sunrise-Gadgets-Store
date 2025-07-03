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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin');
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        fetchProducts(); // Refresh the list
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow rounded-b-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <img src="/logo.jpg" alt="Sunrise Gadgets Store Logo" className="w-14 h-14 rounded-full bg-white object-contain shadow-lg" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-600 text-base">Manage your products</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Add New Product
              </button>
              <button
                onClick={() => navigate('/')} 
                className="text-gray-600 hover:text-gray-900 transition-colors font-semibold w-full sm:w-auto"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors font-semibold w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleFormClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <AddProduct 
                editingProduct={editingProduct}
                onSuccess={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="bg-white rounded-2xl shadow p-2 sm:p-6">
          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">All Products ({products.length})</h2>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images && product.images.length > 0 && (
                          <img
                            className="h-12 w-12 rounded-lg object-cover mr-3 border border-gray-200"
                            src={`http://localhost:5000${product.images[0].url}`}
                            alt={product.name}
                          />
                        )}
                        <div>
                          <div className="text-base font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {product.brand}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                      Rs. {product.price}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {product.newArrival && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          New Arrival
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-base font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 font-semibold px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900 font-semibold px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 