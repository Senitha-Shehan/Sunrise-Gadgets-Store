import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



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

function SortableImage({ item, onRemove, isFirst }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: item.type === 'existing' ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid var(--brand-500)',
    boxShadow: item.type === 'new' ? '0 0 10px rgba(249,115,22,0.2)' : (isDragging ? '0 8px 16px rgba(0,0,0,0.5)' : 'none'),
    cursor: 'grab',
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'none'
  };

  const previewUrl = item.type === 'existing' ? `http://localhost:5000${item.data.url}` : URL.createObjectURL(item.data);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={previewUrl} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      <button 
        type="button" 
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '6px', width: '22px', height: '22px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', minHeight: 'auto', zIndex: 11 }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      {isFirst && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--brand-600)', color: 'white', fontSize: '10px', padding: '2px 0px', textAlign: 'center', fontWeight: 700, letterSpacing: '0.02em', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>FEATURED</div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: item.type === 'existing' ? 'rgba(0,0,0,0.5)' : 'var(--brand-600)', color: 'white', fontSize: '9px', padding: '2px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 600 }}>{item.type}</div>
    </div>
  );
}

function AddProduct({ editingProduct, onSuccess }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [specs, setSpecs] = useState([]);
  const [unifiedImages, setUnifiedImages] = useState([]); // All images (existing and new) in order
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
      setOriginalPrice(editingProduct.originalPrice?.toString() || '');
      setInStock(editingProduct.inStock !== false);
      setSpecs(editingProduct.specs || []);
      setNewArrival(editingProduct.newArrival || false);
      setIncluded(editingProduct.included?.join(', ') || '');
      setUnifiedImages(editingProduct.images?.map(img => ({ id: img.public_id, type: 'existing', data: img })) || []);
    }
  }, [editingProduct]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setUnifiedImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrent = unifiedImages.length;
    if (totalCurrent + files.length > 5) {
      alert(`Limit exceeded. You can only have 5 images total.`);
      return;
    }
    const newItems = files.map(file => ({ 
      id: Math.random().toString(36).substr(2, 9), 
      type: 'new', 
      data: file 
    }));
    setUnifiedImages(prev => [...prev, ...newItems]);
  };

  const removeImage = (id) => {
    setUnifiedImages(unifiedImages.filter(img => img.id !== id));
  };

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
      if (originalPrice) formData.append('originalPrice', parseFloat(originalPrice));
      formData.append('inStock', inStock);
      formData.append('newArrival', newArrival);
      formData.append('included', included);
      formData.append('specs', JSON.stringify(specs));
      
      const existingImages = unifiedImages.filter(i => i.type === 'existing').map(i => i.data);
      const newFiles = unifiedImages.filter(i => i.type === 'new').map(i => i.data);
      
      // Image Order interleave info for the server
      const imageOrder = unifiedImages.map(item => {
        if (item.type === 'existing') {
          return { type: 'existing', id: item.id };
        } else {
          return { type: 'new', index: newFiles.indexOf(item.data) };
        }
      });

      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('imageOrder', JSON.stringify(imageOrder));
      
      // Append new files
      newFiles.forEach(img => formData.append('images', img));

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

      {/* Price & Original Price */}
      <div className="form-row-2">
        <FieldGroup label="Current Price (LKR) *">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontWeight: 600 }}>Rs.</span>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" placeholder="0.00"
              style={{ ...inputStyle(), paddingLeft: '44px' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </FieldGroup>
        <FieldGroup label="Original Price (Optional) — Shows discount">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontWeight: 600 }}>Rs.</span>
            <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} min="0" step="0.01" placeholder="0.00"
              style={{ ...inputStyle(), paddingLeft: '44px' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </FieldGroup>
      </div>

      <FieldGroup label="Product Gallery — Drag to reorder (Max 5 Total)">
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.05)' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <SortableContext
                items={unifiedImages.map(i => i.id)}
                strategy={rectSortingStrategy}
              >
                {unifiedImages.map((item, index) => (
                  <SortableImage 
                    key={item.id} 
                    item={item} 
                    onRemove={removeImage} 
                    isFirst={index === 0}
                  />
                ))}
              </SortableContext>

              {/* Add More Button (hidden if limit reached) */}
              {unifiedImages.length < 5 && (
                <div style={{
                  width: '100px', height: '100px', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  cursor: 'pointer', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--brand-500)'} onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', minHeight: 'auto' }} />
                  <div style={{ fontSize: '1.2rem' }}>➕</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Add More</div>
                </div>
              )}
            </div>
          </DndContext>
          
          {unifiedImages.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: 0 }}>No images yet. Click "Add More" to start.</p>
            </div>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>First image will be the primary featured image.</span>
      </FieldGroup>

      {/* Settings Toggles (New Arrival & Stock) */}
      <div className="form-row-2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', flex: 1 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', flex: 1 }}>
          <input
            type="checkbox"
            id="inStockCheck"
            checked={inStock}
            onChange={e => setInStock(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer', minHeight: 'auto', minWidth: 'auto' }}
          />
          <label htmlFor="inStockCheck" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', margin: 0 }}>
            Currently <span style={{ color: inStock ? '#10b981' : '#ef4444', fontWeight: 700 }}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
          </label>
        </div>
      </div>

      {/* Specifications Builder */}
      <FieldGroup label="Product Specifications (Optional)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {specs.map((spec, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="e.g. Lumens" value={spec.key} style={{ ...inputStyle(), flex: 1 }} onFocus={focusStyle} onBlur={blurStyle}
                onChange={e => {
                  const newSpecs = [...specs];
                  newSpecs[index].key = e.target.value;
                  setSpecs(newSpecs);
                }}
              />
              <input type="text" placeholder="e.g. 3300 lm" value={spec.value} style={{ ...inputStyle(), flex: 2 }} onFocus={focusStyle} onBlur={blurStyle}
                onChange={e => {
                  const newSpecs = [...specs];
                  newSpecs[index].value = e.target.value;
                  setSpecs(newSpecs);
                }}
              />
              <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                style={{
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >×</button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])}
            style={{
              padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)',
              borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            + Add Specification
          </button>
        </div>
      </FieldGroup>

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