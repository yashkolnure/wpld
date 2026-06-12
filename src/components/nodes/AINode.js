import { Handle, Position } from 'reactflow';

const C = { color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff', ring: 'rgba(147,51,234,0.16)' };

export default function AINode({ data, selected }) {
  const prompt  = (data.aiPrompt || '').trim();
  const saveAs  = (data.aiSaveAs || '').trim();
  const preview = prompt
    ? (prompt.length > 70 ? prompt.slice(0, 70) + '…' : prompt)
    : 'Replies to the customer using your AI';

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 215,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(147,51,234,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🤖</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>AI REPLY</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: prompt ? '#374151' : '#9ca3af', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontStyle: prompt ? 'normal' : 'italic' }}>
          {preview}
        </p>
        {saveAs && (
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.color, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '2px 7px' }}>
              → {`{{${saveAs}}}`}
            </span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
