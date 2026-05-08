import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    notes: ''
  });

  const subtotal = cartTotal;
  const shipping = 0;
  const total = subtotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);

    const orderData = {
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        district: formData.district,
        notes: formData.notes
      },
      items: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.images?.[0]?.url
      })),
      summary: {
        subtotal,
        shipping,
        total
      }
    };

    try {
      const response = await axios.post('/orders', orderData);
      const savedOrder = response.data;
      const savedOrderId = savedOrder._id.slice(-6).toUpperCase();
      const orderSnapshot = {
        customer: { ...formData },
        items: cartItems.map(item => ({
          id: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          lineTotal: item.price * item.qty,
          image: item.images?.[0]?.url,
        })),
        subtotal,
        shipping,
        total,
      };
      
      const WA_NUMBER = '94702005088';
      const orderItemsList = cartItems.map(item => `• ${item.name} (x${item.qty})`).join('\n');
      const waMessage = `✨ *NEW ORDER RECEIVED* ✨\n\n` +
                        `*Order ID:* #${savedOrderId}\n` +
                        `*Customer:* ${formData.fullName}\n` +
                        `*Phone:* ${formData.phone}\n` +
                        `*District:* ${formData.district}\n` +
                        `*Address:* ${formData.address}\n\n` +
                        `*Items:*\n${orderItemsList}\n\n` +
                        `*Total: Rs. ${total.toLocaleString()}*\n\n` +
                        `*Notes:* ${formData.notes || 'N/A'}\n\n` +
                        `_Order placed via Sunrise Gadgets Store_`;
      
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      
      setOrderId(savedOrderId);
      setWhatsAppUrl(waUrl);
      setPlacedOrder(orderSnapshot);
      setOrderComplete(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 900);

    } catch (err) {
      console.error('Order failed', err);
      alert(`Failed to place order. Please check your connection.`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    const orderItems = placedOrder?.items || [];
    const orderSubtotal = placedOrder?.subtotal ?? subtotal;
    const orderTotal = placedOrder?.total ?? total;

    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)', padding: '24px' }}>
        <div style={{ 
          maxWidth: '760px', width: '100%', background: 'white', padding: isMobile ? '28px 22px' : '40px', 
          borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)',
          animation: 'fadeInUp 0.6s ease-out', border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr', gap: '24px', alignItems: 'start' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                width: '72px', height: '72px', background: 'var(--brand-50)', color: 'var(--brand-600)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '20px', boxShadow: '0 10px 20px rgba(15, 110, 86, 0.1)'
              }}>
                <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: 'var(--surface-900)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                Order placed
              </h2>
              <p style={{ color: 'var(--surface-600)', lineHeight: 1.7, marginBottom: '20px', fontSize: '1rem', maxWidth: '38rem' }}>
                Thanks, <strong>{formData.fullName}</strong>. Your checkout is saved and the order reference is ready for the team.
                Save the reference below and use WhatsApp to speed up confirmation.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                <span style={{ padding: '8px 14px', borderRadius: '999px', background: 'var(--brand-50)', color: 'var(--brand-700)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Order #{orderId}
                </span>
                <span style={{ padding: '8px 14px', borderRadius: '999px', background: 'var(--surface-50)', color: 'var(--surface-700)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Status: Pending review
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '22px' }}>
                {[
                  { label: 'Placed', state: 'done' },
                  { label: 'Processing', state: 'active' },
                  { label: 'Shipped', state: 'upcoming' },
                  { label: 'Delivered', state: 'upcoming' },
                ].map(step => (
                  <div key={step.label} style={{ padding: '12px 10px', borderRadius: '16px', background: step.state === 'done' ? 'rgba(16,185,129,0.08)' : step.state === 'active' ? 'rgba(6,182,212,0.08)' : 'var(--surface-50)', border: '1px solid', borderColor: step.state === 'done' ? 'rgba(16,185,129,0.18)' : step.state === 'active' ? 'rgba(6,182,212,0.18)' : 'var(--surface-100)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: step.state === 'done' ? '#059669' : step.state === 'active' ? 'var(--brand-700)' : 'var(--surface-400)' }}>{step.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => navigate('/')} className="btn-brand" style={{ width: '100%' }}>
                  Back to Shopping
                </button>
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="btn-brand" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', background: '#25D366' }}>
                  Open WhatsApp confirmation
                </a>
                <p style={{ fontSize: '0.78rem', color: 'var(--surface-400)', marginTop: '4px' }}>
                  If the app does not open automatically, use the WhatsApp button above. Keep this tab open until the chat loads.
                </p>
              </div>
            </div>

            <aside style={{ background: 'var(--surface-50)', borderRadius: '24px', padding: '20px', border: '1px solid var(--surface-100)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--surface-900)', marginBottom: '14px' }}>Order snapshot</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: 'var(--surface-600)' }}>
                <span>Customer</span>
                <strong style={{ color: 'var(--surface-900)' }}>{formData.fullName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: 'var(--surface-600)' }}>
                <span>Items</span>
                <strong style={{ color: 'var(--surface-900)' }}>{orderItems.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: 'var(--surface-600)' }}>
                <span>Subtotal</span>
                <strong style={{ color: 'var(--surface-900)' }}>Rs. {orderSubtotal.toLocaleString()}</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--surface-200)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, color: 'var(--surface-900)' }}>Total</span>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brand-600)' }}>Rs. {orderTotal.toLocaleString()}</strong>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.2 }}>🛍️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--surface-900)', marginBottom: '12px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--surface-500)', marginBottom: '32px' }}>Add some premium gadgets to get started.</p>
        <Link to="/" className="btn-brand">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-50)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header Section */}
      <div style={{ background: 'var(--brand-500)', padding: '60px 0 100px', marginBottom: '-60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Link to="/cart" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none', 
            fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', 
            letterSpacing: '0.1em', marginBottom: '20px', transition: 'all 0.2s' 
          }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Cart
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: isMobile ? '2.5rem' : '3.5rem', color: 'white', letterSpacing: '-0.04em', margin: 0 }}>
            Checkout
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginTop: '8px', fontWeight: 500 }}>
            Complete your order and experience premium tech.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '32px' }}>
          
          {/* Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section style={{ 
              background: 'white', padding: isMobile ? '24px' : '40px', 
              borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--brand-50)', color: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--surface-900)', margin: 0 }}>Customer Details</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={inputStyle} placeholder="Senitha Shehan" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} placeholder="senitha@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="07x xxxxxxx" />
                </div>
                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                  <label style={labelStyle}>Delivery Address</label>
                  <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" style={{ ...inputStyle, resize: 'none' }} placeholder="No 123, Street Name, City" />
                </div>
                <div>
                  <label style={labelStyle}>District</label>
                  <div style={{ position: 'relative' }}>
                    <select name="district" required value={formData.district} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select District</option>
                      {['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--surface-400)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                  <label style={labelStyle}>Order Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" style={{ ...inputStyle, resize: 'none' }} placeholder="Delivery instructions, landmarks etc." />
                </div>
              </div>

              <div style={{ marginTop: '24px', padding: '16px 18px', borderRadius: '16px', background: 'var(--surface-50)', border: '1px solid var(--surface-100)', color: 'var(--surface-600)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                This checkout creates an order record first, then opens WhatsApp so your team can confirm the request with the saved order reference.
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px', height: 'fit-content' }}>
            <section style={{ 
              background: 'white', padding: '32px', borderRadius: 'var(--radius-2xl)', 
              boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(0,0,0,0.05)' 
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--surface-900)', marginBottom: '24px' }}>Order Summary</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', padding: '12px 14px', background: 'rgba(6,182,212,0.06)', borderRadius: '14px', border: '1px solid rgba(6,182,212,0.12)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-700)' }}>Ready to confirm</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--surface-600)' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: 'var(--surface-50)', overflow: 'hidden', border: '1px solid var(--surface-100)', flexShrink: 0 }}>
                      <img src={item.images?.[0]?.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--surface-900)', lineHeight: 1.3, marginBottom: '2px' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--surface-500)', fontWeight: 600 }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--surface-900)' }}>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--surface-100)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--surface-500)', fontWeight: 600 }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--surface-900)' }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--surface-900)' }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-500)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      Rs. {total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || cartItems.length === 0} 
                className="btn-brand" 
                style={{ width: '100%', marginTop: '32px', height: '56px', fontSize: '1rem', boxShadow: 'var(--shadow-brand)' }}
              >
                {loading ? (
                  <div style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  'Confirm Order & Open WhatsApp'
                )}
              </button>

              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Secure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Private</span>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.7rem',
  fontWeight: 800,
  color: 'var(--surface-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'block',
  marginBottom: '8px',
  marginLeft: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  background: 'var(--surface-50)',
  border: '1px solid var(--surface-200)',
  borderRadius: '12px',
  fontSize: '1rem',
  color: 'var(--surface-900)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box'
};

export default Checkout;
