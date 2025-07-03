import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
          {/* Brand & Description */}
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <span className="text-2xl font-bold text-white">Sunrise Gadgets</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-xs">
              Your trusted source for quality products and innovative gadgets. We bring you the latest and greatest items to enhance your lifestyle.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors"><FaFacebook size={22} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-300 transition-colors"><FaTwitter size={22} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition-colors"><FaInstagram size={22} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-500 transition-colors"><FaLinkedin size={22} /></a>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="block text-gray-300 hover:text-white transition-colors py-1">Home</a></li>
                <li><a href="/add" className="block text-gray-300 hover:text-white transition-colors py-1">Add Product</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">About Us</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">Electronics</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">Home & Garden</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">Sports & Outdoors</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-1">Health & Beauty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📍 123 Business Street, City, State 12345</li>
                <li>📞 (555) 123-4567</li>
                <li>✉️ info@sunrisegadgets.com</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Sunrise Gadgets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 