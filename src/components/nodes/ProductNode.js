import { Handle, Position } from 'reactflow';

const C = { color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', ring: 'rgba(245,158,11,0.16)' };

export default function ProductNode({ data, selected }) {
  const msg     = data.message || {};
  const isList  = msg.type === 'product_list';
  const label   = isList ? 'PRODUCT LIST' : 'PRODUCT';
  const preview = msg.body
    ? (msg.body.length > 60 ? msg.body.slice(0, 60) + '…' : msg.body)
    : null;

  const productCount = isList
    ? (msg.sections || []).reduce((acc, s) => acc + (s.products || []).length, 0)
    : (msg.productRetailerId ? 1 : 0);

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? C.color : C.border}`,
      borderLeft: `4px solid ${C.color}`,
      borderRadius: 12,
      minWidth: 210,
      boxShadow: selected ? `0 0 0 3px ${C.ring}, 0 6px 20px rgba(245,158,11,0.12)` : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', top: -5 }} />

      <div style={{ background: C.bg, borderRadius: '8px 8px 0 0', padding: '7px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>🛍️</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.color, letterSpacing: '0.06em' }}>{label}</span>
        {productCount > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 10, background: C.color, color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 700 }}>
            {productCount} item{productCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        {msg.catalogId ? (
          <>
            <p style={{ fontSize: 10, color: '#9ca3af', margin: '0 0 4px', fontFamily: 'monospace' }}>
              Catalog: {msg.catalogId.slice(0, 12)}…
            </p>
            <p style={{ fontSize: 12, color: preview ? '#374151' : '#9ca3af', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {preview || 'No body text set'}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Configure product...</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: C.color, width: 10, height: 10, border: '2.5px solid #fff', bottom: -5 }} />
    </div>
  );
}
