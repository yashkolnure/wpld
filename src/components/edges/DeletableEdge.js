import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow';

export default function DeletableEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, style = {}, markerEnd, selected,
}) {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#ef4444' : '#7c3aed',
          strokeWidth: selected ? 2.5 : 2,
          transition: 'stroke 0.15s',
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan edge-delete-wrapper"
        >
          <button
            className="edge-delete-btn"
            title="Delete connection"
            onClick={(e) => {
              e.stopPropagation();
              setEdges(eds => eds.filter(e => e.id !== id));
            }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>

      <style>{`
        .edge-delete-wrapper .edge-delete-btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          padding: 0;
        }
        .edge-delete-wrapper:hover .edge-delete-btn,
        .edge-delete-btn:focus {
          opacity: 1;
          border-color: #ef4444;
          color: #ef4444;
        }
        .edge-delete-btn:hover {
          transform: scale(1.15);
          background: #fef2f2;
        }
      `}</style>
    </>
  );
}
