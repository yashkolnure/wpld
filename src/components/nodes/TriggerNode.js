import { Handle, Position } from 'reactflow';

export default function TriggerNode({ data, selected }) {
  return (
    <div style={{
      background: selected ? '#EEEDFE' : '#fff',
      border: `1.5px solid ${selected ? '#7F77DD' : '#AFA9EC'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 180,
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#534AB7', margin: '0 0 4px' }}>KEYWORD TRIGGER</p>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#26215C', margin: 0 }}>
        {data.keyword ? `"${data.keyword}"` : 'Set keyword...'}
      </p>
      <p style={{ fontSize: 11, color: '#7F77DD', margin: '2px 0 0' }}>
        {data.matchType === 'exact' ? 'Exact match' : 'Contains'}
      </p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}