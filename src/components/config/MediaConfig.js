export default function MediaConfig({ data, onChange }) {
  const msg = data.message || {};
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'media', ...patch } });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={labelStyle}>Media type</label>
        <select style={inputStyle} value={msg.mediaType || 'image'} onChange={e => update({ mediaType: e.target.value })}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Media URL <span style={{ color: '#e53e3e' }}>*</span></label>
        <input style={inputStyle} value={msg.mediaUrl || ''} onChange={e => update({ mediaUrl: e.target.value })} placeholder="https://..." />
      </div>
      <div>
        <label style={labelStyle}>Caption (optional)</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={msg.mediaCaption || ''} onChange={e => update({ mediaCaption: e.target.value })} placeholder="Caption text" />
      </div>
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };