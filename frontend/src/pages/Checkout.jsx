import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    notes: ''
  });

  const subtotal = cartTotal;
  const shipping = 500; // Flat rate for demonstration
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      // Construct WhatsApp Message for Admin
      const WA_NUMBER = '94702005088';
      const orderItemsList = cartItems.map(item => `• ${item.name} (x${item.qty})`).join('\n');
      const waMessage = `✨ *NEW ORDER RECEIVED* ✨\n\n` +
                        `*Order ID:* #${savedOrder._id.slice(-6).toUpperCase()}\n` +
                        `*Customer:* ${formData.fullName}\n` +
                        `*Phone:* ${formData.phone}\n` +
                        `*District:* ${formData.district}\n` +
                        `*Address:* ${formData.address}\n\n` +
                        `*Items:*\n${orderItemsList}\n\n` +
                        `*Total: Rs. ${total.toLocaleString()}*\n\n` +
                        `*Notes:* ${formData.notes || 'N/A'}\n\n` +
                        `_Order placed via Sunrise Gadgets Store_`;
      
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      
      setOrderComplete(true);
      clearCart();
      
      // Small delay to let the user see the success state before redirecting
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

    } catch (err) {
      console.error('Order failed', err);
      const errorMsg = err.response?.data?.error || err.message || 'Something went wrong';
      alert(`Failed to place order: ${errorMsg}. Please ensure the server is running and database is connected.`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 text-4xl shadow-xl shadow-emerald-100/50 animate-bounce">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-[#F5F5F5] tracking-tighter mb-4">Order Received!</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-medium">Thank you for your purchase. We've received your order and will contact you shortly for confirmation.</p>
        <button onClick={() => navigate('/')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6 opacity-20">🛒</div>
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="text-cyan-500 font-bold hover:underline">Go back to store</button>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A2E]/50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#F5F5F5] tracking-tighter mb-2">Secure Checkout</h1>
            <p className="text-slate-400 font-medium italic">Complete your purchase at Sunrise Gadgets</p>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span>Cart</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            <span className="text-cyan-500">Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Customer Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#2D2D44] p-8 rounded-[32px] border border-white/10/60 shadow-sm space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center shadow-sm">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F5] tracking-tight leading-tight">Customer Information</h3>
                  <p className="text-xs text-slate-400 font-medium">Where should we send your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5]" placeholder="John Doe" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5]" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5]" placeholder="07x xxxxxxx" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Delivery Address</label>
                  <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5] resize-none" placeholder="123, High Level Road, Colombo 05" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">District</label>
                  <select name="district" required value={formData.district} onChange={handleChange} className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5] appearance-none">
                    <option value="">Select District</option>
                    {['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Order Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full px-5 py-4 bg-[#1A1A2E] border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-[#F5F5F5] resize-none" placeholder="Apartment number, delivery instructions..." />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-8">
            <div className="bg-[#2D2D44] p-8 rounded-[32px] border border-white/10/60 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-[#F5F5F5] tracking-tight mb-8">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-white/5">
                      <img src={item.images?.[0]?.url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#F5F5F5] truncate">{item.name}</div>
                      <div className="text-xs text-slate-400 font-medium">Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-black text-[#F5F5F5]">Rs. {(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="text-[#F5F5F5] font-bold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Shipping</span>
                  <span className="text-[#F5F5F5] font-bold">Rs. {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-lg font-black text-[#F5F5F5]">Total</span>
                  <span className="text-3xl font-black text-cyan-600 tracking-tighter">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-10 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] uppercase tracking-widest text-xs">
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Complete Order</>}
              </button>

              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 grayscale opacity-30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Secure SSL</span>
                </div>
                <div className="flex items-center gap-1.5 grayscale opacity-30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
