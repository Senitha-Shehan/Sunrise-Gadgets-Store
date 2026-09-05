import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Nav from './components/Nav';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';

function App() {
  const location = useLocation();

  // Normalize double slashes in path (e.g. //admin -> /admin)
  if (location.pathname.includes('//')) {
    const cleanPath = location.pathname.replace(/\/+/g, '/');
    return <Navigate to={`${cleanPath}${location.search}`} replace />;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="app-shell">
        {!isAdminRoute && <Nav />}
        <main style={{ flex: 1 }} className="page-transition" key={location.pathname}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppButton />}
      </div>
    </CartProvider>
  );
}

export default App;
