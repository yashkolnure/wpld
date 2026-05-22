import { Handle, Position } from 'reactflow';

const C = { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', ring: 'rgba(124,58,237,0.18)' };

export default function TriggerNode({ data, selected }) {
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 210,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(124,58,237,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>⚡</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>KEYWORD TRIGGER</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: data.keyword ? '#111827' : '#9ca3af', margin: '0 0 3px' }}>
          {data.keyword ? `"${data.keyword}"` : 'Set keyword...'}
        </p>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
          {data.matchType === 'exact' ? '= Exact match' : '≈ Contains keyword'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
