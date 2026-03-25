export default function TriggerConfig({ data, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={labelStyle}>Keyword</label>
        <input
          style={inputStyle}
          value={data.keyword || ''}
          onChange={e => onChange({ ...data, keyword: e.target.value })}
          placeholder="e.g. hello, price, info"
        />
      </div>
      <div>
        <label style={labelStyle}>Match type</label>
        <select
          style={inputStyle}
          value={data.matchType || 'contains'}
          onChange={e => onChange({ ...data, matchType: e.target.value })}
        >
          <option value="contains">Contains keyword</option>
          <option value="exact">Exact match</option>
        </select>
      </div>
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };