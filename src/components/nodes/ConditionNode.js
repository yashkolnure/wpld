import { Handle, Position } from 'reactflow';

const C = { color: '#d97706', bg: '#fffbeb', border: '#fcd34d', ring: 'rgba(217,119,6,0.16)' };

const OP_LABELS = {
  equals:        '=',
  not_equals:    '≠',
  contains:      '⊃',
  not_contains:  '⊅',
  starts_with:   '^=',
  ends_with:     '=$',
  is_set:        '∃',
  is_not_set:    '∄',
  greater_than:  '>',
  less_than:     '<',
};

export default function ConditionNode({ data, selected }) {
  const variable = data.variable   || '';
  const operator = data.operator   || 'equals';
  const value    = data.value      || '';
  const noValue  = ['is_set', 'is_not_set'].includes(operator);

  const label    = OP_LABELS[operator] || '=';
  const varChip  = variable ? `{{${variable}}}` : '{{…}}';
  const valChip  = noValue ? '' : (value ? `"${value.length > 12 ? value.slice(0,12)+'…' : value}"` : '…');

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 230,
      boxShadow: selected
        ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(217,119,6,0.12)`
        : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />

      {/* Header */}
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🔀</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>CONDITION</span>
      </div>

      {/* Body: condition expression */}
      <div style={{ padding: '10px 12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: 5, padding: '2px 7px', fontFamily: 'monospace' }}>
            {varChip}
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.color, minWidth: 18, textAlign: 'center' }}>
            {label}
          </span>
          {!noValue && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 5, padding: '2px 7px' }}>
              {valChip}
            </span>
          )}
        </div>

        {/* True / False branch labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>TRUE →</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>↓ FALSE</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
          </div>
        </div>
      </div>

      {/* TRUE handle — right side */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ background: '#16a34a', width: 12, height: 12, border: '2.5px solid #fff', right: -6, top: '65%' }}
      />

      {/* FALSE handle — bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ background: '#dc2626', width: 12, height: 12, border: '2.5px solid #fff', bottom: -6 }}
      />
    </div>
  );
}
