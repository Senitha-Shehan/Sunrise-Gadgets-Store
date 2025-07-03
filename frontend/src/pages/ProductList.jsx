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
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
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
  }, [products, searchTerm, selectedCategory]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
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