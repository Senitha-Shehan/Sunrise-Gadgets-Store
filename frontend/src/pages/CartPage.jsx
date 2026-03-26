import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const WA_NUMBER = '94702005088';

function formatPrice(price) {
  return new Intl.NumberFormat('si-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 0,
  }).format(price);
}

function CartPage() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const buildWhatsAppMessage = () => {
    const lines = cartItems.map(
      item => `• ${item.name} (x${item.qty}) — ${formatPrice(item.price * item.qty)}`
    );
    const msg = [
      `Hello! I'd like to enquire about the following products from Sunrise Gadgets:`,
      '',
      ...lines,
      '',
      `*Total: ${formatPrice(cartTotal)}*`,
      '',
      'Please let me know availability and any special pricing. Thank you!',
    ].join('\n');
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailBody = () => {
    const lines = cartItems.map(
      item => `- ${item.name} (x${item.qty}) — ${formatPrice(item.price * item.qty)}`
    );
    return [
      `Hello Sunrise Gadgets Team,`,
      ``,
      `I would like to enquire about the following products:`,
      ``,
      ...lines,
      ``,
      `Total: ${formatPrice(cartTotal)}`,
      ``,
      `Please let me know the availability and any special pricing.`,
      ``,
      `Thank you!`,
    ].join('\n');
  };

  /* ── Empty State ── */
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--surface-900)', marginBottom: '10px' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>
            Browse our products and add items you're interested in.
          </p>
          <button onClick={() => navigate('/')} className="btn-brand">
            🛍️ Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-50)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--surface-100)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 500, fontSize: '0.875rem', fontFamily: 'var(--font-sans)', minHeight: 'auto' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Continue Shopping
          </button>
          <button onClick={clearCart}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-sans)', minHeight: 'auto' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            Clear All
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--surface-900)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
          🛒 My Cart
        </h1>
        <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.9rem' }}>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} — review and send an enquiry
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--surface-100)', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {/* Image */}
                <div style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', background: 'var(--surface-50)', flexShrink: 0, border: '1px solid var(--surface-100)' }}>
                  {item.images?.length > 0 ? (
                    <img src={`http://localhost:5000${item.images[0].url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--brand-600)', fontWeight: 600, marginBottom: '2px' }}>{item.brand}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--surface-900)', fontSize: '0.95rem', lineHeight: 1.3, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid var(--surface-200)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item._id, item.qty - 1)}
                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', minHeight: 'auto', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >−</button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--surface-900)', borderLeft: '1px solid var(--surface-200)', borderRight: '1px solid var(--surface-200)', lineHeight: '32px' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}
                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', minHeight: 'auto', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >+</button>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--brand-600)', fontSize: '1rem' }}>
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => removeFromCart(item._id)}
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', flexShrink: 0, minHeight: 'auto', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div style={{ background: 'white', borderRadius: '20px', border: '1.5px solid var(--surface-100)', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-900)', marginBottom: '16px' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600, color: 'var(--surface-900)', flexShrink: 0 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--surface-100)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--surface-900)', fontSize: '1rem' }}>Estimated Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--brand-600)', fontSize: '1.3rem', letterSpacing: '-0.03em' }}>{formatPrice(cartTotal)}</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.6, background: 'var(--surface-50)', padding: '10px 12px', borderRadius: '10px' }}>
              💡 This is a quote enquiry. Our team will confirm pricing & availability via WhatsApp or email.
            </p>

            {/* WhatsApp CTA */}
            <a href={buildWhatsAppMessage()} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', background: '#25D366', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '10px', boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1ebe5d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send Enquiry via WhatsApp
            </a>

            {/* Email fallback */}
            <a href={`mailto:info@sunrisegadgets.lk?subject=Product%20Enquiry&body=${encodeURIComponent(buildEmailBody())}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: 'var(--surface-50)', color: '#475569', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-sans)', border: '1.5px solid var(--surface-200)', transition: 'all 0.2s', boxSizing: 'border-box' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-500)'; e.currentTarget.style.color = 'var(--brand-600)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-200)'; e.currentTarget.style.color = '#475569'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Send Email Enquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
