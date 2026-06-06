import { Handle, Position } from 'reactflow';

const C = { color: '#0d9488', bg: '#f0fdfa', border: '#5eead4', ring: 'rgba(13,148,136,0.16)' };

export default function CtaUrlNode({ data, selected }) {
  const msg  = data.message || {};
  const body = msg.body || '';
  const preview = body.length > 70 ? body.slice(0, 70) + '…' : body;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12, minWidth: 220, maxWidth: 260,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(13,148,136,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />

      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🔗</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>LINK BUTTON</span>
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {preview || 'Set message text...'}
        </p>
        {/* Button-styled chip */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.color} strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {msg.buttonText || 'Open Link'}
          </span>
        </div>
        {msg.url && (
          <p style={{ fontSize: 9.5, color: '#9ca3af', margin: '6px 0 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {msg.url.length > 42 ? msg.url.slice(0, 42) + '…' : msg.url}
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
