import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag, Plus, X, Check,
  Package, AlertCircle, Search,
  Image as ImageIcon,
  Loader2, Store, CheckCircle,
  RefreshCw, Copy, ExternalLink,
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5005';

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

  // Setup wizard
  const [setupStep,    setSetupStep]    = useState(1);  // 1 | 2 | 3
  const [copied,       setCopied]       = useState(false);
  const [manualId,     setManualId]     = useState('');
  const [manualName,   setManualName]   = useState('');
  const [manualSaving, setManualSaving] = useState(false);

  // Product modal (add only)
  const [modal,        setModal]        = useState(null);   // null | 'add'
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formSaving,   setFormSaving]   = useState(false);
  const [formErr,      setFormErr]      = useState('');


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

  /* ─── Copy to clipboard ─── */
  const copyBizId = () => {
    navigator.clipboard.writeText('706440965371488');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ─── Connect catalog by ID ─── */
  const saveManual = async () => {
    if (!manualId.trim()) return;
    setManualSaving(true);
    try {
      const r = await axios.post(`${API}/api/shop/catalog`, { catalogId: manualId.trim(), name: manualName.trim() }, { headers });
      setCatalog(r.data.catalog);
      setManualId(''); setManualName(''); setSetupStep(1);
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
  const closeModal = () => { setModal(null); setFormErr(''); };

  const submitForm = async () => {
    if (!form.name || !form.price || !form.currency) { setFormErr('Name, price and currency are required'); return; }
    if (modal === 'add' && !form.retailer_id) { setFormErr('Retailer ID is required'); return; }
    setFormSaving(true); setFormErr('');
    try {
      const priceMinor = Math.round(parseFloat(form.price) * 100);
      await axios.post(`${API}/api/shop/products`, { ...form, price: priceMinor }, { headers });
      closeModal(); loadProducts();
    } catch (e) { setFormErr(e.response?.data?.message || 'Failed to save'); }
    finally { setFormSaving(false); }
  };


  // Meta returns price as formatted string e.g. "₹200.00" OR as integer minor units e.g. 20000
  const parsePrice = (price) => {
    if (price == null) return null;
    if (typeof price === 'number') return price / 100;          // minor units → major
    if (typeof price === 'string') {
      const n = parseFloat(price.replace(/[^0-9.]/g, ''));      // strip symbols like ₹,$
      return isNaN(n) ? null : n;
    }
    return null;
  };

  const fmt = (price, currency) => {
    const val = parsePrice(price);
    if (val == null) return '—';
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(val); }
    catch { return `${currency || ''} ${val.toFixed(2)}`; }
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
          NO CATALOG — 3-step guided setup
      ══════════════════════════════════════════════════════ */}
      {!catalog && (
        <div style={card}>
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 0' }}>

            {/* ── Title ── */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'2px dashed #fcd34d', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Store size={22} color="#f59e0b" />
              </div>
              <div>
                <p style={{ margin:0, fontWeight:800, fontSize:15, color:'#111827' }}>Connect your WhatsApp Product Catalog</p>
                <p style={{ margin:0, fontSize:12, color:'#6b7280', marginTop:2 }}>Follow these 3 steps to start sending product messages</p>
              </div>
            </div>

            {/* ── Step tabs ── */}
            <div style={{ display:'flex', gap:6, marginBottom:20 }}>
              {[1,2,3].map(s => (
                <button key={s} onClick={() => setSetupStep(s)} style={{ flex:1, padding:'8px 4px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                  background: setupStep === s ? '#f59e0b' : setupStep > s ? '#ecfdf5' : '#f9fafb',
                  color: setupStep === s ? '#fff' : setupStep > s ? '#059669' : '#9ca3af',
                }}>
                  {setupStep > s ? '✓ ' : ''}Step {s}
                </button>
              ))}
            </div>

            {/* ══ STEP 1 — Create catalog in Commerce Manager ══ */}
            {setupStep === 1 && (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 18px' }}>
                  <p style={{ margin:'0 0 12px', fontWeight:700, fontSize:13, color:'#111827' }}>Create a catalog in Meta Commerce Manager</p>
                  {[
                    'Click the button below to open Meta Commerce Manager',
                    'Click "Add catalog" → choose E-commerce → Next',
                    'Give your catalog a name → click "Create catalog"',
                    'Done! Come back here and go to Step 2',
                  ].map((t, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom: i < 3 ? 10 : 0 }}>
                      <div style={{ minWidth:20, height:20, borderRadius:'50%', background:'#f59e0b', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>{i+1}</div>
                      <p style={{ margin:0, fontSize:12.5, color:'#374151', lineHeight:1.5 }}>{t}</p>
                    </div>
                  ))}
                </div>
                <a href="https://business.facebook.com/commerce" target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 0', background:'#1877f2', color:'#fff', borderRadius:10, fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  <ExternalLink size={14} /> Open Meta Commerce Manager
                </a>
                <button onClick={() => setSetupStep(2)} style={{ ...btnPrimary, justifyContent:'center' }}>
                  I created my catalog → Next
                </button>
              </div>
            )}

            {/* ══ STEP 2 — Share with WPLeads ══ */}
            {setupStep === 2 && (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 18px' }}>
                  <p style={{ margin:'0 0 12px', fontWeight:700, fontSize:13, color:'#111827' }}>Share your catalog with WPLeads</p>
                  {[
                    'In Commerce Manager → open your catalog → click Settings',
                    'Find "Share catalog" or "Catalog permissions" → click Add a partner',
                    'Enter the WPLeads Business ID below → give Admin access → Save',
                    'Done! Go to Step 3',
                  ].map((t, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom: i < 3 ? 10 : 0 }}>
                      <div style={{ minWidth:20, height:20, borderRadius:'50%', background:'#f59e0b', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>{i+1}</div>
                      <p style={{ margin:0, fontSize:12.5, color:'#374151', lineHeight:1.5 }}>{t}</p>
                    </div>
                  ))}
                </div>

                {/* Business ID copy box */}
                <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:10, padding:'12px 16px' }}>
                  <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:0.5 }}>WPLeads Business ID</p>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <code style={{ flex:1, fontSize:16, fontWeight:800, color:'#111827', letterSpacing:1 }}>706440965371488</code>
                    <button onClick={copyBizId} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background: copied ? '#059669' : '#f59e0b', color:'#fff', border:'none', borderRadius:7, cursor:'pointer', fontWeight:700, fontSize:12, transition:'background .2s' }}>
                      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setSetupStep(1)} style={btnSecondary}>← Back</button>
                  <button onClick={() => setSetupStep(3)} style={{ ...btnPrimary, flex:1, justifyContent:'center' }}>
                    I shared my catalog → Next
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 3 — Paste Catalog ID ══ */}
            {setupStep === 3 && (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 18px' }}>
                  <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:13, color:'#111827' }}>Find your Catalog ID</p>
                  <p style={{ margin:0, fontSize:12, color:'#6b7280', lineHeight:1.5 }}>
                    In Commerce Manager → open your catalog → <b>Settings</b> → copy the number next to "Catalog ID"
                  </p>
                </div>
                <div>
                  <label style={lbl}>Catalog ID <span style={{ color:'#ef4444' }}>*</span></label>
                  <input
                    style={inp}
                    value={manualId}
                    onChange={e => setManualId(e.target.value)}
                    placeholder="e.g. 974313212236210"
                    autoFocus
                  />
                </div>
                <div>
                  <label style={lbl}>Catalog Name <span style={{ fontSize:10, color:'#9ca3af', fontWeight:400 }}>(optional — for display)</span></label>
                  <input style={inp} value={manualName} onChange={e => setManualName(e.target.value)} placeholder="My Store" />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setSetupStep(2)} style={btnSecondary}>← Back</button>
                  <button onClick={saveManual} disabled={manualSaving || !manualId.trim()} style={{ ...btnPrimary, flex:1, justifyContent:'center', opacity: !manualId.trim() ? 0.5 : 1 }}>
                    {manualSaving
                      ? <><Loader2 size={13} style={{ animation:'spin .7s linear infinite' }} /> Connecting...</>
                      : <><Check size={13} /> Connect Catalog</>}
                  </button>
                </div>
              </div>
            )}

          </div>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Total Items', value:products.length, icon:<Package size={16} />,    color:'#6366f1', bg:'#eef2ff' },
            { label:'In Stock',    value:inStock,         icon:<CheckCircle size={16} />, color:'#059669', bg:'#ecfdf5' },
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
            /* Product Grid */
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
                {filtered.map(p => {
                  const av = getAvail(p.availability);
                  return (
                    <div key={p.id} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column', transition:'box-shadow .15s', boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
                      {/* Image */}
                      <div style={{ width:'100%', aspectRatio:'1', background:'#f9fafb', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.parentNode.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%"><svg width=32 height=32 viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>'; }} />
                          : <ImageIcon size={32} color="#d1d5db" />
                        }
                      </div>
                      {/* Info */}
                      <div style={{ padding:'12px 14px', flex:1, display:'flex', flexDirection:'column', gap:4 }}>
                        <p style={{ margin:0, fontWeight:700, fontSize:13, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                        {p.description && (
                          <p style={{ margin:0, fontSize:11, color:'#6b7280', lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.description}</p>
                        )}
                        <p style={{ margin:'4px 0 0', fontWeight:800, fontSize:14, color:'#f59e0b' }}>{fmt(p.price, p.currency)}</p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
                          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:av.bg, color:av.color }}>{av.label}</span>
                          <span style={{ fontSize:10, color:'#9ca3af', fontFamily:'monospace' }}>{p.retailer_id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize:11, color:'#9ca3af', textAlign:'right', marginTop:14 }}>
                {filtered.length} of {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD PRODUCT MODAL
      ══════════════════════════════════════════════════════ */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && closeModal()}
          style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:560, maxHeight:'92vh', overflow:'auto', boxShadow:'0 32px 80px rgba(0,0,0,.2)', animation:'modalIn .22s ease' }}>

            {/* Modal header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 14px', borderBottom:'1px solid #f3f4f6' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#fffbeb', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Plus size={16} color="#f59e0b" />
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:15, color:'#111827', margin:0 }}>Add New Product</p>
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
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Retailer ID (SKU) <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={inp} value={form.retailer_id} onChange={e => setForm(f => ({ ...f, retailer_id:e.target.value }))} placeholder="e.g. SKU-001" autoFocus />
                  <p style={{ fontSize:10, color:'#9ca3af', margin:'3px 0 0' }}>Unique ID for this product. Cannot be changed after creation.</p>
                </div>

                {/* Name */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Product Name <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} placeholder="e.g. Blue Cotton T-Shirt" />
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
