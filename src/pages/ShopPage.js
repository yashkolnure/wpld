import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag, Plus, Trash2, X, Check,
  Package, AlertCircle, Edit3, Search,
  ToggleLeft, ToggleRight, Image as ImageIcon,
  Loader2, Store, CheckCircle, XCircle, Clock,
  RefreshCw, Tag,
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const EMPTY_FORM = {
  retailer_id: '', name: '', description: '',
  price: '', currency: 'INR', image_url: '',
  availability: 'in stock', condition: 'new',
};

const AVAIL = [
  { value: 'in stock',     label: 'In Stock',     color: '#059669', bg: '#ecfdf5', dot: '#34d399' },
  { value: 'out of stock', label: 'Out of Stock',  color: '#dc2626', bg: '#fef2f2', dot: '#f87171' },
  { value: 'preorder',     label: 'Pre-order',     color: '#d97706', bg: '#fffbeb', dot: '#fbbf24' },
];
const getAvail = (v) => AVAIL.find(a => a.value === v) || { label: v, color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' };

export default function ShopPage() {
  /* ─── state ─── */
  const [catalog,      setCatalog]      = useState(null);   // { catalogId, name }
  const [products,     setProducts]     = useState([]);
  const [loadingCat,   setLoadingCat]   = useState(true);
  const [loadingProd,  setLoadingProd]  = useState(false);
  const [prodErr,      setProdErr]      = useState('');
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // (catalog creation via API removed — use Commerce Manager + paste ID instead)

  // Manual fallback (paste existing ID)
  const [showManual,   setShowManual]   = useState(false);
  const [manualId,     setManualId]     = useState('');
  const [manualName,   setManualName]   = useState('');
  const [manualSaving, setManualSaving] = useState(false);

  // Product modal (add / edit)
  const [modal,        setModal]        = useState(null);   // null | 'add' | 'edit'
  const [editingProd,  setEditingProd]  = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formSaving,   setFormSaving]   = useState(false);
  const [formErr,      setFormErr]      = useState('');

  // Delete / toggle
  const [deleteId,     setDeleteId]     = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [togglingId,   setTogglingId]   = useState(null);

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  /* ─── load ─── */
  useEffect(() => { loadCatalog(); }, []); // eslint-disable-line

  const loadCatalog = async () => {
    setLoadingCat(true);
    try {
      const r = await axios.get(`${API}/api/shop/catalog`, { headers });
      if (r.data.catalog) {
        setCatalog(r.data.catalog);
        loadProducts();
      }
    } catch { /* silent */ }
    finally { setLoadingCat(false); }
  };

  const loadProducts = () => {
    setLoadingProd(true); setProdErr('');
    axios.get(`${API}/api/shop/products`, { headers })
      .then(r => setProducts(r.data.products || []))
      .catch(e => setProdErr(e.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoadingProd(false));
  };

  /* ─── Connect catalog by ID ─── */
  const saveManual = async () => {
    if (!manualId.trim()) return;
    setManualSaving(true);
    try {
      const r = await axios.post(`${API}/api/shop/catalog`, { catalogId: manualId.trim(), name: manualName.trim() }, { headers });
      setCatalog(r.data.catalog);
      setShowManual(false); setManualId(''); setManualName('');
      loadProducts();
    } catch (e) { alert(e.response?.data?.message || 'Failed to save'); }
    finally { setManualSaving(false); }
  };

  /* ─── Disconnect catalog ─── */
  const disconnectCatalog = async () => {
    if (!window.confirm('Remove this catalog from your shop? Products and workflow nodes will stop working.')) return;
    await axios.delete(`${API}/api/shop/catalog`, { headers }).catch(() => {});
    setCatalog(null); setProducts([]);
  };

  /* ─── Product modal ─── */
  const openAdd = () => { setForm(EMPTY_FORM); setFormErr(''); setModal('add'); };
  const openEdit = (p) => {
    setEditingProd(p);
    setForm({
      retailer_id:  p.retailer_id  || '',
      name:         p.name         || '',
      description:  p.description  || '',
      price:        p.price != null ? (p.price / 100).toFixed(2) : '',
      currency:     p.currency     || 'INR',
      image_url:    p.image_url    || '',
      availability: p.availability || 'in stock',
      condition:    p.condition    || 'new',
    });
    setFormErr(''); setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditingProd(null); setFormErr(''); };

  const submitForm = async () => {
    if (!form.name || !form.price || !form.currency) { setFormErr('Name, price and currency are required'); return; }
    if (modal === 'add' && !form.retailer_id) { setFormErr('Retailer ID is required'); return; }
    setFormSaving(true); setFormErr('');
    try {
      const priceMinor = Math.round(parseFloat(form.price) * 100);
      if (modal === 'add') {
        await axios.post(`${API}/api/shop/products`, { ...form, price: priceMinor }, { headers });
      } else {
        await axios.patch(`${API}/api/shop/products/${editingProd.id}`, { ...form, price: priceMinor }, { headers });
        setProducts(prev => prev.map(p => p.id === editingProd.id ? { ...p, ...form, price: priceMinor } : p));
      }
      closeModal(); loadProducts();
    } catch (e) { setFormErr(e.response?.data?.message || 'Failed to save'); }
    finally { setFormSaving(false); }
  };

  /* ─── Toggle status ─── */
  const toggleAvail = async (p) => {
    const next = p.availability === 'in stock' ? 'out of stock' : 'in stock';
    setTogglingId(p.id);
    try {
      await axios.patch(`${API}/api/shop/products/${p.id}`, { availability: next }, { headers });
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, availability: next } : x));
    } catch (e) { alert(e.response?.data?.message || 'Failed to update status'); }
    finally { setTogglingId(null); }
  };

  /* ─── Delete ─── */
  const doDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/shop/products/${deleteId}`, { headers });
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (e) { alert(e.response?.data?.message || 'Failed to delete'); }
    finally { setDeleting(false); }
  };

  const fmt = (price, currency) => {
    if (price == null) return '—';
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(price / 100); }
    catch { return `${currency} ${(price / 100).toFixed(2)}`; }
  };

  /* ─── Filtered list ─── */
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || [p.name, p.retailer_id, p.description].some(s => s?.toLowerCase().includes(q));
    const matchS = filterStatus === 'all' || p.availability === filterStatus;
    return matchQ && matchS;
  });

  /* ─── Stats ─── */
  const inStock = products.filter(p => p.availability === 'in stock').length;
  const outOfStock = products.filter(p => p.availability === 'out of stock').length;
  const preorder = products.filter(p => p.availability === 'preorder').length;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  if (loadingCat) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, gap:14 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:30, height:30, border:'3px solid #e5e7eb', borderTop:'3px solid #f59e0b', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <p style={{ color:'#6b7280', fontSize:14 }}>Loading shop...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", padding:'0 0 48px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:none; } }
        @keyframes modalIn { from { opacity:0;transform:translateY(20px) scale(.98); } to { opacity:1;transform:none; } }
        .row-hover:hover { background:#fffbeb !important; }
        .icon-btn:hover  { background:#f3f4f6 !important; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius:12, padding:'9px 10px', display:'flex' }}>
            <ShoppingBag size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#111827' }}>Shop</h1>
            <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>Create and manage your Meta product catalog</p>
          </div>
        </div>
        {catalog && (
          <button onClick={openAdd} style={btnPrimary}>
            <Plus size={14} /> Add New Item
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          NO CATALOG — Create / manual
      ══════════════════════════════════════════════════════ */}
      {!catalog && (
        <div style={card}>

          {/* ── Setup instructions ── */}
          {!showManual && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:'32px 0' }}>
              <div style={{ width:68, height:68, borderRadius:22, background:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'2px dashed #fcd34d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Store size={30} color="#f59e0b" />
              </div>

              <div style={{ textAlign:'center', maxWidth:420 }}>
                <p style={{ fontWeight:800, fontSize:16, color:'#111827', margin:'0 0 6px' }}>Connect your product catalog</p>
                <p style={{ fontSize:13, color:'#6b7280', margin:0, lineHeight:1.6 }}>
                  Create a catalog in Meta Commerce Manager, then connect it here to start sending product messages on WhatsApp.
                </p>
              </div>

              {/* Step-by-step guide */}
              <div style={{ width:'100%', maxWidth:420, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                <p style={{ margin:0, fontSize:12, fontWeight:700, color:'#374151', letterSpacing:0.5 }}>HOW TO GET YOUR CATALOG ID</p>
                {[
                  { n:1, text: 'Go to', link: 'business.facebook.com/commerce', url: 'https://business.facebook.com/commerce' },
                  { n:2, text: 'Click "Add catalog" → choose E-commerce → Next', link: null },
                  { n:3, text: 'Name your catalog and click "Create catalog"', link: null },
                  { n:4, text: 'Open the catalog → Settings → copy the Catalog ID', link: null },
                  { n:5, text: 'Paste it below and click Connect', link: null },
                ].map(s => (
                  <div key={s.n} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ minWidth:22, height:22, borderRadius:'50%', background:'#f59e0b', color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>{s.n}</div>
                    <p style={{ margin:0, fontSize:12.5, color:'#374151', lineHeight:1.5 }}>
                      {s.text}{' '}
                      {s.link && (
                        <a href={s.url} target="_blank" rel="noreferrer" style={{ color:'#3b82f6', textDecoration:'none', fontWeight:600 }}>{s.link}</a>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowManual(true); }}
                style={{ ...btnPrimary, padding:'10px 28px', fontSize:13 }}
              >
                <Tag size={15} /> Connect Catalog ID
              </button>
            </div>
          )}

          {/* ── Catalog ID entry ── */}
          {showManual && (
            <div style={{ maxWidth:440, margin:'0 auto', padding:'28px 0', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <button onClick={() => setShowManual(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:18, padding:0, lineHeight:1, display:'flex', alignItems:'center' }}>←</button>
                <p style={{ fontWeight:700, fontSize:15, color:'#111827', margin:0 }}>Connect Your Catalog</p>
              </div>
              <div>
                <label style={lbl}>Catalog ID <span style={{ color:'#ef4444' }}>*</span></label>
                <input style={inp} value={manualId} onChange={e => setManualId(e.target.value)} placeholder="e.g. 123456789012345" autoFocus />
                <p style={{ fontSize:11, color:'#9ca3af', margin:'4px 0 0' }}>
                  Find it in <a href="https://business.facebook.com/commerce" target="_blank" rel="noreferrer" style={{ color:'#3b82f6', textDecoration:'none' }}>Commerce Manager</a> → open your catalog → Settings
                </p>
              </div>
              <div>
                <label style={lbl}>Display Name <span style={{ fontSize:10, color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
                <input style={inp} value={manualName} onChange={e => setManualName(e.target.value)} placeholder="My Store" />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={saveManual} disabled={manualSaving || !manualId.trim()} style={{ ...btnPrimary, flex:1, justifyContent:'center', opacity: !manualId.trim() ? 0.5 : 1 }}>
                  {manualSaving ? <><Loader2 size={13} style={{ animation:'spin .7s linear infinite' }} /> Connecting...</> : <><Check size={13} /> Connect Catalog</>}
                </button>
                <button onClick={() => setShowManual(false)} style={btnSecondary}>Back</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CATALOG EXISTS — info strip
      ══════════════════════════════════════════════════════ */}
      {catalog && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'#ecfdf5', border:'1px solid #a7f3d0', borderRadius:10, marginBottom:20, animation:'fadeUp .3s ease' }}>
          <CheckCircle size={15} color="#059669" />
          <span style={{ fontSize:13, fontWeight:700, color:'#065f46' }}>
            {catalog.name || 'Product Catalog'}
          </span>
          <span style={{ fontSize:11, color:'#6b7280', fontFamily:'monospace', background:'rgba(0,0,0,0.05)', padding:'1px 7px', borderRadius:6 }}>
            ID: {catalog.catalogId}
          </span>
          <div style={{ flex:1 }} />
          <button onClick={loadProducts} style={{ ...btnSecondary, padding:'4px 10px', fontSize:11 }} title="Refresh">
            <RefreshCw size={11} />
          </button>
          <button onClick={disconnectCatalog} style={{ fontSize:11, color:'#ef4444', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
            Remove
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════ */}
      {catalog && products.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Total Items',  value:products.length, icon:<Package size={16} />,   color:'#6366f1', bg:'#eef2ff' },
            { label:'In Stock',     value:inStock,         icon:<CheckCircle size={16} />,color:'#059669', bg:'#ecfdf5' },
            { label:'Out of Stock', value:outOfStock,      icon:<XCircle size={16} />,    color:'#dc2626', bg:'#fef2f2' },
            { label:'Pre-order',    value:preorder,        icon:<Clock size={16} />,       color:'#d97706', bg:'#fffbeb' },
          ].map(s => (
            <div key={s.label} style={{ ...card, display:'flex', alignItems:'center', gap:12, padding:'14px 16px' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:22, fontWeight:800, color:'#111827', margin:0, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:'#6b7280', margin:'2px 0 0' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PRODUCTS TABLE
      ══════════════════════════════════════════════════════ */}
      {catalog && (
        <div style={card}>

          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:180, position:'relative' }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
              <input style={{ ...inp, paddingLeft:32, margin:0 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU or description..." />
            </div>
            <select style={{ ...inp, width:'auto', margin:0, cursor:'pointer' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="preorder">Pre-order</option>
            </select>
          </div>

          {prodErr && (
            <div style={{ marginBottom:16 }}>
              <p style={{ ...errBox, marginBottom:10 }}><AlertCircle size={13} /> {prodErr}</p>
              {/* Show sharing guide when it's a permission error */}
              {(prodErr.includes('permission') || prodErr.includes('does not exist') || prodErr.includes('100')) && (
                <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:10, padding:'14px 16px' }}>
                  <p style={{ margin:'0 0 8px', fontSize:12, fontWeight:700, color:'#92400e' }}>
                    Share your catalog with WPLeads to fix this
                  </p>
                  <p style={{ margin:'0 0 10px', fontSize:12, color:'#78350f', lineHeight:1.5 }}>
                    Your catalog is in your Meta Business, but WPLeads needs access to read and manage products. Share it as a partner:
                  </p>
                  {[
                    { n:1, text:'Go to ', link:'business.facebook.com/commerce', url:'https://business.facebook.com/commerce' },
                    { n:2, text:'Open your catalog → click Settings (left sidebar)' },
                    { n:3, text:'Find "Share catalog" or "Catalog permissions" → Add a partner' },
                    { n:4, text:'Enter WPLeads Business ID: 706440965371488 → give Admin access' },
                    { n:5, text:'Click Save, then refresh this page' },
                  ].map(s => (
                    <div key={s.n} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                      <div style={{ minWidth:18, height:18, borderRadius:'50%', background:'#f59e0b', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>{s.n}</div>
                      <p style={{ margin:0, fontSize:11.5, color:'#78350f', lineHeight:1.5 }}>
                        {s.text}
                        {s.link && <a href={s.url} target="_blank" rel="noreferrer" style={{ color:'#3b82f6', fontWeight:600, textDecoration:'none' }}>{s.link}</a>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loadingProd ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 0', gap:10 }}>
              <div style={{ width:20, height:20, border:'2.5px solid #e5e7eb', borderTop:'2.5px solid #f59e0b', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
              <span style={{ fontSize:13, color:'#6b7280' }}>Loading products...</span>
            </div>

          ) : products.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ width:60, height:60, borderRadius:18, background:'#fffbeb', border:'2px dashed #fcd34d', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <Package size={26} color="#f59e0b" />
              </div>
              <p style={{ fontWeight:700, fontSize:15, color:'#111827', margin:'0 0 6px' }}>No products yet</p>
              <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 18px' }}>Add your first product to start selling via WhatsApp</p>
              <button onClick={openAdd} style={btnPrimary}><Plus size={14} /> Add First Product</button>
            </div>

          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'30px 0', color:'#9ca3af', fontSize:13 }}>
              No products match your search or filter.
            </div>

          ) : (
            /* Table */
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid #f3f4f6' }}>
                    {['','Product','SKU / ID','Price','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const av = getAvail(p.availability);
                    const isTog = togglingId === p.id;
                    return (
                      <tr key={p.id} className="row-hover" style={{ borderBottom:'1px solid #f9fafb', transition:'background .1s' }}>

                        {/* Thumbnail */}
                        <td style={{ padding:'10px 12px', width:52 }}>
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} style={{ width:42, height:42, objectFit:'cover', borderRadius:8, border:'1px solid #e5e7eb' }} onError={e => { e.target.style.display='none'; }} />
                            : <div style={{ width:42, height:42, borderRadius:8, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center' }}><ImageIcon size={15} color="#d1d5db" /></div>
                          }
                        </td>

                        {/* Name */}
                        <td style={{ padding:'10px 12px', maxWidth:220 }}>
                          <p style={{ fontWeight:700, color:'#111827', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                          {p.description && <p style={{ fontSize:11, color:'#6b7280', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>{p.description}</p>}
                        </td>

                        {/* SKU */}
                        <td style={{ padding:'10px 12px' }}>
                          <span style={{ fontFamily:'monospace', fontSize:11, color:'#6b7280', background:'#f3f4f6', padding:'2px 8px', borderRadius:6 }}>{p.retailer_id}</span>
                        </td>

                        {/* Price */}
                        <td style={{ padding:'10px 12px', fontWeight:700, color:'#111827', whiteSpace:'nowrap' }}>
                          {fmt(p.price, p.currency)}
                        </td>

                        {/* Status toggle */}
                        <td style={{ padding:'10px 12px' }}>
                          <button
                            onClick={() => toggleAvail(p)}
                            disabled={isTog}
                            title={`Click to toggle — currently "${p.availability}"`}
                            style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border:'none', background:av.bg, color:av.color, opacity:isTog ? 0.5 : 1, transition:'opacity .15s' }}
                          >
                            {isTog
                              ? <Loader2 size={11} style={{ animation:'spin .7s linear infinite' }} />
                              : p.availability === 'in stock' ? <ToggleRight size={13} /> : <ToggleLeft size={13} />
                            }
                            {av.label}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding:'10px 12px' }}>
                          <div style={{ display:'flex', gap:4 }}>
                            <button className="icon-btn" onClick={() => openEdit(p)}
                              style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:7, border:'1px solid #e5e7eb', background:'#fff', color:'#374151', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                              <Edit3 size={12} /> Edit
                            </button>
                            {deleteId === p.id ? (
                              <>
                                <button onClick={doDelete} disabled={deleting}
                                  style={{ padding:'5px 10px', borderRadius:7, border:'none', background:'#ef4444', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                                  {deleting ? '...' : 'Confirm'}
                                </button>
                                <button onClick={() => setDeleteId(null)}
                                  style={{ padding:'5px 8px', borderRadius:7, border:'1px solid #e5e7eb', background:'#fff', color:'#6b7280', fontSize:11, cursor:'pointer' }}>
                                  <X size={11} />
                                </button>
                              </>
                            ) : (
                              <button className="icon-btn" onClick={() => setDeleteId(p.id)}
                                style={{ display:'flex', alignItems:'center', padding:'5px 8px', borderRadius:7, border:'1px solid #fecaca', background:'#fff', color:'#ef4444', cursor:'pointer' }}>
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{ fontSize:11, color:'#9ca3af', textAlign:'right', marginTop:10 }}>
                Showing {filtered.length} of {products.length} item{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════════ */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && closeModal()}
          style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:560, maxHeight:'92vh', overflow:'auto', boxShadow:'0 32px 80px rgba(0,0,0,.2)', animation:'modalIn .22s ease' }}>

            {/* Modal header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 14px', borderBottom:'1px solid #f3f4f6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#fffbeb', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {modal === 'add' ? <Plus size={16} color="#f59e0b" /> : <Edit3 size={16} color="#f59e0b" />}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:15, color:'#111827', margin:0 }}>
                    {modal === 'add' ? 'Add New Product' : 'Edit Product'}
                  </p>
                  {modal === 'edit' && <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>{editingProd?.name}</p>}
                </div>
              </div>
              <button onClick={closeModal} style={{ width:30, height:30, borderRadius:'50%', border:'none', background:'#f3f4f6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280' }}>
                <X size={14} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding:'20px 24px' }}>
              {formErr && <p style={{ ...errBox, marginBottom:14 }}><AlertCircle size={13} /> {formErr}</p>}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

                {/* Retailer ID */}
                {modal === 'add'
                  ? <div style={{ gridColumn:'1/-1' }}>
                      <label style={lbl}>Retailer ID (SKU) <span style={{ color:'#ef4444' }}>*</span></label>
                      <input style={inp} value={form.retailer_id} onChange={e => setForm(f => ({ ...f, retailer_id:e.target.value }))} placeholder="e.g. SKU-001" autoFocus />
                      <p style={{ fontSize:10, color:'#9ca3af', margin:'3px 0 0' }}>Unique ID for this product. Cannot be changed after creation.</p>
                    </div>
                  : <div style={{ gridColumn:'1/-1' }}>
                      <label style={lbl}>Retailer ID (SKU)</label>
                      <div style={{ ...inp, background:'#f9fafb', color:'#6b7280', fontFamily:'monospace', fontSize:12 }}>{editingProd?.retailer_id}</div>
                    </div>
                }

                {/* Name */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Product Name <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} placeholder="e.g. Blue Cotton T-Shirt" autoFocus={modal === 'edit'} />
                </div>

                {/* Description */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Description</label>
                  <textarea style={{ ...inp, minHeight:70, resize:'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description:e.target.value }))} placeholder="Short description visible to customers..." />
                </div>

                {/* Price */}
                <div>
                  <label style={lbl}>Price <span style={{ color:'#ef4444' }}>*</span></label>
                  <input type="number" min="0" step="0.01" style={inp} value={form.price} onChange={e => setForm(f => ({ ...f, price:e.target.value }))} placeholder="299.00" />
                </div>

                {/* Currency */}
                <div>
                  <label style={lbl}>Currency <span style={{ color:'#ef4444' }}>*</span></label>
                  <select style={inp} value={form.currency} onChange={e => setForm(f => ({ ...f, currency:e.target.value }))}>
                    <option value="INR">INR — Indian Rupee ₹</option>
                    <option value="USD">USD — US Dollar $</option>
                    <option value="EUR">EUR — Euro €</option>
                    <option value="GBP">GBP — British Pound £</option>
                    <option value="AED">AED — UAE Dirham</option>
                  </select>
                </div>

                {/* Image URL */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Product Image URL</label>
                  <input style={inp} value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url:e.target.value }))} placeholder="https://example.com/product.jpg" />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" style={{ marginTop:8, width:80, height:80, objectFit:'cover', borderRadius:10, border:'1px solid #e5e7eb' }} onError={e => { e.target.style.display='none'; }} />
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label style={lbl}>Status / Availability</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                    {AVAIL.map(o => (
                      <label key={o.value} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'7px 10px', borderRadius:8, border:`1.5px solid ${form.availability === o.value ? o.color : '#e5e7eb'}`, background:form.availability === o.value ? o.bg : '#fff', transition:'all .12s' }}>
                        <input type="radio" name="avail" value={o.value} checked={form.availability === o.value} onChange={() => setForm(f => ({ ...f, availability:o.value }))} style={{ accentColor:o.color }} />
                        <span style={{ width:8, height:8, borderRadius:'50%', background:o.dot, flexShrink:0 }} />
                        <span style={{ fontSize:12, fontWeight:600, color:form.availability === o.value ? o.color : '#374151' }}>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label style={lbl}>Condition</label>
                  <select style={inp} value={form.condition} onChange={e => setForm(f => ({ ...f, condition:e.target.value }))}>
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding:'14px 24px', borderTop:'1px solid #f3f4f6', display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={closeModal} style={btnSecondary}>Cancel</button>
              <button onClick={submitForm} disabled={formSaving} style={{ ...btnPrimary, minWidth:130, justifyContent:'center' }}>
                {formSaving
                  ? <><Loader2 size={13} style={{ animation:'spin .7s linear infinite' }} /> Saving...</>
                  : <><Check size={13} /> {modal === 'add' ? 'Add Product' : 'Save Changes'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete toast ── */}
      {deleteId && !modal && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:999, background:'#1f2937', color:'#fff', borderRadius:12, padding:'12px 20px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 8px 24px rgba(0,0,0,.3)', animation:'fadeUp .2s ease', whiteSpace:'nowrap' }}>
          <AlertCircle size={15} color="#fbbf24" />
          <span style={{ fontSize:13 }}>Delete this product? This cannot be undone.</span>
          <button onClick={doDelete} disabled={deleting} style={{ background:'#ef4444', border:'none', color:'#fff', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            {deleting ? '...' : 'Delete'}
          </button>
          <button onClick={() => setDeleteId(null)} style={{ background:'rgba(255,255,255,.1)', border:'none', color:'#fff', borderRadius:7, padding:'5px 10px', fontSize:12, cursor:'pointer' }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

/* ── Shared tokens ── */
const card       = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,.05)' };
const btnPrimary = { display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:9, background:'#f59e0b', border:'none', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' };
const btnSecondary={display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, background:'#fff', border:'1px solid #e5e7eb', color:'#374151', fontSize:12, fontWeight:600, cursor:'pointer' };
const errBox     = { display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#ef4444', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'8px 12px', margin:0 };
const lbl        = { fontSize:11, fontWeight:700, color:'#4b5563', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:5 };
const inp        = { width:'100%', border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 11px', fontSize:13, outline:'none', color:'#111827', background:'#fff', boxSizing:'border-box', display:'block' };
