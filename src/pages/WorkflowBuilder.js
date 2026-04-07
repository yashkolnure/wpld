import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge, MiniMap, Controls, Background,
  useNodesState, useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { nodeTypes }   from '../components/nodes';
import TriggerConfig   from '../components/config/TriggerConfig';
import TextConfig      from '../components/config/TextConfig';
import ButtonConfig    from '../components/config/ButtonConfig';
import ListConfig      from '../components/config/ListConfig';
import MediaConfig     from '../components/config/MediaConfig';
import DelayConfig     from '../components/config/DelayConfig';
import TemplatePicker  from '../components/TemplatePicker';
import TestPanel       from '../components/test/TestPanel';

const API = '';

const palette = [
  { type: 'trigger', label: 'Keyword trigger', color: '#534AB7', bg: '#EEEDFE', border: '#AFA9EC' },
  { type: 'text',    label: 'Text message',    color: '#0F6E56', bg: '#E1F5EE', border: '#5DCAA5' },
  { type: 'button',  label: 'Button message',  color: '#185FA5', bg: '#E6F1FB', border: '#85B7EB' },
  { type: 'list',    label: 'List message',    color: '#854F0B', bg: '#FAEEDA', border: '#EF9F27' },
  { type: 'media',   label: 'Media message',   color: '#993C1D', bg: '#FAECE7', border: '#F0997B' },
  { type: 'delay',   label: 'Delay',           color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A9' },
];

const defaultData = (type) => {
  if (type === 'trigger') return { keyword: '', matchType: 'contains' };
  if (type === 'text')    return { message: { type: 'text', text: '' } };
  if (type === 'button')  return { message: { type: 'button', buttonBody: '', buttons: [{ id: uuid(), title: '' }] } };
  if (type === 'list')    return { message: { type: 'list', listBody: '', listButtonText: 'View options', sections: [{ title: 'Section 1', rows: [{ id: uuid(), title: '', description: '' }] }] } };
  if (type === 'media')   return { message: { type: 'media', mediaType: 'image', mediaUrl: '', mediaCaption: '' } };
  if (type === 'delay')   return { delayMinutes: 5 };
  return {};
};

// Convert schema node type back to ReactFlow node type
const schemaTypeToRfType = (node) => {
  if (node.type === 'trigger') return 'trigger';
  if (node.type === 'delay')   return 'delay';
  // message nodes — use the message subtype
  const msgType = node.data?.message?.type;
  if (msgType === 'button') return 'button';
  if (msgType === 'list')   return 'list';
  if (msgType === 'media')  return 'media';
  return 'text';
};

const configMap = {
  trigger: TriggerConfig,
  text:    TextConfig,
  button:  ButtonConfig,
  list:    ListConfig,
  media:   MediaConfig,
  delay:   DelayConfig,
};

export default function WorkflowBuilder() {
  // ── ALL hooks first ──
  const { id: urlId }                   = useParams();
  const [showPicker, setShowPicker]     = useState(!urlId); // skip picker if editing
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName]                 = useState('New workflow');
  const [saving, setSaving]             = useState(false);
  const [savedId, setSavedId]           = useState(urlId || null);
  const [selectedId, setSelectedId]     = useState(null);
  const [showTest, setShowTest]         = useState(false);
  const [loadError, setLoadError]       = useState('');
  const [loading, setLoading]           = useState(!!urlId); // loading state for edit mode
  const reactFlowWrapper                = useRef(null);
  const [rfInstance, setRfInstance]     = useState(null);
  const navigate                        = useNavigate();

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const selectedNode    = nodes.find(n => n.id === selectedId) || null;
  const ConfigComponent = selectedNode ? configMap[selectedNode.type] : null;

  // ── Load existing workflow when editing ──
  useEffect(() => {
    if (!urlId) return;

    setLoading(true);
    setLoadError('');

    axios.get(`${API}/api/workflows/${urlId}`, { headers })
      .then(res => {
        const wf = res.data;
        setName(wf.name);
        setSavedId(wf._id);

        // Convert saved schema nodes → ReactFlow node format
        const rfNodes = wf.nodes.map(n => ({
          id:       n.id,
          type:     schemaTypeToRfType(n),
          position: n.position || { x: 250, y: 250 },
          data:     n.type === 'trigger' ? { keyword: n.data.keyword, matchType: n.data.matchType }
                  : n.type === 'delay'   ? { delayMinutes: n.data.delayMinutes }
                  : { message: n.data.message },
        }));

        // Restore edges with animated style
        const rfEdges = (wf.edges || []).map(e => ({
          ...e,
          sourceHandle: e.sourceHandle,
          animated: true,
          style: e.style || { stroke: '#6366f1' },
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
        setShowPicker(false);
      })
      .catch(err => {
        setLoadError('Failed to load workflow. It may have been deleted.');
        setShowPicker(false);
      })
      .finally(() => setLoading(false));
  }, [urlId]);

  // ── Callbacks ──
  const handleTemplateSelect = useCallback((template) => {
    if (template) {
      const built = template.build();
      setName(built.name);
      setNodes(built.nodes);
      setEdges(built.edges);
    }
    setShowPicker(false);
  }, [setNodes, setEdges]);

const onConnect = useCallback(
  (params) => {
    // params contains: source, target, sourceHandle, targetHandle
    setEdges((eds) => 
      addEdge(
        { 
          ...params, 
          animated: true, 
          style: { stroke: '#6366f1' },
          // sourceHandle is captured here automatically, but you can log it to debug
        }, 
        eds
      )
    );
  },
  [setEdges]
);

  const onNodeClick  = useCallback((_, node) => setSelectedId(node.id), []);
  const onPaneClick  = useCallback(() => setSelectedId(null), []);

  const onDragStart = useCallback((e, type) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type || !rfInstance) return;

    const bounds   = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const id = `${type}-${uuid()}`;
    setNodes(nds => [...nds, { id, type, position, data: defaultData(type) }]);
    setSelectedId(id);
  }, [rfInstance, setNodes]);

  const updateNodeData = useCallback((newData) => {
    setNodes(nds => nds.map(n => n.id === selectedId ? { ...n, data: newData } : n));
  }, [selectedId, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    setNodes(nds => nds.filter(n => n.id !== selectedId));
    setEdges(eds => eds.filter(e => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges]);

const saveWorkflow = useCallback(async () => {
  const trigger = nodes.find(n => n.type === 'trigger');
  if (!trigger)              return alert('Add a keyword trigger node first.');
  if (!trigger.data.keyword) return alert('Set a keyword on the trigger node.');

  setSaving(true);
  try {
    const schemaNodes = nodes.map(n => ({
      id:       n.id,
      type:     n.type === 'trigger' ? 'trigger'
              : n.type === 'delay'   ? 'delay'
              : 'message',
      position: n.position,
      data:     n.type === 'trigger' ? { keyword: n.data.keyword, matchType: n.data.matchType }
              : n.type === 'delay'   ? { delayMinutes: n.data.delayMinutes }
              : { message: n.data.message },
    }));

    // ✅ ADD THIS — explicitly map edges to include sourceHandle
const schemaEdges = edges.map(e => {
  // Logic: If the wire is coming from a button node, it MUST have a sourceHandle
  const sourceNode = nodes.find(n => n.id === e.source);
  if (sourceNode?.type === 'button' && !e.sourceHandle) {
    console.warn(`Edge ${e.id} is missing a sourceHandle!`);
  }

  return {
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle || null,
  };
});

    let res;
    if (savedId) {
      res = await axios.put(
        `${API}/api/workflows/${savedId}`,
        { name, nodes: schemaNodes, edges: schemaEdges },  // ← schemaEdges not edges
        { headers }
      );
    } else {
      res = await axios.post(
        `${API}/api/workflows`,
        { name, nodes: schemaNodes, edges: schemaEdges },  // ← schemaEdges not edges
        { headers }
      );
      setSavedId(res.data._id);
    }

    alert('Workflow saved! You can now use the Test panel.');
  } catch (err) {
    alert(err.response?.data?.message || 'Save failed');
  } finally {
    setSaving(false);
  }
}, [nodes, edges, name, headers, savedId]);

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f9fafb', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e5e7eb',
          borderTop: '3px solid #4f46e5', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: 14, color: '#6b7280', fontFamily: 'sans-serif' }}>Loading workflow...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Load error state ──
  if (loadError) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f9fafb', flexDirection: 'column', gap: 14,
        fontFamily: 'sans-serif',
      }}>
        <p style={{ fontSize: 36 }}>⚠️</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>{loadError}</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, cursor: 'pointer' }}
        >
          ← Back to dashboard
        </button>
      </div>
    );
  }

  // ── Template picker ──
  if (showPicker) {
    return <TemplatePicker onSelect={handleTemplateSelect} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#f9fafb' }}>

      {/* ── Left panel ── */}
      <div style={{
        width: 260,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e5e7eb' }}>
          {!urlId && (
            <button
              onClick={() => setShowPicker(true)}
              style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', display: 'block' }}
            >
              ← Templates
            </button>
          )}
          {urlId && (
            <button
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', display: 'block' }}
            >
              ← Dashboard
            </button>
          )}
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 14, fontWeight: 600, boxSizing: 'border-box' }}
          />
          {savedId && (
            <p style={{ fontSize: 10, color: '#10b981', margin: '6px 0 0' }}>
              ✓ Saved — ID: {savedId.slice(-6)}
            </p>
          )}
          {urlId && (
            <p style={{ fontSize: 10, color: '#6b7280', margin: '4px 0 0' }}>
              Editing existing workflow
            </p>
          )}
        </div>

        {/* Palette */}
        <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>DRAG TO CANVAS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {palette.map(p => (
              <div
                key={p.type}
                draggable
                onDragStart={e => onDragStart(e, p.type)}
                style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  cursor: 'grab',
                  userSelect: 'none',
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: p.color, margin: 0 }}>{p.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Config panel */}
        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          {ConfigComponent && selectedNode ? (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 10 }}>
                CONFIGURE — {selectedNode.type.toUpperCase()}
              </p>
              <ConfigComponent
                data={selectedNode.data}
                onChange={updateNodeData}
              />
              <button
                onClick={deleteSelectedNode}
                style={{
                  marginTop: 16, width: '100%',
                  background: '#fff', border: '1px solid #fecaca',
                  color: '#e53e3e', borderRadius: 8,
                  padding: '7px 0', fontSize: 12, cursor: 'pointer',
                }}
              >
                Delete node
              </button>
            </>
          ) : (
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
              Click a node to configure it
            </p>
          )}
        </div>

        {/* Save button */}
        <div style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={saveWorkflow}
            disabled={saving}
            style={{
              width: '100%', background: '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 10, padding: '11px 0',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : savedId ? 'Update workflow' : 'Save workflow'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: 8, width: '100%',
              background: 'none', border: '1px solid #e5e7eb',
              color: '#6b7280', borderRadius: 10,
              padding: '8px 0', fontSize: 13, cursor: 'pointer',
            }}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* ── Center + Right ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Canvas */}
        <div
          style={{ flex: 1, position: 'relative' }}
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {/* Test toggle button */}
          <button
            onClick={() => setShowTest(v => !v)}
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              background: showTest ? '#4f46e5' : '#fff',
              color: showTest ? '#fff' : '#4f46e5',
              border: '1.5px solid #4f46e5',
              borderRadius: 8, padding: '7px 16px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            {showTest ? '× Close test' : '▶ Test'}
          </button>

          {/* Save reminder */}
          {showTest && !savedId && (
            <div style={{
              position: 'absolute', top: 12, right: 130, zIndex: 10,
              background: '#fefce8', border: '1px solid #fde047',
              borderRadius: 8, padding: '7px 12px', fontSize: 11,
              color: '#854d0e', maxWidth: 200,
            }}>
              ⚠ Save the workflow first to use Simulate
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
          >
            <MiniMap />
            <Controls />
            <Background color="#e5e7eb" gap={20} />
          </ReactFlow>
        </div>

        {/* Test panel */}
        {showTest && (
          <TestPanel
            workflowId={savedId}
            nodes={nodes}
            edges={edges}
            onClose={() => setShowTest(false)}
          />
        )}
      </div>
    </div>
  );
}