export default function TextConfig({ data, onChange }) {
  const msg = data.message || {};
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'text', ...patch } });
  return (
    <div>
      <label style={labelStyle}>Message text</label>
      <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
        value={msg.text || ''}
        onChange={e => update({ text: e.target.value })}
        placeholder="Type your message..."
      />
    </div>
  );
}
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };