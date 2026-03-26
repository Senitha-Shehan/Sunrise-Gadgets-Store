import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const inputStyle = (hasError) => ({
  width: '100%',
  padding: '11px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: hasError ? '1.5px solid rgba(239,68,68,0.4)' : '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: 'white',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
});

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '7px',
};

function FieldGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function AddProduct({ editingProduct, onSuccess }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [newArrival, setNewArrival] = useState(false);
  const [included, setIncluded] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    // Fetch dynamic categories from the backend
    axios.get('http://localhost:5000/categories')
      .then(res => setCategoriesList(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setBrand(editingProduct.brand || '');
      setCategory(editingProduct.category || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price?.toString() || '');
      setNewArrival(editingProduct.newArrival || false);
      setIncluded(editingProduct.included?.join(', ') || '');
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      formData.append('newArrival', newArrival);
      formData.append('included', included);
      images.forEach(img => formData.append('images', img));

      if (editingProduct) {
        await axios.put(`http://localhost:5000/products/${editingProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('http://localhost:5000/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setLoading(false);
      if (onSuccess) onSuccess(); else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      setLoading(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = 'rgba(249,115,22,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.08)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255,255,255,0.05)';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Row: Name + Brand */}
      <div className="form-row-2">
        <FieldGroup label="Product Name *">
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Epson EB-S41" style={inputStyle()} onFocus={focusStyle} onBlur={blurStyle} />
        </FieldGroup>
        <FieldGroup label="Brand *">
          <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required placeholder="e.g. Epson" style={inputStyle()} onFocus={focusStyle} onBlur={blurStyle} />
        </FieldGroup>
      </div>

      {/* Category */}
      <FieldGroup label="Category *">
        <select value={category} onChange={e => setCategory(e.target.value)} required
          style={{ ...inputStyle(), appearance: 'none', cursor: 'pointer' }}
          onFocus={focusStyle} onBlur={blurStyle}
        >
          <option value="" style={{ background: '#1e293b' }}>Select a category...</option>
          {categoriesList.map(cat => (
            <option key={cat._id} value={cat.name} style={{ background: '#1e293b' }}>{cat.name}</option>
          ))}
        </select>
      </FieldGroup>

      {/* Description */}
      <FieldGroup label="Description">
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product features and specifications..." rows={4}
          style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.6 }}
          onFocus={focusStyle} onBlur={blurStyle}
        />
      </FieldGroup>

      {/* Price */}
      <FieldGroup label="Price (LKR) *">
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontWeight: 600 }}>Rs.</span>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" placeholder="0.00"
            style={{ ...inputStyle(), paddingLeft: '44px' }}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>
      </FieldGroup>

      {/* Images */}
      <FieldGroup label={editingProduct ? 'Images (optional — only if replacing)' : 'Product Images * (max 5)'}>
        <div style={{
          border: '2px dashed rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setImages(Array.from(e.target.files))}
            required={!editingProduct}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
              minHeight: 'auto',
            }}
          />
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            {images.length > 0 ? (
              <span style={{ color: 'var(--brand-400)', fontWeight: 600 }}>{images.length} file(s) selected</span>
            ) : (
              <>Click to upload or drag & drop<br /><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>PNG, JPG, WEBP (max 5)</span></>
            )}
          </div>
        </div>
      </FieldGroup>

      {/* New Arrival Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
        <input
          type="checkbox"
          id="newArrivalCheck"
          checked={newArrival}
          onChange={e => setNewArrival(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--brand-500)', cursor: 'pointer', minHeight: 'auto', minWidth: 'auto' }}
        />
        <label htmlFor="newArrivalCheck" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', margin: 0 }}>
          Mark as <span style={{ color: 'var(--brand-400)', fontWeight: 700 }}>New Arrival</span> ✨
        </label>
      </div>

      {/* What's Included */}
      <FieldGroup label="What's Included in the Box">
        <textarea value={included} onChange={e => setIncluded(e.target.value)} rows={3}
          placeholder="Product, Remote, Manual, Power Cable, Warranty Card (comma-separated)"
          style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.6 }}
          onFocus={focusStyle} onBlur={blurStyle}
        />
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>Separate items with commas</span>
      </FieldGroup>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '10px', color: '#fca5a5', fontSize: '0.875rem', display: 'flex', gap: '8px', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <button
          type="submit"
          disabled={loading}
          className="btn-brand"
          style={{ flex: 1, padding: '13px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Saving...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </>
          )}
        </button>
        {onSuccess && (
          <button type="button" onClick={onSuccess}
            style={{
              padding: '13px 24px', background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '999px',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.9rem', fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddProduct;