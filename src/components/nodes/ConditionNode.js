import { Handle, Position } from 'reactflow';

const C = { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', ring: 'rgba(79,70,229,0.16)' };

const OP_LABEL = {
  equals: 'is equal to', not_equals: 'is not', contains: 'contains', not_contains: "doesn't contain",
  starts_with: 'starts with', ends_with: 'ends with', greater_than: 'is greater than',
  less_than: 'is less than', is_set: 'is set', is_not_set: 'is empty',
};

export default function ConditionNode({ data, selected }) {
  const variable = data.variable || '';
  const operator = data.operator || 'equals';
  const value    = data.value || '';
  const noValue  = operator === 'is_set' || operator === 'is_not_set';

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 220,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(79,70,229,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🔀</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>CONDITION</span>
      </div>
      <div style={{ padding: '10px 12px 14px' }}>
        {variable ? (
          <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5 }}>
            If <b style={{ color: C.color }}>{`{{${variable}}}`}</b> {OP_LABEL[operator] || operator}
            {!noValue && <> <b style={{ color: '#111827' }}>"{value || '…'}"</b></>}
          </p>
        ) : (
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Set a variable to check...</p>
        )}
      </div>

      {/* Two outgoing branches: true (Yes) and false (No) */}
      <div style={{ display: 'flex', borderTop: `1px solid ${C.border}` }}>
        <div style={{ flex: 1, position: 'relative', padding: '6px 0', textAlign: 'center', borderRight: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>✓ Yes</span>
          <Handle type="source" position={Position.Bottom} id="true"
            style={{ left: '50%', bottom: -5, background: '#059669', width: 10, height: 10, border: '2.5px solid #fff' }} />
        </div>
        <div style={{ flex: 1, position: 'relative', padding: '6px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>✗ No</span>
          <Handle type="source" position={Position.Bottom} id="false"
            style={{ left: '50%', bottom: -5, background: '#dc2626', width: 10, height: 10, border: '2.5px solid #fff' }} />
        </div>
      </div>
    </div>
  );
}
