import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto pt-8 pb-4 px-2 sm:px-6 pb-[env(safe-area-inset-bottom)] hidden sm:block">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-16">
          {/* Brand & Description */}
          <div className="flex-1 mb-8 md:mb-0 flex flex-col items-start">
            <img src="/logo.jpg" alt="Sunrise Gadgets Store Logo" className="w-20 h-20 mb-4 rounded-full bg-white object-contain shadow-lg" />
            <span className="text-2xl font-bold text-white mb-2 tracking-tight">Sunrise Gadgets Store</span>
            <p className="text-gray-400 mb-4 max-w-xs text-base leading-relaxed">
              Your trusted source for quality products and innovative gadgets. We bring you the latest and greatest items to enhance your lifestyle.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors text-2xl"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-300 transition-colors text-2xl"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition-colors text-2xl"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-500 transition-colors text-2xl"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Home</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">About Us</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Electronics</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Home & Garden</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Sports & Outdoors</a></li>
                <li><a href="#" className="block text-gray-300 hover:text-white transition-colors py-3 rounded-lg text-base">Health & Beauty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300 text-base">
                <li>📍 123 Business Street, City, State 12345</li>
                <li>📞 (555) 123-4567</li>
                <li>✉️ info@sunrisegadgets.com</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Sunrise Gadgets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 