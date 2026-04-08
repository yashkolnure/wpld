import { v4 as uuid } from 'uuid';

export default function ButtonConfig({ data, onChange }) {
  const msg = data.message || {};
  const buttons = msg.buttons || [{ id: uuid(), title: '' }];
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'button', ...patch } });

  const updateBtn = (idx, title) => {
    const updated = buttons.map((b, i) => i === idx ? { ...b, title } : b);
    update({ buttons: updated });
  };

  const addBtn = () => {
    if (buttons.length >= 3) return;
    update({ buttons: [...buttons, { id: uuid(), title: '' }] });
  };

  const removeBtn = (idx) => update({ buttons: buttons.filter((_, i) => i !== idx) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={labelStyle}>Header (optional)</label>
        <input style={inputStyle} value={msg.buttonHeader || ''} onChange={e => update({ buttonHeader: e.target.value })} placeholder="Header text" />
      </div>
      <div>
        <label style={labelStyle}>Body <span style={{ color: '#e53e3e' }}>*</span></label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={msg.buttonBody || ''} onChange={e => update({ buttonBody: e.target.value })} placeholder="Main message text" />
      </div>
      <div>
        <label style={labelStyle}>Footer (optional)</label>
        <input style={inputStyle} value={msg.buttonFooter || ''} onChange={e => update({ buttonFooter: e.target.value })} placeholder="Footer text" />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ ...labelStyle, margin: 0 }}>Buttons ({buttons.length}/3)</label>
          {buttons.length < 3 && (
            <button onClick={addBtn} style={{ fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add</button>
          )}
        </div>
        {buttons.map((btn, idx) => (
          <div key={btn.id} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={btn.title}
              onChange={e => updateBtn(idx, e.target.value)}
              placeholder={`Button ${idx + 1} title (max 50 chars)`}
              maxLength={50}
            />
            {buttons.length > 1 && (
              <button onClick={() => removeBtn(idx)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>×</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };