function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Business Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Sunrise Gadgets</h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for quality products and innovative gadgets. 
              We bring you the latest and greatest items to enhance your lifestyle.
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📍 123 Business Street, City, State 12345</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ info@sunrisegadgets.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/add" className="text-gray-300 hover:text-white transition-colors">Add Product</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Electronics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home & Garden</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sports & Outdoors</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Health & Beauty</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Sunrise Gadgets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 