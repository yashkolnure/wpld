import { v4 as uuid } from 'uuid';
import { META } from '../../utils/metaLimits';
import { ValidatedInput, labelStyle, inputStyle } from './ValidatedField';

export default function ButtonConfig({ data, onChange }) {
  const msg = data.message || {};
  const buttons = msg.buttons || [{ id: uuid(), title: '' }];
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'button', ...patch } });

  const updateBtn = (idx, title) => {
    // code-point-aware clamp to 20
    const cps = [...title];
    const clamped = cps.length <= META.button.title ? title : cps.slice(0, META.button.title).join('');
    update({ buttons: buttons.map((b, i) => i === idx ? { ...b, title: clamped } : b) });
  };

  const addBtn = () => {
    if (buttons.length >= META.button.maxButtons) return;
    update({ buttons: [...buttons, { id: uuid(), title: '' }] });
  };

  const removeBtn = (idx) => update({ buttons: buttons.filter((_, i) => i !== idx) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ValidatedInput
        label="Header (optional)" value={msg.buttonHeader || ''} limit={META.button.header}
        onChange={v => update({ buttonHeader: v })} placeholder="Header text"
      />
      <ValidatedInput
        label="Body" value={msg.buttonBody || ''} limit={META.button.body} required textarea
        onChange={v => update({ buttonBody: v })} placeholder="Main message text"
      />
      <ValidatedInput
        label="Footer (optional)" value={msg.buttonFooter || ''} limit={META.button.footer}
        onChange={v => update({ buttonFooter: v })} placeholder="Footer text"
      />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={labelStyle}>Buttons ({buttons.length}/{META.button.maxButtons})</label>
          {buttons.length < META.button.maxButtons && (
            <button onClick={addBtn} style={addBtnStyle}>+ Add</button>
          )}
        </div>
        {buttons.map((btn, idx) => {
          const len = [...(btn.title || '')].length;
          const over = len > META.button.title; // can't happen due to clamp, but keep for safety
          return (
            <div key={btn.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, flex: 1, border: `1px solid ${over ? '#fca5a5' : '#e5e7eb'}` }}
                  value={btn.title}
                  onChange={e => updateBtn(idx, e.target.value)}
                  placeholder={`Button ${idx + 1} title`}
                />
                <span style={{ fontSize: 10, fontWeight: 600, color: len >= META.button.title ? '#d97706' : '#9ca3af', fontFamily: 'monospace', minWidth: 36, textAlign: 'right' }}>
                  {len}/{META.button.title}
                </span>
                {buttons.length > 1 && (
                  <button onClick={() => removeBtn(idx)} style={removeBtnStyle}>×</button>
                )}
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>
          Meta allows max {META.button.maxButtons} buttons, {META.button.title} chars each.
        </p>
      </div>
    </div>
  );
}

const addBtnStyle = { fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 };
const removeBtnStyle = { color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px' };
