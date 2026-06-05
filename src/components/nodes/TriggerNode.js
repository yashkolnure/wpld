import { Handle, Position } from 'reactflow';

const C = { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', ring: 'rgba(124,58,237,0.18)' };

export default function TriggerNode({ data, selected }) {
  const keywords = (data.keyword || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  // Show up to 3 chips; remainder as "+N more"
  const visible  = keywords.slice(0, 3);
  const overflow = keywords.length - visible.length;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 210,
      maxWidth: 260,
      boxShadow: selected
        ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(124,58,237,0.12)`
        : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>⚡</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>KEYWORD TRIGGER</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 600, color: '#9ca3af' }}>
          {data.matchType === 'exact' ? '= Exact' : '≈ Contains'}
        </span>
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        {keywords.length === 0 ? (
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Set keywords...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {visible.map(kw => (
              <span
                key={kw}
                style={{
                  display: 'inline-block',
                  background: '#f5f3ff', border: '1px solid #c4b5fd',
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: 11, fontWeight: 700, color: '#6d28d9',
                  maxWidth: 120, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {kw}
              </span>
            ))}
            {overflow > 0 && (
              <span style={{
                display: 'inline-block',
                background: '#e5e7eb', borderRadius: 6, padding: '2px 8px',
                fontSize: 11, fontWeight: 600, color: '#6b7280',
              }}>
                +{overflow} more
              </span>
            )}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
