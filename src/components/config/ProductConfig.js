import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5005';

export default function ProductConfig({ data, onChange }) {
  const [products,    setProducts]    = useState([]);
  const [catalogId,   setCatalogId]   = useState('');
  const [loadingProd, setLoadingProd] = useState(false);
  const [prodErr,     setProdErr]     = useState('');

  const msg    = data.message || {};
  const isList = msg.type === 'product_list';

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Load saved catalog and products on mount
  useEffect(() => {
    axios.get(`${API}/api/shop/catalog`, { headers })
      .then(r => {
        if (r.data.catalog?.catalogId) {
          setCatalogId(r.data.catalog.catalogId);
          if (!msg.catalogId) {
            update({ catalogId: r.data.catalog.catalogId });
          }
          loadProducts();
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  const loadProducts = () => {
    setLoadingProd(true);
    setProdErr('');
    axios.get(`${API}/api/shop/products`, { headers })
      .then(r => setProducts(r.data.products || []))
      .catch(e => setProdErr(e.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoadingProd(false));
  };

  const update = (patch) =>
    onChange({ ...data, message: { ...msg, ...patch } });

  const switchType = (newType) => {
    if (newType === 'product') {
      update({ type: 'product', catalogId: msg.catalogId || catalogId, body: msg.body || '', productRetailerId: '' });
    } else {
      update({
        type: 'product_list',
        catalogId: msg.catalogId || catalogId,
        header: msg.header || 'Our Products',
        body: msg.body || '',
        footer: msg.footer || '',
        sections: msg.productSections || [{ id: uuid(), title: 'Section 1', products: [] }],
      });
    }
  };

  const addSection = () => {
    update({ sections: [...(msg.productSections || []), { id: uuid(), title: '', products: [] }] });
  };

  const updateSection = (sIdx, patch) => {
    const sections = (msg.productSections || []).map((s, i) => i === sIdx ? { ...s, ...patch } : s);
    update({ sections });
  };

  const removeSection = (sIdx) => {
    update({ sections: (msg.productSections || []).filter((_, i) => i !== sIdx) });
  };

  const addProductToSection = (sIdx) => {
    const sections = (msg.productSections || []).map((s, i) =>
      i === sIdx ? { ...s, products: [...(s.products || []), { id: uuid(), retailerId: '' }] } : s
    );
    update({ sections });
  };

  const updateProductInSection = (sIdx, pIdx, retailerId) => {
    const sections = (msg.productSections || []).map((s, i) => {
      if (i !== sIdx) return s;
      const prods = (s.products || []).map((p, j) => j === pIdx ? { ...p, retailerId } : p);
      return { ...s, products: prods };
    });
    update({ sections });
  };

  const removeProductFromSection = (sIdx, pIdx) => {
    const sections = (msg.productSections || []).map((s, i) => {
      if (i !== sIdx) return s;
      return { ...s, products: (s.products || []).filter((_, j) => j !== pIdx) };
    });
    update({ sections });
  };

  const productOptions = products.map(p => ({ value: p.retailer_id, label: `${p.name} (${p.retailer_id})` }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Type switcher */}
      <div>
        <label style={labelStyle}>Message Type</label>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {['product', 'product_list'].map(t => (
            <button
              key={t}
              onClick={() => switchType(t)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${(msg.type || 'product') === t ? '#f59e0b' : '#e5e7eb'}`,
                background: (msg.type || 'product') === t ? '#fffbeb' : '#fff',
                color: (msg.type || 'product') === t ? '#b45309' : '#6b7280',
              }}
            >
              {t === 'product' ? '🛍️ Single Product' : '📦 Product List'}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog ID */}
      <div>
        <label style={labelStyle}>Catalog ID</label>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          <input
            style={inputStyle}
            value={msg.catalogId || catalogId}
            onChange={e => { setCatalogId(e.target.value); update({ catalogId: e.target.value }); }}
            placeholder="e.g. 123456789012345"
          />
          <button onClick={loadProducts} title="Reload products" style={iconBtnStyle}>
            <RefreshCw size={13} />
          </button>
        </div>
        {!msg.catalogId && !catalogId && (
          <p style={{ fontSize: 10, color: '#f59e0b', margin: '4px 0 0' }}>
            Connect a catalog in Shop settings first.
          </p>
        )}
      </div>

      {/* Products status */}
      {loadingProd && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Loading products...</p>}
      {prodErr    && <p style={{ fontSize: 11, color: '#ef4444', margin: 0 }}>{prodErr}</p>}
      {!loadingProd && products.length > 0 && (
        <p style={{ fontSize: 10, color: '#059669', margin: 0 }}>✓ {products.length} products loaded from catalog</p>
      )}

      {/* Body */}
      <div>
        <label style={labelStyle}>Body Text</label>
        <textarea
          style={{ ...inputStyle, minHeight: 64, resize: 'vertical', marginTop: 4 }}
          value={msg.body || ''}
          onChange={e => update({ body: e.target.value })}
          placeholder="Message body shown to the customer..."
        />
      </div>

      {/* ── SINGLE PRODUCT ── */}
      {!isList && (
        <div>
          <label style={labelStyle}>Product (Retailer ID)</label>
          {productOptions.length > 0 ? (
            <select
              style={{ ...inputStyle, marginTop: 4 }}
              value={msg.productRetailerId || ''}
              onChange={e => update({ productRetailerId: e.target.value })}
            >
              <option value="">— Select a product —</option>
              {productOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              value={msg.productRetailerId || ''}
              onChange={e => update({ productRetailerId: e.target.value })}
              placeholder="Enter retailer_id manually"
            />
          )}
        </div>
      )}

      {/* ── PRODUCT LIST ── */}
      {isList && (
        <>
          <div>
            <label style={labelStyle}>Header Text</label>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              value={msg.header || ''}
              onChange={e => update({ header: e.target.value })}
              placeholder="Our Products"
            />
          </div>

          <div>
            <label style={labelStyle}>Footer Text (optional)</label>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              value={msg.footer || ''}
              onChange={e => update({ footer: e.target.value })}
              placeholder="Tap any product to order"
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={labelStyle}>Sections</label>
              <button onClick={addSection} style={smallBtnStyle}>
                <Plus size={11} /> Section
              </button>
            </div>

            {(msg.productSections || []).map((sec, sIdx) => (
              <div key={sec.id || sIdx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', marginBottom: 8, background: '#fafafa' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                  <input
                    style={{ ...inputStyle, flex: 1, marginTop: 0 }}
                    value={sec.title || ''}
                    onChange={e => updateSection(sIdx, { title: e.target.value })}
                    placeholder={`Section ${sIdx + 1} title`}
                  />
                  {(msg.productSections || []).length > 1 && (
                    <button onClick={() => removeSection(sIdx)} style={dangerIconBtnStyle}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {(sec.products || []).map((p, pIdx) => (
                  <div key={p.id || pIdx} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    {productOptions.length > 0 ? (
                      <select
                        style={{ ...inputStyle, flex: 1, marginTop: 0, fontSize: 11 }}
                        value={p.retailerId || ''}
                        onChange={e => updateProductInSection(sIdx, pIdx, e.target.value)}
                      >
                        <option value="">— Select product —</option>
                        {productOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        style={{ ...inputStyle, flex: 1, marginTop: 0, fontSize: 11 }}
                        value={p.retailerId || ''}
                        onChange={e => updateProductInSection(sIdx, pIdx, e.target.value)}
                        placeholder="retailer_id"
                      />
                    )}
                    <button onClick={() => removeProductFromSection(sIdx, pIdx)} style={dangerIconBtnStyle}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                <button onClick={() => addProductToSection(sIdx)} style={smallBtnStyle}>
                  <Plus size={11} /> Add Product
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: '#4b5563',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '7px 10px', fontSize: 12, outline: 'none',
  color: '#111827', background: '#fff', boxSizing: 'border-box',
};

const iconBtnStyle = {
  padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 7,
  background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center',
  color: '#6b7280', flexShrink: 0,
};

const smallBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 4,
  fontSize: 11, fontWeight: 600, padding: '4px 8px',
  border: '1px solid #e5e7eb', borderRadius: 6,
  background: '#fff', cursor: 'pointer', color: '#374151',
};

const dangerIconBtnStyle = {
  padding: '5px 6px', border: '1px solid #fee2e2', borderRadius: 6,
  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
  color: '#ef4444', flexShrink: 0,
};
