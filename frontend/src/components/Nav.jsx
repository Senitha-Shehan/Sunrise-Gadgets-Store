import { Link } from 'react-router-dom';
import { useState } from 'react';

const sidebarLinks = [
  { to: '/', label: 'Home' },
  { to: '/add', label: 'Add Product' },
  { to: '#', label: 'About Us' },
  { to: '#', label: 'Contact' },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="Sunrise Gadgets Store Logo" className="w-12 h-12 rounded-full bg-white object-contain shadow" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Sunrise Gadgets</span>
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden ml-2 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Navigation Links (desktop only) */}
            <div className={`w-full md:w-auto md:flex items-center space-x-8 mt-4 md:mt-0 hidden md:block`}>
              <Link 
                to="/" 
                className="block md:inline text-gray-700 hover:text-blue-600 font-semibold transition-colors py-3 md:py-0 text-lg md:text-base px-4 md:px-0 rounded-xl md:rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Products
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`} onClick={() => setMenuOpen(false)} />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Sunrise Gadgets Store Logo" className="w-10 h-10 rounded-full bg-white object-contain shadow" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Sunrise Gadgets</span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-6 py-6 space-y-2">
          {sidebarLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-lg font-semibold text-gray-700 hover:text-blue-600 rounded-xl px-4 py-3 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8 pt-2 border-t border-gray-100 text-sm text-gray-500">
          <div className="mb-2 font-semibold text-gray-700">Contact</div>
          <div className="mb-1">📞 (555) 123-4567</div>
          <div className="mb-1">✉️ info@sunrisegadgets.com</div>
          <div>📍 123 Business Street, City</div>
        </div>
      </aside>
    </>
  );
}

export default Nav; 