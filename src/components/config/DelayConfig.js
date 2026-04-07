export default function DelayConfig({ data, onChange }) {
  return (
    <div>
      <label style={labelStyle}>Wait duration (minutes)</label>
      <input
        type="number"
        min={0.1}
        step={0.1}
        max={1440}
        style={inputStyle}
        value={data.delayMinutes || 5}
        onChange={e => onChange({ ...data, delayMinutes: parseInt(e.target.value) || 1 })}
      />
      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Max 1440 min (24 hours)</p>
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };