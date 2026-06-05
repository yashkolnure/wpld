export default function InputConfig({ data, onChange }) {
  const update = (patch) => onChange({ ...data, ...patch });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Info banner */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#0369a1', lineHeight: 1.5 }}>
        💡 Sends the question to the user, waits for their reply, then stores it in a variable you can use later with <code style={{ background: '#e0f2fe', borderRadius: 3, padding: '1px 4px' }}>{'{{variableName}}'}</code>
      </div>

      {/* Question text */}
      <div>
        <label style={labelStyle}>Question to ask <span style={{ color: '#e53e3e' }}>*</span></label>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
          value={data.question || ''}
          onChange={e => update({ question: e.target.value })}
          placeholder="e.g. What is your name?"
        />
      </div>

      {/* Variable name */}
      <div>
        <label style={labelStyle}>Save answer as variable <span style={{ color: '#e53e3e' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{'{{'}</span>
          <input
            style={{ ...inputStyle, paddingLeft: 24, paddingRight: 24, fontFamily: 'monospace', fontWeight: 600, color: '#0369a1' }}
            value={data.variableName || ''}
            onChange={e => update({ variableName: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
            placeholder="name"
          />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{'}}'}</span>
        </div>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          Alphanumeric only. Use in messages as <code>{'{{' + (data.variableName || 'name') + '}}'}</code>
        </p>
      </div>

      {/* Input type */}
      <div>
        <label style={labelStyle}>Input type</label>
        <select style={inputStyle} value={data.inputType || 'text'} onChange={e => update({ inputType: e.target.value })}>
          <option value="text">📝 Any text</option>
          <option value="phone">📱 Phone number</option>
          <option value="email">📧 Email address</option>
          <option value="number">🔢 Number only</option>
        </select>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          Invalid answers send the retry message below
        </p>
      </div>

      {/* Retry message */}
      <div>
        <label style={labelStyle}>Invalid input reply (optional)</label>
        <input
          style={inputStyle}
          value={data.retryMessage || ''}
          onChange={e => update({ retryMessage: e.target.value })}
          placeholder="e.g. Please enter a valid phone number."
        />
      </div>

    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
