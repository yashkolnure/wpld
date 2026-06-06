import { v4 as uuid } from 'uuid';
import { META, cpLength } from '../../utils/metaLimits';
import { ValidatedInput, labelStyle, inputStyle } from './ValidatedField';

export default function ListConfig({ data, onChange }) {
  const msg = data.message || {};
  const sections = msg.sections || [{ title: 'Section 1', rows: [{ id: uuid(), title: '', description: '' }] }];
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'list', ...patch } });

  const totalRows = sections.reduce((sum, s) => sum + (s.rows || []).length, 0);

  const clamp = (str, limit) => {
    const cps = [...(str || '')];
    return cps.length <= limit ? (str || '') : cps.slice(0, limit).join('');
  };

  const updateSection = (si, patch) => {
    update({ sections: sections.map((s, i) => i === si ? { ...s, ...patch } : s) });
  };
  const updateRow = (si, ri, patch) => {
    update({ sections: sections.map((s, i) => i === si
      ? { ...s, rows: s.rows.map((r, j) => j === ri ? { ...r, ...patch } : r) }
      : s) });
  };
  const addRow = (si) => {
    if (totalRows >= META.list.maxRowsTotal) return;
    updateSection(si, { rows: [...sections[si].rows, { id: uuid(), title: '', description: '' }] });
  };
  const removeRow = (si, ri) => updateSection(si, { rows: sections[si].rows.filter((_, j) => j !== ri) });
  const addSection = () => {
    if (sections.length >= META.list.maxSections) return;
    update({ sections: [...sections, { title: `Section ${sections.length + 1}`, rows: [{ id: uuid(), title: '', description: '' }] }] });
  };
  const removeSection = (si) => update({ sections: sections.filter((_, i) => i !== si) });

  const canAddRow = totalRows < META.list.maxRowsTotal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ValidatedInput label="Header (optional)" value={msg.listHeader || ''} limit={META.list.header}
        onChange={v => update({ listHeader: v })} placeholder="Header text" />
      <ValidatedInput label="Body" value={msg.listBody || ''} limit={META.list.body} required textarea
        onChange={v => update({ listBody: v })} placeholder="Main message text" />
      <ValidatedInput label="Footer (optional)" value={msg.listFooter || ''} limit={META.list.footer}
        onChange={v => update({ listFooter: v })} placeholder="Footer text" />
      <ValidatedInput label="Button text" value={msg.listButtonText || ''} limit={META.list.buttonText}
        onChange={v => update({ listButtonText: v })} placeholder="View options" />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={labelStyle}>
            Sections ({sections.length}/{META.list.maxSections}) · Rows ({totalRows}/{META.list.maxRowsTotal})
          </label>
          {sections.length < META.list.maxSections && (
            <button onClick={addSection} style={addLink}>+ Section</button>
          )}
        </div>

        {sections.map((sec, si) => (
          <div key={si} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1, fontWeight: 600 }}
                value={sec.title}
                onChange={e => updateSection(si, { title: clamp(e.target.value, META.list.sectionTitle) })}
                placeholder="Section title"
              />
              <span style={counterStyle(cpLength(sec.title), META.list.sectionTitle)}>{cpLength(sec.title)}/{META.list.sectionTitle}</span>
              {sections.length > 1 && (
                <button onClick={() => removeSection(si)} style={removeStyle}>×</button>
              )}
            </div>

            {sec.rows.map((row, ri) => (
              <div key={row.id} style={{ background: '#f9fafb', borderRadius: 6, padding: 8, marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={row.title}
                    onChange={e => updateRow(si, ri, { title: clamp(e.target.value, META.list.rowTitle) })}
                    placeholder="Row title"
                  />
                  <span style={counterStyle(cpLength(row.title), META.list.rowTitle)}>{cpLength(row.title)}/{META.list.rowTitle}</span>
                  {sec.rows.length > 1 && (
                    <button onClick={() => removeRow(si, ri)} style={removeStyle}>×</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={row.description}
                    onChange={e => updateRow(si, ri, { description: clamp(e.target.value, META.list.rowDesc) })}
                    placeholder="Description (optional)"
                  />
                  <span style={counterStyle(cpLength(row.description), META.list.rowDesc)}>{cpLength(row.description)}/{META.list.rowDesc}</span>
                </div>
              </div>
            ))}

            {canAddRow ? (
              <button onClick={() => addRow(si)} style={addLink}>+ Add row</button>
            ) : (
              <p style={{ fontSize: 10, color: '#d97706', margin: '4px 0 0' }}>Max {META.list.maxRowsTotal} rows total reached.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const counterStyle = (len, limit) => ({
  fontSize: 10, fontWeight: 600, fontFamily: 'monospace', minWidth: 38, textAlign: 'right',
  color: len > limit ? '#dc2626' : len >= limit * 0.85 ? '#d97706' : '#9ca3af',
});
const addLink = { fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 };
const removeStyle = { color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 };
