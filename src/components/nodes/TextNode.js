import { Handle, Position } from 'reactflow';

const C = { color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', ring: 'rgba(5,150,105,0.16)' };

export default function TextNode({ data, selected }) {
  const text    = data.message?.text || '';
  const preview = text.length > 72 ? text.slice(0, 72) + '…' : text;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 210,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(5,150,105,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>💬</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>TEXT MESSAGE</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {preview || 'Set message text...'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
