import { Handle, Position } from 'reactflow';

const C = { color: '#b45309', bg: '#fffbeb', border: '#fcd34d', ring: 'rgba(180,83,9,0.16)' };

export default function ListNode({ data, selected }) {
  const sections = data.message?.sections || [];
  const allRows  = sections.flatMap(s => s.rows || []);

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 220,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(180,83,9,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>📋</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>LIST MESSAGE</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: data.message?.listBody ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.4 }}>
          {data.message?.listBody || 'Set list body...'}
        </p>
        {allRows.map((row, idx) => (
          <div key={row.id} style={{ position: 'relative', marginBottom: idx < allRows.length - 1 ? 5 : 0 }}>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 32px 5px 10px', background: C.bg }}>
              <p style={{ margin: 0, fontSize: 12, color: C.color, fontWeight: 500 }}>{row.title || `Row ${idx + 1}`}</p>
              {row.description && <p style={{ margin: 0, fontSize: 10, color: '#92400e' }}>{row.description}</p>}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={row.id}
              style={{ top: '50%', right: -6, transform: 'translateY(-50%)', background: C.color, width: 10, height: 10, border: '2.5px solid #fff' }}
            />
          </div>
        ))}
        {allRows.length === 0 && (
          <Handle type="source" position={Position.Bottom}
            style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
        )}
      </div>
    </div>
  );
}
