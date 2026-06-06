import { cpLength } from '../../utils/metaLimits';

/**
 * Reusable validated text input / textarea with a live character counter
 * that turns red when over Meta's limit. Enforces a hard cap via maxLength
 * (code-point aware) so users physically cannot exceed the limit.
 */
export function ValidatedInput({
  label, value = '', onChange, limit, required = false,
  placeholder = '', textarea = false, minHeight = 60, hint, type = 'text',
}) {
  const len     = cpLength(value);
  const over    = len > limit;
  const near     = len >= limit * 0.85 && !over;
  const counterColor = over ? '#dc2626' : near ? '#d97706' : '#9ca3af';

  // Code-point-aware clamp so emoji don't let users sneak past the limit
  const handleChange = (e) => {
    const raw = e.target.value;
    const cps = [...raw];
    onChange(cps.length <= limit ? raw : cps.slice(0, limit).join(''));
  };

  const fieldStyle = {
    width: '100%',
    border: `1px solid ${over ? '#fca5a5' : '#e5e7eb'}`,
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 13,
    boxSizing: 'border-box',
    background: '#fff',
    outline: 'none',
    ...(textarea ? { resize: 'vertical', minHeight, fontFamily: 'inherit' } : {}),
  };

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <label style={labelStyle}>
            {label}{required && <span style={{ color: '#e53e3e' }}> *</span>}
          </label>
          <span style={{ fontSize: 10, fontWeight: 600, color: counterColor, fontFamily: 'monospace' }}>
            {len}/{limit}
          </span>
        </div>
      )}
      {textarea ? (
        <textarea style={fieldStyle} value={value} onChange={handleChange} placeholder={placeholder} />
      ) : (
        <input type={type} style={fieldStyle} value={value} onChange={handleChange} placeholder={placeholder} />
      )}
      {hint && <p style={{ fontSize: 10, color: over ? '#dc2626' : '#9ca3af', margin: '4px 0 0' }}>{over ? `Max ${limit} characters` : hint}</p>}
    </div>
  );
}

export const labelStyle = {
  fontSize: 11, fontWeight: 700, color: '#4b5563',
  display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '7px 10px', fontSize: 13, boxSizing: 'border-box',
  background: '#fff', outline: 'none',
};
