import { Handle, Position } from 'reactflow';

export default function ButtonNode({ data, selected }) {
  const btns = data.message?.buttons || [];

  return (
    <div style={{
      background: selected ? '#E6F1FB' : '#fff',
      border: `1.5px solid ${selected ? '#378ADD' : '#85B7EB'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 220,
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top} />

      <p style={{ fontSize: 11, fontWeight: 600, color: '#185FA5', margin: '0 0 4px' }}>BUTTON MESSAGE</p>
      {data.message?.buttonHeader && (
        <p style={{ fontSize: 12, fontWeight: 600, color: '#0C447C', margin: '0 0 2px' }}>{data.message.buttonHeader}</p>
      )}
      <p style={{ fontSize: 12, color: '#0C447C', margin: '0 0 10px' }}>
        {data.message?.buttonBody || 'Set message body...'}
      </p>

      {/* Each button has its own source handle */}
      {btns.map((btn, idx) => (
        <div key={btn.id} style={{ position: 'relative', marginBottom: 6 }}>
          <div style={{
            border: '1px solid #85B7EB', borderRadius: 8,
            padding: '6px 10px', fontSize: 12, color: '#185FA5',
            background: '#E6F1FB', textAlign: 'center',
            paddingRight: 20,
          }}>
            {btn.title || `Button ${idx + 1}`}
          </div>
          {/* Handle positioned on the right of each button */}
          <Handle
            type="source"
            position={Position.Right}
            id={btn.id}
            style={{
              top: '50%',
              right: -8,
              transform: 'translateY(-50%)',
              background: '#378ADD',
              width: 10, height: 10,
              border: '2px solid #fff',
            }}
          />
        </div>
      ))}

      {btns.length === 0 && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
}