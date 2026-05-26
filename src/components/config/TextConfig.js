import React, { useState } from 'react';
import { Link2, Plus, X, Check } from 'lucide-react';

export default function TextConfig({ data, onChange }) {
  const [link, setLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const msg = data.message || {};

  const update = (patch) =>
    onChange({ ...data, message: { ...msg, type: 'text', ...patch } });

  const handleInsertLink = () => {
    if (!link.trim()) return;
    
    const currentText = msg.text || '';
    // Append link on a new line if text exists
    const newText = currentText + (currentText ? '\n' : '') + link.trim();
    
    update({ text: newText });
    setLink('');
    setShowLinkInput(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={labelStyle}>Message text</label>
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
        <textarea
          style={{ 
            width: '100%', 
            border: 'none', 
            padding: '12px', 
            fontSize: 13, 
            minHeight: 120, 
            outline: 'none', 
            resize: 'vertical',
            display: 'block',
            boxSizing: 'border-box'
          }}
          value={msg.text || ''}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Type your WhatsApp message..."
        />

        {/* --- Dynamic Toolbar Section --- */}
        <div style={toolbarStyle}>
          {!showLinkInput ? (
            <button 
              onClick={() => setShowLinkInput(true)} 
              style={toolBtnStyle}
            >
              <Plus size={14} /> <span>Add Form Link</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', animation: 'fadeIn 0.2s' }}>
              <Link2 size={14} color="#16a34a" />
              <input 
                autoFocus
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste your form link here..."
                style={linkInputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleInsertLink()}
              />
              <button onClick={handleInsertLink} style={confirmBtnStyle}>
                <Check size={14} />
              </button>
              <button onClick={() => setShowLinkInput(false)} style={cancelBtnStyle}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* --- Styles --- */
const labelStyle = { 
  fontSize: 11, 
  fontWeight: 700, 
  color: '#4b5563', 
  textTransform: 'uppercase', 
  letterSpacing: '0.05em' 
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  background: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
  minHeight: '40px'
};

const toolBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  padding: '5px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#374151',
  cursor: 'pointer',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const linkInputStyle = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  fontSize: '12px',
  outline: 'none',
  color: '#1e293b'
};

const confirmBtnStyle = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const cancelBtnStyle = {
  background: '#f3f4f6',
  color: '#6b7280',
  border: 'none',
  borderRadius: '4px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};