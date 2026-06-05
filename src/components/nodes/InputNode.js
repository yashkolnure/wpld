import { Handle, Position } from 'reactflow';

const C = { color: '#0891b2', bg: '#ecfeff', border: '#67e8f9', ring: 'rgba(8,145,178,0.16)' };

const typeIcon = { text: '📝', phone: '📱', email: '📧', number: '🔢' };

export default function InputNode({ data, selected }) {
  const question = data.question || '';
  const varName  = data.variableName || '';
  const type     = data.inputType || 'text';
  const preview  = question.length > 60 ? question.slice(0, 60) + '…' : question;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 220,
      boxShadow: selected
        ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(8,145,178,0.12)`
        : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />

      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>📝</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>COLLECT INPUT</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, background: C.color, color: '#fff', borderRadius: 8, padding: '1px 7px', fontWeight: 700 }}>
          {typeIcon[type]} {type}
        </span>
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {preview || 'Set question text...'}
        </p>
        {varName && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, padding: '3px 8px' }}>
            <span style={{ fontSize: 10, color: '#0369a1', fontFamily: 'monospace', fontWeight: 700 }}>
              {'{{' + varName + '}}'}
            </span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
