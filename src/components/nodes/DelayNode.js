import { Handle, Position } from 'reactflow';

export default function DelayNode({ data, selected }) {
  return (
    <div style={{
      background: selected ? '#F1EFE8' : '#fff',
      border: `1.5px solid ${selected ? '#888780' : '#B4B2A9'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 160,
    }}>
      <Handle type="target" position={Position.Top} />
      <p style={{ fontSize: 11, fontWeight: 600, color: '#5F5E5A', margin: '0 0 4px' }}>DELAY</p>
      <p style={{ fontSize: 13, color: '#2C2C2A', margin: 0 }}>
        Wait {data.delayMinutes || 5} minute{data.delayMinutes !== 1 ? 's' : ''}
      </p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}