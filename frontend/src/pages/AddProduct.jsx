import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct({ editingProduct, onSuccess }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [newArrival, setNewArrival] = useState(false);
  const [included, setIncluded] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "4K Projectors",
    "HD/Full HD Projectors",
    "Laser Projectors",
    "Mini/Portable Projectors",
    "Outdoor Projectors",
    "Accessories",
    "Digital Smart Boards",
    "Smart Projectors",
    "Digital Cinema Projectors",
    "Mapping Projectors",
    "Gobo Projectors",
    "Audio Systems",
    "Used Products",
    "Projector Screens",
    "Uncategorized"
  ];

  // Populate form if editing
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setBrand(editingProduct.brand || '');
      setCategory(editingProduct.category || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price?.toString() || '');
      setNewArrival(editingProduct.newArrival || false);
      setIncluded(editingProduct.included?.join(', ') || '');
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      formData.append('newArrival', newArrival);
      formData.append('included', included);

      // Append multiple images
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      let response;
      if (editingProduct) {
        // Update existing product
        response = await axios.put(`http://localhost:5000/products/${editingProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Add new product
        response = await axios.post('http://localhost:5000/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      setSuccess(true);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingProduct ? 'Edit Product' : 'Add Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input 
            type="text" 
            className="w-full border rounded px-3 py-2" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <input 
            type="text" 
            className="w-full border rounded px-3 py-2" 
            value={brand} 
            onChange={e => setBrand(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select 
            className="w-full border rounded px-3 py-2" 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea 
            className="w-full border rounded px-3 py-2" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input 
            type="number" 
            className="w-full border rounded px-3 py-2" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            required 
            min="0" 
            step="0.01" 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-1">
            Images {editingProduct ? '(Optional - only upload new images)' : '(Max 5)'}
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            className="w-full border rounded px-3 py-2" 
            onChange={handleImageChange} 
            required={!editingProduct}
          />
          <p className="text-sm text-gray-500 mt-1">
            Selected: {images.length} image(s)
          </p>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="newArrival"
            className="mr-2" 
            checked={newArrival} 
            onChange={e => setNewArrival(e.target.checked)} 
          />
          <label htmlFor="newArrival" className="font-semibold">New Arrival</label>
        </div>
        
        <div>
          <label className="block font-semibold mb-1">What's Included in the Box</label>
          <textarea 
            className="w-full border rounded px-3 py-2" 
            value={included} 
            onChange={e => setIncluded(e.target.value)} 
            placeholder="Enter items separated by commas or new lines (e.g., Product, Manual, Charger, Warranty Card)"
            rows="3"
          />
          <p className="text-sm text-gray-500 mt-1">
            List all items that come with the product
          </p>
        </div>
        
        {error && <div className="text-red-500">{error}</div>}
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1" 
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
          
          {onSuccess && (
            <button 
              type="button"
              onClick={onSuccess}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddProduct; 