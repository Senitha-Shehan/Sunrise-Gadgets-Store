import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        ← Back to Products
      </button>
      
      <div className="bg-white rounded shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {product.images && product.images.length > 0 && (
              <div>
                {/* Main Image */}
                <div className="mb-4">
                  <img 
                    src={`http://localhost:5000${product.images[selectedImage].url}`} 
                    alt={product.name} 
                    className="w-full h-96 object-cover rounded"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 border-2 rounded ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={`http://localhost:5000${image.url}`} 
                          alt={`${product.name} ${index + 1}`} 
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              {product.newArrival && (
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  New Arrival
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-2xl font-bold text-blue-700 mb-4">${product.price}</div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.brand}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.included && product.included.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">What's Included</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.included.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Product Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Brand: <span className="font-semibold text-gray-900">{product.brand}</span></div>
                <div>Category: <span className="font-semibold text-gray-900">{product.category}</span></div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 