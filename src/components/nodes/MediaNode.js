import { Handle, Position } from 'reactflow';

export default function MediaNode({ data, selected }) {
  return (
    <div style={{
      background: selected ? '#FAECE7' : '#fff',
      border: `1.5px solid ${selected ? '#D85A30' : '#F0997B'}`,
      borderRadius: 10, padding: '10px 14px', minWidth: 180,
    }}>
      <Handle type="target" position={Position.Top} />
      <p style={{ fontSize: 11, fontWeight: 600, color: '#993C1D', margin: '0 0 4px' }}>
        {(data.message?.mediaType || 'MEDIA').toUpperCase()} MESSAGE
      </p>
      <p style={{ fontSize: 12, color: '#712B13', margin: '0 0 2px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {data.message?.mediaUrl || 'Set media URL...'}
      </p>
      <p style={{ fontSize: 11, color: '#D85A30', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {data.message?.mediaCaption || 'No caption'}
      </p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}