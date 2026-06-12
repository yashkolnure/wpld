import { Handle, Position } from 'reactflow';

const C = { color: '#0d9488', bg: '#f0fdfa', border: '#5eead4', ring: 'rgba(13,148,136,0.16)' };

const TYPE_LABEL = { text: 'Any text', phone: 'Phone number', email: 'Email address', number: 'Number' };

export default function InputNode({ data, selected }) {
  const question = data.question || '';
  const varName  = data.variableName || 'input';
  const type     = data.inputType || 'text';
  const preview  = question.length > 64 ? question.slice(0, 64) + '…' : question;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 215,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(13,148,136,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>📥</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>COLLECT INPUT</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: '0 0 8px', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {preview || 'Set a question to ask...'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.color, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '2px 7px' }}>
            {`{{${varName}}}`}
          </span>
          <span style={{ fontSize: 10, color: '#6b7280' }}>{TYPE_LABEL[type] || 'Any text'}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
