const OPERATORS = [
  { value: 'equals',       label: 'is equal to' },
  { value: 'not_equals',   label: 'is not equal to' },
  { value: 'contains',     label: 'contains' },
  { value: 'not_contains', label: "doesn't contain" },
  { value: 'starts_with',  label: 'starts with' },
  { value: 'ends_with',    label: 'ends with' },
  { value: 'greater_than', label: 'is greater than (number)' },
  { value: 'less_than',    label: 'is less than (number)' },
  { value: 'is_set',       label: 'is set (has any value)' },
  { value: 'is_not_set',   label: 'is empty' },
];

export default function ConditionConfig({ data, onChange }) {
  const update = (patch) => onChange({ ...data, ...patch });

  const variable = data.variable || '';
  const operator = data.operator || 'equals';
  const noValue  = operator === 'is_set' || operator === 'is_not_set';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '10px 12px' }}>
        <p style={{ fontSize: 11, color: '#4338ca', margin: 0, lineHeight: 1.5 }}>
          Branches the flow into <b>✓ Yes</b> / <b>✗ No</b> paths. Connect each handle at the
          bottom of the node to the next step.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Variable to check</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '8px 2px 8px 10px', fontWeight: 700 }}>{'{{'}</span>
          <input
            style={{ ...inputStyle, border: 'none', borderRadius: 0, padding: '8px 2px' }}
            value={variable}
            onChange={e => update({ variable: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) })}
            placeholder="name"
          />
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '8px 10px 8px 2px', fontWeight: 700 }}>{'}}'}</span>
        </div>
        <p style={hintStyle}>A variable captured earlier by a Collect Input node.</p>
      </div>

      <div>
        <label style={labelStyle}>Condition</label>
        <select style={inputStyle} value={operator} onChange={e => update({ operator: e.target.value })}>
          {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {!noValue && (
        <div>
          <label style={labelStyle}>Value to compare</label>
          <input
            style={inputStyle}
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
            placeholder="e.g. yes"
          />
          <p style={hintStyle}>Comparison is case-insensitive.</p>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
const hintStyle  = { fontSize: 11, color: '#9ca3af', margin: '5px 0 0', lineHeight: 1.5 };
