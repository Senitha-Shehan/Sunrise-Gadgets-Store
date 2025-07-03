import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block h-full"
      aria-label={`View details for ${product.name}`}
    >
      <article className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
        hover:shadow-xl hover:border-gray-200 transition-all duration-500 
        transform hover:-translate-y-2 h-full flex flex-col
        ${product.newArrival ? 'ring-1 ring-emerald-200 shadow-emerald-50' : ''}
      `}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <img
              src={`http://localhost:5000${product.images[0].url}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {product.newArrival && (
              <span className="
                bg-gradient-to-r from-emerald-500 to-green-500 text-white 
                px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg
                backdrop-blur-sm
              ">
                ✨ New Arrival
              </span>
            )}
            {product.images && product.images.length > 1 && (
              <span className="
                bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 
                rounded-full text-xs font-medium
              ">
                +{product.images.length - 1} more
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="
            absolute inset-0 bg-black/0 group-hover:bg-black/5 
            transition-all duration-300 pointer-events-none
          " />
        </div>

        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="
            text-xl font-bold text-gray-900 mb-3 
            group-hover:text-blue-600 transition-colors duration-300
            line-clamp-2 leading-tight
          ">
            {product.name}
          </h3>

          {/* Brand and Category Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.brand && (
              <span className="
                bg-blue-50 text-blue-700 px-3 py-1 rounded-full 
                text-xs font-medium border border-blue-100
              ">
                {product.brand}
              </span>
            )}
            {product.category && (
              <span className="
                bg-gray-50 text-gray-700 px-3 py-1 rounded-full 
                text-xs font-medium border border-gray-100
              ">
                {product.category}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">
              {truncateDescription(product.description, 120)}
            </p>
          )}

          {/* Price and CTA */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="
              flex items-center text-blue-600 font-medium text-sm
              group-hover:text-blue-700 transition-colors duration-200
            ">
              <span className="mr-2">View Details</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;