import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge, MiniMap, Controls, Background,
  useNodesState, useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { nodeTypes }    from '../components/nodes';
import DeletableEdge   from '../components/edges/DeletableEdge';
import TriggerConfig   from '../components/config/TriggerConfig';
import TextConfig      from '../components/config/TextConfig';
import ButtonConfig    from '../components/config/ButtonConfig';
import ListConfig      from '../components/config/ListConfig';
import MediaConfig     from '../components/config/MediaConfig';
import DelayConfig     from '../components/config/DelayConfig';
import ProductConfig   from '../components/config/ProductConfig';
import TemplatePicker  from '../components/TemplatePicker';
import TestPanel       from '../components/test/TestPanel';

const API       = process.env.REACT_APP_API_URL || 'http://localhost:5005';
const edgeTypes = { deletable: DeletableEdge };

const PALETTE = [
  { type: 'trigger', label: 'Keyword Trigger', emoji: '⚡', desc: 'Start flow on keyword',     color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { type: 'text',    label: 'Text Message',    emoji: '💬', desc: 'Send a plain text reply',    color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { type: 'button',  label: 'Button Message',  emoji: '🔘', desc: 'Message with tap buttons',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { type: 'list',    label: 'List Message',    emoji: '📋', desc: 'Message with a list menu',   color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { type: 'media',   label: 'Media Message',   emoji: '🖼️', desc: 'Image, video or document',   color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
  { type: 'delay',   label: 'Delay',           emoji: '⏱️', desc: 'Wait before the next step',  color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  { type: 'product', label: 'Product Message', emoji: '🛍️', desc: 'Send product from catalog',   color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
];

const defaultData = (type) => {
  if (type === 'trigger') return { keyword: '', matchType: 'contains' };
  if (type === 'text')    return { message: { type: 'text', text: '' } };
  if (type === 'button')  return { message: { type: 'button', buttonBody: '', buttons: [{ id: uuid(), title: '' }] } };
  if (type === 'list')    return { message: { type: 'list', listBody: '', listButtonText: 'View options', sections: [{ title: 'Section 1', rows: [{ id: uuid(), title: '', description: '' }] }] } };
  if (type === 'media')   return { message: { type: 'media', mediaType: 'image', mediaUrl: '', mediaCaption: '' } };
  if (type === 'delay')   return { delayMinutes: 5 };
  if (type === 'product') return { message: { type: 'product', catalogId: '', productRetailerId: '', body: '' } };
  return {};
};

const schemaTypeToRfType = (node) => {
  if (node.type === 'trigger') return 'trigger';
  if (node.type === 'delay')   return 'delay';
  const msgType = node.data?.message?.type;
  if (msgType === 'button')       return 'button';
  if (msgType === 'list')         return 'list';
  if (msgType === 'media')        return 'media';
  if (msgType === 'product')      return 'product';
  if (msgType === 'product_list') return 'product';
  return 'text';
};

const configMap = {
  trigger: TriggerConfig,
  text:    TextConfig,
  button:  ButtonConfig,
  list:    ListConfig,
  media:   MediaConfig,
  delay:   DelayConfig,
  product: ProductConfig,
};

export default function WorkflowBuilder() {
  const { id: urlId }                    = useParams();
  const [showPicker, setShowPicker]      = useState(!urlId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName]                  = useState('New workflow');
  const [saving, setSaving]              = useState(false);
  const [savedId, setSavedId]            = useState(urlId || null);
  const [saveStatus, setSaveStatus]      = useState('idle'); // idle | saving | saved | error
  const [selectedId, setSelectedId]      = useState(null);
  const [showTest, setShowTest]          = useState(false);
  const [loadError, setLoadError]        = useState('');
  const [loading, setLoading]            = useState(!!urlId);
  const reactFlowWrapper                 = useRef(null);
  const [rfInstance, setRfInstance]      = useState(null);
  const navigate                         = useNavigate();

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const selectedNode    = nodes.find(n => n.id === selectedId) || null;
  const ConfigComponent = selectedNode ? configMap[selectedNode.type] : null;

  useEffect(() => {
    if (!urlId) return;
    setLoading(true);
    axios.get(`${API}/api/workflows/${urlId}`, { headers })
      .then(res => {
        const wf = res.data;
        setName(wf.name);
        setSavedId(wf._id);
        const rfNodes = wf.nodes.map(n => ({
          id: n.id, type: schemaTypeToRfType(n),
          position: n.position || { x: 250, y: 250 },
          data: n.type === 'trigger' ? { keyword: n.data.keyword, matchType: n.data.matchType }
              : n.type === 'delay'   ? { delayMinutes: n.data.delayMinutes }
              : { message: n.data.message },
        }));
        const rfEdges = (wf.edges || []).map(e => ({ ...e, type: 'deletable', animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }));
        setNodes(rfNodes);
        setEdges(rfEdges);
        setShowPicker(false);
        setSaveStatus('saved');
      })
      .catch(() => { setLoadError('Failed to load workflow. It may have been deleted.'); setShowPicker(false); })
      .finally(() => setLoading(false));
  }, [urlId]); // eslint-disable-line

  const handleTemplateSelect = useCallback((template) => {
    if (template) {
      const built = template.build();
      setName(built.name);
      setNodes(built.nodes);
      setEdges(built.edges);
    }
    setShowPicker(false);
  }, [setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, type: 'deletable', animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds));
  }, [setEdges]);

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
    const position = rfInstance.screenToFlowPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const id = `${type}-${uuid()}`;
    setNodes(nds => [...nds, { id, type, position, data: defaultData(type) }]);
    setSelectedId(id);
  }, [rfInstance, setNodes]);

  const updateNodeData = useCallback((newData) => {
    setNodes(nds => nds.map(n => n.id === selectedId ? { ...n, data: newData } : n));
    setSaveStatus('idle');
  }, [selectedId, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    setNodes(nds => nds.filter(n => n.id !== selectedId));
    setEdges(eds => eds.filter(e => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges]);

  const saveWorkflow = useCallback(async () => {
    const trigger = nodes.find(n => n.type === 'trigger');
    if (!trigger)              return alert('Add a Keyword Trigger node first.');
    if (!trigger.data.keyword) return alert('Set a keyword on the Trigger node.');

    setSaving(true);
    setSaveStatus('saving');
    try {
      const schemaNodes = nodes.map(n => ({
        id: n.id,
        type: n.type === 'trigger' ? 'trigger' : n.type === 'delay' ? 'delay' : 'message',
        position: n.position,
        data: n.type === 'trigger' ? { keyword: n.data.keyword, matchType: n.data.matchType }
            : n.type === 'delay'   ? { delayMinutes: n.data.delayMinutes }
            : { message: n.data.message },  // product node saved as message type with message.type='product'/'product_list'
      }));
      const schemaEdges = edges.map(e => ({
        id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle || null,
      }));

      let res;
      if (savedId) {
        res = await axios.put(`${API}/api/workflows/${savedId}`, { name, nodes: schemaNodes, edges: schemaEdges }, { headers });
      } else {
        res = await axios.post(`${API}/api/workflows`, { name, nodes: schemaNodes, edges: schemaEdges }, { headers });
        setSavedId(res.data._id);
      }
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [nodes, edges, name, headers, savedId]); // eslint-disable-line

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', flexDirection: 'column', gap: 14, fontFamily: 'sans-serif' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ fontSize: 14, color: '#6b7280' }}>Loading workflow...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', flexDirection: 'column', gap: 14, fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: 32 }}>⚠️</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>{loadError}</p>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, cursor: 'pointer' }}>
          ← Back to dashboard
        </button>
      </div>
    );
  }

  if (showPicker) return <TemplatePicker onSelect={handleTemplateSelect} />;

  const statusLabel = saveStatus === 'saving' ? '⏳ Saving...'
                    : saveStatus === 'saved'   ? '✓ Saved'
                    : saveStatus === 'error'   ? '✗ Error'
                    : '';
  const statusColor = saveStatus === 'saved' ? '#059669' : saveStatus === 'error' ? '#dc2626' : '#9ca3af';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>

      {/* ── TOP BAR ── */}
      <div style={{ height: 54, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: 'none', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          ← Dashboard
        </button>

        <div style={{ width: 1, height: 22, background: '#e5e7eb' }} />

        {/* Workflow name */}
        <input
          value={name}
          onChange={e => { setName(e.target.value); setSaveStatus('idle'); }}
          style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 700, color: '#111827', background: 'transparent', minWidth: 140, maxWidth: 280 }}
        />

        {/* Save status */}
        {statusLabel && (
          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
        )}

        <div style={{ flex: 1 }} />

        {/* Node count pill */}
        {nodes.length > 0 && (
          <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
            {nodes.length} node{nodes.length !== 1 ? 's' : ''}
          </span>
        )}

        {/* Test toggle */}
        <button
          onClick={() => setShowTest(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: showTest ? '#ede9fe' : '#f3f4f6', border: `1px solid ${showTest ? '#c4b5fd' : '#e5e7eb'}`, color: showTest ? '#7c3aed' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          ▶ {showTest ? 'Close Test' : 'Test'}
        </button>

        {/* Save */}
        <button
          onClick={saveWorkflow}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 8, background: saving ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}
        >
          {saving ? '⏳ Saving...' : '💾 Save'}
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ width: 252, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

          {/* Palette */}
          <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>
              Drag blocks to canvas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {PALETTE.map(p => (
                <div
                  key={p.type}
                  draggable
                  onDragStart={e => onDragStart(e, p.type)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, border: `1px solid ${p.border}`, background: p.bg, cursor: 'grab', userSelect: 'none', transition: 'transform 0.1s, box-shadow 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{p.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: p.color, margin: 0 }}>{p.label}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</p>
                  </div>
                  <span style={{ fontSize: 10, color: '#cbd5e1' }}>⠿</span>
                </div>
              ))}
            </div>
          </div>

          {/* Config panel */}
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {ConfigComponent && selectedNode ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>
                    Configure node
                  </p>
                  <button
                    onClick={deleteSelectedNode}
                    style={{ fontSize: 11, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </div>
                <ConfigComponent data={selectedNode.data} onChange={updateNodeData} />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>👆</div>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
                  Click a node on the canvas to configure it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── CANVAS ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
          ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>

          {/* Empty state hint */}
          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
              <div style={{ textAlign: 'center', padding: 32, background: 'rgba(255,255,255,0.8)', borderRadius: 16, border: '1.5px dashed #e2e8f0', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏗️</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: '0 0 6px' }}>Start building your flow</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Drag blocks from the left panel onto this canvas</p>
              </div>
            </div>
          )}

          {/* Save-before-test warning */}
          {showTest && !savedId && (
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '8px 14px', fontSize: 11, color: '#92400e', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              ⚠️ Save the workflow first to use Test
            </div>
          )}

          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick}
            onPaneClick={onPaneClick} onInit={setRfInstance}
            nodeTypes={nodeTypes} edgeTypes={edgeTypes}
            fitView deleteKeyCode="Delete"
            defaultEdgeOptions={{ type: 'deletable', animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }}
          >
            <MiniMap
              nodeColor={n => {
                if (n.type === 'trigger') return '#7c3aed';
                if (n.type === 'text')    return '#059669';
                if (n.type === 'button')  return '#2563eb';
                if (n.type === 'list')    return '#b45309';
                if (n.type === 'media')   return '#db2777';
                return '#6b7280';
              }}
              style={{ borderRadius: 10, border: '1px solid #e5e7eb' }}
            />
            <Controls style={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
            <Background color="#cbd5e1" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* ── TEST PANEL ── */}
        {showTest && (
          <TestPanel
            workflowId={savedId}
            nodes={nodes}
            edges={edges}
            onClose={() => setShowTest(false)}
          />
        )}
      </div>

      <style>{`
        .react-flow__node { cursor: pointer; }
        .react-flow__edge-path { stroke-width: 2; }
        .react-flow__handle { cursor: crosshair; }
        .react-flow__controls-button { border-radius: 6px !important; }
      `}</style>
    </div>
  );
}
