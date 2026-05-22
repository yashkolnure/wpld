import { Handle, Position } from 'reactflow';

const C = { color: '#db2777', bg: '#fdf2f8', border: '#f9a8d4', ring: 'rgba(219,39,119,0.16)' };

const typeEmoji = { image: '🖼️', video: '🎬', document: '📄' };

export default function MediaNode({ data, selected }) {
  const mediaType = data.message?.mediaType || 'image';
  const url       = data.message?.mediaUrl || '';
  const preview   = url.length > 40 ? '…' + url.slice(-37) : url;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 210,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(219,39,119,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />
      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>{typeEmoji[mediaType] || '📎'}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>{mediaType.toUpperCase()} MESSAGE</span>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, color: url ? '#374151' : '#9ca3af', margin: '0 0 3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {preview || 'Set media URL...'}
        </p>
        {data.message?.mediaCaption && (
          <p style={{ fontSize: 11, color: '#6b7280', margin: 0, fontStyle: 'italic' }}>
            "{data.message.mediaCaption}"
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
