import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import ProductCard from '../components/ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newArrivalsPage, setNewArrivalsPage] = useState(0);
  const [otherProductsPage, setOtherProductsPage] = useState(0);

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

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name && product.name.toLowerCase().includes(searchLower);
        const brandMatch = product.brand && product.brand.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchLower);
        return nameMatch || brandMatch || descriptionMatch;
      });
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== '') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort: newArrival first, then by createdAt descending
    filtered = filtered.slice().sort((a, b) => {
      if (a.newArrival === b.newArrival) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.newArrival - a.newArrival;
    });

    setFilteredProducts(filtered);
    
    // Reset pagination when search or category changes
    setNewArrivalsPage(0);
    setOtherProductsPage(0);
    
    // Debug search
    console.log('Search debug:', {
      searchTerm,
      selectedCategory,
      originalProducts: products.length,
      filteredProducts: filtered.length,
      searchResults: searchTerm ? filtered.filter(product => {
        const searchLower = searchTerm.toLowerCase().trim();
        const nameMatch = product.name && product.name.toLowerCase().includes(searchLower);
        const brandMatch = product.brand && product.brand.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchLower);
        return nameMatch || brandMatch || descriptionMatch;
      }).length : 0
    });
  }, [products, searchTerm, selectedCategory]);

  // Separate new arrivals and other products
  const newArrivals = filteredProducts.filter(product => product.newArrival);
  const otherProducts = filteredProducts.filter(product => !product.newArrival);

  // Pagination settings - reduced for testing
  const productsPerPage = 4; // Reduced from 8 to 4 for testing
  const newArrivalsPages = Math.ceil(newArrivals.length / productsPerPage);
  const otherProductsPages = Math.ceil(otherProducts.length / productsPerPage);

  // Get paginated products
  const getPaginatedProducts = (products, page) => {
    const start = page * productsPerPage;
    return products.slice(start, start + productsPerPage);
  };

  const handleNewArrivalsNext = () => {
    console.log('Next clicked, current page:', newArrivalsPage, 'total pages:', newArrivalsPages);
    if (newArrivalsPage < newArrivalsPages - 1) {
      setNewArrivalsPage(newArrivalsPage + 1);
    }
  };

  const handleNewArrivalsPrev = () => {
    console.log('Prev clicked, current page:', newArrivalsPage);
    if (newArrivalsPage > 0) {
      setNewArrivalsPage(newArrivalsPage - 1);
    }
  };

  const handleOtherProductsNext = () => {
    console.log('Other Next clicked, current page:', otherProductsPage, 'total pages:', otherProductsPages);
    if (otherProductsPage < otherProductsPages - 1) {
      setOtherProductsPage(otherProductsPage + 1);
    }
  };

  const handleOtherProductsPrev = () => {
    console.log('Other Prev clicked, current page:', otherProductsPage);
    if (otherProductsPage > 0) {
      setOtherProductsPage(otherProductsPage - 1);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Debug info
  console.log('Debug info:', {
    totalProducts: filteredProducts.length,
    newArrivals: newArrivals.length,
    otherProducts: otherProducts.length,
    newArrivalsPages,
    otherProductsPages,
    newArrivalsPage,
    otherProductsPage
  });

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
          </h2>
          {(searchTerm || selectedCategory) && (
            <p className="text-gray-600">
              {searchTerm && `Searching for "${searchTerm}"`}
              {searchTerm && selectedCategory && ' in '}
              {selectedCategory && `Category: ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-gray-900"> New Arrivals ({newArrivals.length})</h3>
                <div className="ml-4 flex-1 h-px bg-gray-200 w-32"></div>
              </div>
              {/* Always show navigation for testing */}
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  aria-label="Previous New Arrivals" 
                  role="button" 
                  className={`owl-prev p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors ${newArrivalsPage === 0 ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNewArrivalsPrev}
                  disabled={newArrivalsPage === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">
                  {newArrivalsPage + 1} / {Math.max(1, newArrivalsPages)}
                </span>
                <button 
                  type="button" 
                  aria-label="Next New Arrivals" 
                  role="button" 
                  className={`owl-next p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors ${newArrivalsPage >= newArrivalsPages - 1 ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNewArrivalsNext}
                  disabled={newArrivalsPage >= newArrivalsPages - 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getPaginatedProducts(newArrivals, newArrivalsPage).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Other Products Section */}
        {otherProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-gray-900">Products for You ({otherProducts.length})</h3>
                <div className="ml-4 flex-1 h-px bg-gray-200 w-32"></div>
              </div>
              {/* Always show navigation for testing */}
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  aria-label="Previous Products" 
                  role="button" 
                  className={`owl-prev p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors ${otherProductsPage === 0 ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleOtherProductsPrev}
                  disabled={otherProductsPage === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">
                  {otherProductsPage + 1} / {Math.max(1, otherProductsPages)}
                </span>
                <button 
                  type="button" 
                  aria-label="Next Products" 
                  role="button" 
                  className={`owl-next p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors ${otherProductsPage >= otherProductsPages - 1 ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleOtherProductsNext}
                  disabled={otherProductsPage >= otherProductsPages - 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getPaginatedProducts(otherProducts, otherProductsPage).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList; 