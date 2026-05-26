import { Handle, Position } from 'reactflow';

const C = { color: '#6b7280', bg: '#f9fafb', border: '#d1d5db', ring: 'rgba(107,114,128,0.16)' };

export default function DelayNode({ data, selected }) {
  const mins = data.delayMinutes || 5;
  const label = mins >= 60
    ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? (mins % 60) + 'm' : ''}`.trim()
    : `${mins} minute${mins !== 1 ? 's' : ''}`;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 180,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(107,114,128,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>⏱️</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>DELAY</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>
          Wait {label}
        </p>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>before next step</p>
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
