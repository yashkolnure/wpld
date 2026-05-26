import { Handle, Position } from 'reactflow';

const C = { color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', ring: 'rgba(37,99,235,0.16)' };

export default function ButtonNode({ data, selected }) {
  const btns = data.message?.buttons || [];

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 220,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(37,99,235,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🔘</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>BUTTON MESSAGE</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: data.message?.buttonBody ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.4 }}>
          {data.message?.buttonBody || 'Set message body...'}
        </p>
        {btns.map((btn, idx) => (
          <div key={btn.id} style={{ position: 'relative', marginBottom: idx < btns.length - 1 ? 5 : 0 }}>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 32px 5px 10px', fontSize: 12, color: C.color, background: C.bg, fontWeight: 500 }}>
              {btn.title || `Button ${idx + 1}`}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={btn.id}
              style={{ top: '50%', right: -6, transform: 'translateY(-50%)', background: C.color, width: 10, height: 10, border: '2.5px solid #fff' }}
            />
          </div>
        ))}
        {btns.length === 0 && (
          <Handle type="source" position={Position.Bottom}
            style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
        )}
      </div>
    </div>
  );
}
