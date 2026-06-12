const INPUT_TYPES = [
  { value: 'text',   label: 'Any text',     hint: 'Accepts any reply' },
  { value: 'phone',  label: 'Phone number', hint: 'Validates a 7–15 digit number' },
  { value: 'email',  label: 'Email',        hint: 'Validates an email address' },
  { value: 'number', label: 'Number',       hint: 'Accepts numeric replies only' },
];

export default function InputConfig({ data, onChange }) {
  const update = (patch) => onChange({ ...data, ...patch });

  const variableName = data.variableName || '';
  const inputType    = data.inputType || 'text';
  // keep variable names safe for {{interpolation}}: letters, numbers, underscore
  const onVarChange = (raw) => update({ variableName: raw.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelStyle}>Question to ask</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={data.question || ''}
          onChange={e => update({ question: e.target.value })}
          placeholder="e.g. What's your full name?"
        />
        <p style={hintStyle}>Sent to the customer. The bot then waits for their reply.</p>
      </div>

      <div>
        <label style={labelStyle}>Save answer as variable</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '7px 2px 7px 10px', fontWeight: 700 }}>{'{{'}</span>
          <input
            style={{ ...inputStyle, border: 'none', borderRadius: 0, padding: '7px 2px' }}
            value={variableName}
            onChange={e => onVarChange(e.target.value)}
            placeholder="name"
          />
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '7px 10px 7px 2px', fontWeight: 700 }}>{'}}'}</span>
        </div>
        <p style={hintStyle}>
          Reuse it later in any message as <code style={codeStyle}>{`{{${variableName || 'name'}}}`}</code>.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Expected answer type</label>
        <select style={inputStyle} value={inputType} onChange={e => update({ inputType: e.target.value })}>
          {INPUT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <p style={hintStyle}>{INPUT_TYPES.find(t => t.value === inputType)?.hint}</p>
      </div>

      {inputType !== 'text' && (
        <div>
          <label style={labelStyle}>Retry message (on invalid answer)</label>
          <input
            style={inputStyle}
            value={data.retryMessage || ''}
            onChange={e => update({ retryMessage: e.target.value })}
            placeholder={`Please enter a valid ${inputType}.`}
          />
          <p style={hintStyle}>Shown if the reply doesn't match the expected type. The bot keeps waiting.</p>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
const hintStyle  = { fontSize: 11, color: '#9ca3af', margin: '5px 0 0', lineHeight: 1.5 };
const codeStyle  = { background: '#f0fdfa', color: '#0d9488', borderRadius: 4, padding: '1px 5px', fontSize: 11, fontWeight: 600 };
