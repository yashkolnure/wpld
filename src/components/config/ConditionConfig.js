const OPERATORS = [
  { value: 'equals',       label: '= Equals',          hasValue: true  },
  { value: 'not_equals',   label: '≠ Not equals',       hasValue: true  },
  { value: 'contains',     label: '⊃ Contains',         hasValue: true  },
  { value: 'not_contains', label: '⊅ Does not contain', hasValue: true  },
  { value: 'starts_with',  label: '^ Starts with',      hasValue: true  },
  { value: 'ends_with',    label: '$ Ends with',        hasValue: true  },
  { value: 'greater_than', label: '> Greater than',     hasValue: true  },
  { value: 'less_than',    label: '< Less than',        hasValue: true  },
  { value: 'is_set',       label: '∃ Is set (any value)',hasValue: false },
  { value: 'is_not_set',   label: '∄ Is not set / empty',hasValue: false },
];

export default function ConditionConfig({ data, onChange }) {
  const update    = (patch) => onChange({ ...data, ...patch });
  const operator  = data.operator || 'equals';
  const hasValue  = OPERATORS.find(o => o.value === operator)?.hasValue ?? true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Info banner */}
      <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#92400e', lineHeight: 1.5 }}>
        🔀 Checks a variable and routes the flow: <span style={{ color: '#16a34a', fontWeight: 700 }}>right handle → TRUE</span>, <span style={{ color: '#dc2626', fontWeight: 700 }}>bottom handle → FALSE</span>
      </div>

      {/* Variable */}
      <div>
        <label style={labelStyle}>Variable to check <span style={{ color: '#e53e3e' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{'{{'}</span>
          <input
            style={{ ...inputStyle, paddingLeft: 24, paddingRight: 24, fontFamily: 'monospace', fontWeight: 700, color: '#0369a1' }}
            value={data.variable || ''}
            onChange={e => update({ variable: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
            placeholder="name"
          />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{'}}'}</span>
        </div>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          The variable collected by a Collect Input node earlier in the flow.
        </p>
      </div>

      {/* Operator */}
      <div>
        <label style={labelStyle}>Condition <span style={{ color: '#e53e3e' }}>*</span></label>
        <select
          style={inputStyle}
          value={operator}
          onChange={e => update({ operator: e.target.value })}
        >
          {OPERATORS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Value (hidden for is_set / is_not_set) */}
      {hasValue && (
        <div>
          <label style={labelStyle}>Compare value <span style={{ color: '#e53e3e' }}>*</span></label>
          <input
            style={inputStyle}
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
            placeholder={operator === 'greater_than' || operator === 'less_than' ? 'e.g. 100' : 'e.g. yes'}
          />
          <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
            Comparison is case-insensitive.
          </p>
        </div>
      )}

      {/* Branch diagram */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fafafa', fontSize: 11 }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#374151' }}>Branch routing:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
            <span style={{ color: '#16a34a', fontWeight: 700 }}>TRUE</span>
            <span style={{ color: '#6b7280' }}>— right handle → connect to "yes" path</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
            <span style={{ color: '#dc2626', fontWeight: 700 }}>FALSE</span>
            <span style={{ color: '#6b7280' }}>— bottom handle → connect to "no" path</span>
          </div>
        </div>
      </div>

    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
