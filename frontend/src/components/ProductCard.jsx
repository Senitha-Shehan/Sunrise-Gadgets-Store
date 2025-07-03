import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link 
      to={`/product/${product._id}`}
      className="group block"
    >
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${product.newArrival ? 'ring-2 ring-green-500' : ''}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {product.images && product.images.length > 0 && (
            <img 
              src={`http://localhost:5000${product.images[0].url}`} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
            />
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {product.newArrival && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                New Arrival
              </span>
            )}
            {product.images && product.images.length > 1 && (
              <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                +{product.images.length - 1} more
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Brand and Category */}
          <div className="flex gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {product.brand}
            </span>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          </div>
          
          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <span className="text-gray-400 text-sm">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard; 