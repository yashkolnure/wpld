import { Handle, Position } from 'reactflow';

const C = { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', ring: 'rgba(124,58,237,0.16)' };

export default function FlowNode({ data, selected }) {
  const msg  = data.message || {};
  const body = msg.body || '';
  const preview = body.length > 60 ? body.slice(0, 60) + '…' : body;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12, minWidth: 220, maxWidth: 260,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(124,58,237,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />

      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>📋</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>NATIVE FORM (FLOW)</span>
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {preview || 'Set form intro text...'}
        </p>
        {/* CTA chip */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>📝</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {msg.flowCta || 'Open Form'}
          </span>
        </div>
        <p style={{ fontSize: 9.5, color: msg.flowId ? '#9ca3af' : '#dc2626', margin: '6px 0 0', fontFamily: 'monospace' }}>
          {msg.flowId ? `Flow ID: ${msg.flowId}` : '⚠ No Flow ID set'}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
