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



function FormSection({ title, icon, children }) {
  return (
    <div className="bg-[#2D2D44] rounded-[24px] border border-white/10/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-8 group">
      <div className="px-8 py-5 border-b border-white/5 bg-[#1A1A2E]/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2D2D44] border border-white/10 flex items-center justify-center text-slate-400 shadow-sm group-hover:border-cyan-200 group-hover:text-cyan-500 transition-colors">
          {icon}
        </div>
        <h3 className="text-base font-bold text-[#F5F5F5] tracking-tight">{title}</h3>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

function FieldGroup({ label, children, error, helpText, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest px-1">
        {label}
        {error && <span className="ml-2 text-[10px] text-red-500 font-medium normal-case">Required</span>}
      </label>
      {children}
      {helpText && <p className="text-[11px] text-slate-400 italic px-1">{helpText}</p>}
    </div>
  );
}

function CategorySelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-[#1A1A2E] border border-white/10 rounded-2xl text-left flex items-center justify-between group hover:border-cyan-200 hover:bg-[#2D2D44] transition-all shadow-sm"
      >
        <span className={value ? "text-[#F5F5F5] font-bold" : "text-slate-400 font-medium text-sm"}>
          {value || "Choose a category..."}
        </span>
        <svg 
          width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
          className={`text-slate-400 group-hover:text-cyan-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#2D2D44] border border-white/10 rounded-[24px] shadow-2xl shadow-slate-200/50 p-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
              {options.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 text-xs italic">No categories found</div>
              )}
              {options.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => { onChange(option.name); setIsOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between group/item
                    ${value === option.name ? 'bg-cyan-50 text-cyan-600' : 'text-slate-600 hover:bg-[#1A1A2E] hover:text-[#F5F5F5]'}`}
                >
                  {option.name}
                  {value === option.name && (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-cyan-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
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
    borderRadius: '16px',
    overflow: 'hidden',
    border: item.type === 'existing' ? '1px solid #e2e8f0' : '2px solid #0891b2',
    boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none',
    cursor: 'grab',
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none'
  };

  const previewUrl = item.type === 'existing' ? `${item.data.url}` : URL.createObjectURL(item.data);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={previewUrl} alt="Product" className="w-full h-full object-cover pointer-events-none" />
      <button 
        type="button" 
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        className="absolute top-1.5 right-1.5 bg-[#2D2D44]/90 hover:bg-red-500 hover:text-white text-slate-600 rounded-lg w-6 h-6 flex items-center justify-center transition-all shadow-sm z-20"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      {isFirst && (
        <div className="absolute top-0 left-0 right-0 bg-cyan-500 text-white text-[8px] font-black py-0.5 text-center uppercase tracking-tighter">Primary</div>
      )}
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
  const [unifiedImages, setUnifiedImages] = useState([]);
  const [newArrival, setNewArrival] = useState(false);
  const [included, setIncluded] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState([]);

  const inputClasses = "w-full px-5 py-3.5 bg-[#1A1A2E] border border-white/10 rounded-2xl text-[#F5F5F5] text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all placeholder:text-slate-400 font-medium";
  const selectClasses = "w-full px-5 py-3.5 bg-[#1A1A2E] border border-white/10 rounded-2xl text-[#F5F5F5] text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all appearance-none cursor-pointer font-medium";

  useEffect(() => {
    axios.get('/categories').then(res => setCategoriesList(res.data)).catch(err => console.error('Failed to load categories', err));
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
    if (unifiedImages.length + files.length > 5) { alert(`Limit exceeded. You can only have 5 images total.`); return; }
    const newItems = files.map(file => ({ id: Math.random().toString(36).substr(2, 9), type: 'new', data: file }));
    setUnifiedImages(prev => [...prev, ...newItems]);
  };

  const removeImage = (id) => setUnifiedImages(unifiedImages.filter(img => img.id !== id));

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
      const imageOrder = unifiedImages.map(item => {
        if (item.type === 'existing') return { type: 'existing', id: item.id };
        return { type: 'new', index: newFiles.indexOf(item.data) };
      });

      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('imageOrder', JSON.stringify(imageOrder));
      newFiles.forEach(img => formData.append('images', img));

      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setLoading(false);
      if (onSuccess) onSuccess(); else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      setLoading(false);
    }
  };

  // Helper for Preview Image
  const primaryImage = unifiedImages[0];
  const previewImageUrl = primaryImage 
    ? (primaryImage.type === 'existing' ? primaryImage.data.url : URL.createObjectURL(primaryImage.data))
    : null;

  return (
    <div className="bg-[#1A1A2E]/50 p-6 lg:p-10">
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-2">
            
            <FormSection title="Core Details" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Product Identity">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Sony WH-1000XM5" className={inputClasses} />
                </FieldGroup>
                <FieldGroup label="Brand Name">
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required placeholder="e.g. Sony" className={inputClasses} />
                </FieldGroup>
                <FieldGroup label="Category Selection" className="md:col-span-2">
                  <CategorySelect 
                    value={category} 
                    options={categoriesList} 
                    onChange={(val) => setCategory(val)} 
                  />
                </FieldGroup>
                <FieldGroup label="Product Story" className="md:col-span-2">
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write a compelling description..." rows={4} className={`${inputClasses} resize-none`} />
                </FieldGroup>
              </div>
            </FormSection>

            <FormSection title="Pricing & Availability" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FieldGroup label="Current Price (LKR)">
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">Rs.</span>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" placeholder="0.00" className={`${inputClasses} pl-14 font-black text-cyan-600 text-lg`} />
                  </div>
                </FieldGroup>
                <FieldGroup label="Original Price (MSRP)">
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">Rs.</span>
                    <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} min="0" step="0.01" placeholder="0.00" className={`${inputClasses} pl-14`} />
                  </div>
                </FieldGroup>
                
                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex-1 min-w-[200px] flex items-center justify-between p-5 bg-[#1A1A2E] border border-white/10 rounded-[20px] cursor-pointer hover:bg-cyan-50/50 hover:border-cyan-200 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2D2D44] border border-white/5 flex items-center justify-center text-cyan-500 shadow-sm">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l6.857-2.286L9 3z" /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#F5F5F5]">New Arrival</div>
                        <div className="text-[10px] text-slate-400 font-medium">Highlight in new collection</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={newArrival} onChange={e => setNewArrival(e.target.checked)} className="w-6 h-6 accent-cyan-500" />
                  </label>

                  <label className="flex-1 min-w-[200px] flex items-center justify-between p-5 bg-[#1A1A2E] border border-white/10 rounded-[20px] cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2D2D44] border border-white/5 flex items-center justify-center text-emerald-500 shadow-sm">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#F5F5F5]">In Stock</div>
                        <div className="text-[10px] text-slate-400 font-medium">{inStock ? 'Ready for shipping' : 'Currently unavailable'}</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-6 h-6 accent-emerald-500" />
                  </label>
                </div>
              </div>
            </FormSection>

            <FormSection title="Visual Assets" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
              <div className="p-6 bg-[#1A1A2E]/50 rounded-3xl border-2 border-dashed border-white/10">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <div className="flex flex-wrap gap-5">
                    <SortableContext items={unifiedImages.map(i => i.id)} strategy={rectSortingStrategy}>
                      {unifiedImages.map((item, index) => <SortableImage key={item.id} item={item} onRemove={removeImage} isFirst={index === 0} />)}
                    </SortableContext>
                    {unifiedImages.length < 5 && (
                      <div className="relative group">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-slate-300 bg-[#2D2D44] flex flex-col items-center justify-center gap-2 group-hover:border-cyan-400 group-hover:bg-cyan-50 transition-all">
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-slate-400 group-hover:text-cyan-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-cyan-500 uppercase tracking-tighter">Upload</span>
                        </div>
                      </div>
                    )}
                  </div>
                </DndContext>
                {unifiedImages.length === 0 && <p className="text-center py-6 text-sm text-slate-400 italic">No images selected. Upload up to 5 photos.</p>}
              </div>
            </FormSection>

            <FormSection title="Technical Specs" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
              <div className="space-y-6">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-4 group animate-fade-in items-end">
                    <FieldGroup label="Key" className="flex-1">
                      <input type="text" value={spec.key} className={inputClasses} onChange={e => { const n=[...specs]; n[index].key=e.target.value; setSpecs(n); }} />
                    </FieldGroup>
                    <FieldGroup label="Value" className="flex-[2]">
                      <input type="text" value={spec.value} className={inputClasses} onChange={e => { const n=[...specs]; n[index].value=e.target.value; setSpecs(n); }} />
                    </FieldGroup>
                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="mb-1 w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="w-full py-4 bg-[#1A1A2E] border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm font-bold hover:border-cyan-400 hover:text-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  Add Specification
                </button>
                <FieldGroup label="In the Box" helpText="Comma separated items">
                  <textarea value={included} onChange={e => setIncluded(e.target.value)} rows={3} placeholder="List items included with the product..." className={`${inputClasses} resize-none`} />
                </FieldGroup>
              </div>
            </FormSection>
          </div>

          {/* Right Column: Live Preview & Sticky Actions */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 space-y-8">
            
            {/* Live Preview Card */}
            <div className="bg-[#2D2D44] rounded-[32px] border border-white/10 overflow-hidden shadow-xl shadow-slate-200/50 group">
              <div className="p-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center">
                <span>Live Marketplace Preview</span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                {previewImageUrl ? (
                  <img src={previewImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="opacity-20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Awaiting Product Media</span>
                  </div>
                )}
                {newArrival && <div className="absolute top-4 left-4 bg-cyan-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">NEW</div>}
                {!inStock && <div className="absolute inset-0 bg-[#2D2D44]/60 backdrop-blur-[2px] flex items-center justify-center font-black text-[#F5F5F5] uppercase tracking-widest text-sm">Out of Stock</div>}
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{brand || 'Brand'} • {category || 'Category'}</div>
                  <h4 className="text-xl font-bold text-[#F5F5F5] leading-tight">{name || 'Your Product Title'}</h4>
                </div>
                <div className="flex items-baseline gap-3 pt-2">
                  <div className="text-2xl font-black text-[#F5F5F5]">Rs. {parseInt(price || 0).toLocaleString()}</div>
                  {originalPrice && <div className="text-sm text-slate-400 line-through">Rs. {parseInt(originalPrice).toLocaleString()}</div>}
                </div>
                <button type="button" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] opacity-80 cursor-default">View Details</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-[#2D2D44] p-6 rounded-[28px] border border-white/10 shadow-lg space-y-3">
              {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold flex items-center gap-2 mb-4 animate-shake"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
              
              <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-200 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] uppercase tracking-widest text-xs">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>{editingProduct ? 'Save Changes' : 'Publish Product'}</>}
              </button>
              <button type="button" onClick={onSuccess} className="w-full py-4 bg-[#1A1A2E] text-slate-400 font-bold rounded-2xl hover:bg-slate-100 hover:text-[#F5F5F5] transition-all text-xs uppercase tracking-widest">Discard Changes</button>
              
              <p className="text-[10px] text-slate-400 text-center font-medium pt-2">Publishing will make this product visible to all customers instantly.</p>
            </div>

          </div>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}} />
    </div>
  );
}

export default AddProduct;
