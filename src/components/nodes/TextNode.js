import { Handle, Position } from 'reactflow';

export default function TextNode({ data, selected }) {
  return (
    <div style={{
      background: selected ? '#E1F5EE' : '#fff',
      border: `1.5px solid ${selected ? '#1D9E75' : '#5DCAA5'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 180,
    }}>
      <Handle type="target" position={Position.Top} />
      <p style={{ fontSize: 11, fontWeight: 600, color: '#0F6E56', margin: '0 0 4px' }}>TEXT MESSAGE</p>
      <p style={{ fontSize: 12, color: '#085041', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {data.message?.text || 'Set message text...'}
      </p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}