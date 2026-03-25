import { Handle, Position } from 'reactflow';

export default function ListNode({ data, selected }) {
  const sections = data.message?.sections || [];
  const allRows  = sections.flatMap(s => s.rows || []);

  return (
    <div style={{
      background: selected ? '#FAEEDA' : '#fff',
      border: `1.5px solid ${selected ? '#BA7517' : '#EF9F27'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 220,
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top} />

      <p style={{ fontSize: 11, fontWeight: 600, color: '#854F0B', margin: '0 0 4px' }}>LIST MESSAGE</p>
      {data.message?.listHeader && (
        <p style={{ fontSize: 12, fontWeight: 600, color: '#633806', margin: '0 0 2px' }}>{data.message.listHeader}</p>
      )}
      <p style={{ fontSize: 12, color: '#633806', margin: '0 0 10px' }}>
        {data.message?.listBody || 'Set list body...'}
      </p>

      {/* Each row has its own source handle */}
      {allRows.map((row, idx) => (
        <div key={row.id} style={{ position: 'relative', marginBottom: 6 }}>
          <div style={{
            border: '1px solid #EF9F27', borderRadius: 8,
            padding: '6px 10px', fontSize: 12, color: '#854F0B',
            background: '#FAEEDA', paddingRight: 20,
          }}>
            <p style={{ margin: 0, fontWeight: 500 }}>{row.title || `Row ${idx + 1}`}</p>
            {row.description && (
              <p style={{ margin: 0, fontSize: 10, color: '#BA7517' }}>{row.description}</p>
            )}
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id={row.id}
            style={{
              top: '50%',
              right: -8,
              transform: 'translateY(-50%)',
              background: '#BA7517',
              width: 10, height: 10,
              border: '2px solid #fff',
            }}
          />
        </div>
      ))}

      {allRows.length === 0 && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
}