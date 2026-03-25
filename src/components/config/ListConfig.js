import { v4 as uuid } from 'uuid';

export default function ListConfig({ data, onChange }) {
  const msg = data.message || {};
  const sections = msg.sections || [{ title: 'Section 1', rows: [{ id: uuid(), title: '', description: '' }] }];
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'list', ...patch } });

  const updateSection = (si, patch) => {
    const updated = sections.map((s, i) => i === si ? { ...s, ...patch } : s);
    update({ sections: updated });
  };

  const updateRow = (si, ri, patch) => {
    const updated = sections.map((s, i) => i === si
      ? { ...s, rows: s.rows.map((r, j) => j === ri ? { ...r, ...patch } : r) }
      : s
    );
    update({ sections: updated });
  };

  const addRow = (si) => {
    updateSection(si, { rows: [...sections[si].rows, { id: uuid(), title: '', description: '' }] });
  };

  const removeRow = (si, ri) => {
    updateSection(si, { rows: sections[si].rows.filter((_, j) => j !== ri) });
  };

  const addSection = () => {
    update({ sections: [...sections, { title: `Section ${sections.length + 1}`, rows: [{ id: uuid(), title: '', description: '' }] }] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={labelStyle}>Header (optional)</label>
        <input style={inputStyle} value={msg.listHeader || ''} onChange={e => update({ listHeader: e.target.value })} placeholder="Header text" />
      </div>
      <div>
        <label style={labelStyle}>Body <span style={{ color: '#e53e3e' }}>*</span></label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={msg.listBody || ''} onChange={e => update({ listBody: e.target.value })} placeholder="Main message text" />
      </div>
      <div>
        <label style={labelStyle}>Button text</label>
        <input style={inputStyle} value={msg.listButtonText || ''} onChange={e => update({ listButtonText: e.target.value })} placeholder="View options" maxLength={20} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ ...labelStyle, margin: 0 }}>Sections</label>
          <button onClick={addSection} style={{ fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Section</button>
        </div>
        {sections.map((sec, si) => (
          <div key={si} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <input
              style={{ ...inputStyle, marginBottom: 8, fontWeight: 600 }}
              value={sec.title}
              onChange={e => updateSection(si, { title: e.target.value })}
              placeholder="Section title"
            />
            {sec.rows.map((row, ri) => (
              <div key={row.id} style={{ background: '#f9fafb', borderRadius: 6, padding: 8, marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={row.title}
                    onChange={e => updateRow(si, ri, { title: e.target.value })}
                    placeholder="Row title (max 24 chars)"
                    maxLength={24}
                  />
                  {sec.rows.length > 1 && (
                    <button onClick={() => removeRow(si, ri)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>×</button>
                  )}
                </div>
                <input
                  style={inputStyle}
                  value={row.description}
                  onChange={e => updateRow(si, ri, { description: e.target.value })}
                  placeholder="Description (optional, max 72 chars)"
                  maxLength={72}
                />
              </div>
            ))}
            <button onClick={() => addRow(si)} style={{ fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add row</button>
          </div>
        ))}
      </div>
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };