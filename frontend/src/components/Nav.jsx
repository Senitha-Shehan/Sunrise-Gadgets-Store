import { Link } from 'react-router-dom';
import { useState } from 'react';

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="Sunrise Gadgets Store Logo" className="w-10 h-10 rounded-full bg-white object-contain shadow" />
            <span className="text-xl font-bold text-gray-900">Sunrise Gadgets Store</span>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation Links */}
          <div className={`w-full md:w-auto md:flex items-center space-x-6 mt-4 md:mt-0 ${menuOpen ? 'block' : 'hidden'} md:block`}>
            <Link 
              to="/" 
              className="block md:inline text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 md:py-0"
            >
              Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav; 