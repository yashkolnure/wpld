import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = '';

const tabStyle = (active) => ({
  flex: 1,
  padding: '8px 0',
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  color: active ? '#4f46e5' : '#6b7280',
  background: 'none',
  border: 'none',
  borderBottom: active ? '2px solid #4f46e5' : '2px solid transparent',
  cursor: 'pointer',
});

const resolveHandleLabel = (nodes, nodeId, handle) => {
  if (!handle) return '—';
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return handle;
  const msg = node.data?.message;
  if (!msg) return handle;
  if (msg.type === 'button') {
    const btn = (msg.buttons || []).find(b => b.id === handle);
    if (btn) return btn.title;
  }
  if (msg.type === 'list') {
    for (const sec of (msg.sections || [])) {
      const row = (sec.rows || []).find(r => r.id === handle);
      if (row) return row.title;
    }
  }
  return handle;
};

const getBranches = (nodes, edges, nodeId) => {
  const outgoing = edges.filter(e => e.source === nodeId);
  if (outgoing.length <= 1) return null;
  return outgoing.map(e => ({
    handle: e.sourceHandle,
    label:  resolveHandleLabel(nodes, nodeId, e.sourceHandle),
    target: e.target,
  }));
};

// Build the next bot message node to send after following a path
const getNextNode = (nodes, edges, fromNodeId, selectedHandle) => {
  const outgoing = edges.filter(e => e.source === fromNodeId);
  if (!outgoing.length) return null;
  let nextEdge;
  if (outgoing.length === 1) {
    nextEdge = outgoing[0];
  } else {
    nextEdge = outgoing.find(e => e.sourceHandle === selectedHandle);
  }
  if (!nextEdge) return null;
  return nodes.find(n => n.id === nextEdge.target) || null;
};

// Walk forward from a node, collecting consecutive non-branch nodes
// Returns { nodesToSend: [], pendingBranches: null | [], pendingNodeId }
const collectMessages = (nodes, edges, startNodeId) => {
  const nodeMap     = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodesToSend = [];
  let currentId     = startNodeId;

while (true) {
    const node = nodeMap[currentId];
    if (!node) break;

    // push current node (skip trigger)
    if (node.type !== 'trigger') nodesToSend.push(node);

    const outgoing = edges.filter(e => e.source === currentId);
    if (!outgoing.length) break;

    // branch point — stop and show choices
    if (outgoing.length > 1) {
      return {
        nodesToSend,
        pendingBranches: getBranches(nodes, edges, currentId),
        pendingNodeId:   currentId,
      };
    }

    // single edge — move to next node
    const nextNode = nodeMap[outgoing[0].target];
    if (!nextNode) break;

    // ✅ just move forward — top of loop handles the push
    currentId = nextNode.id;
  }

  return { nodesToSend, pendingBranches: null, pendingNodeId: null };
};

// ── WA Bubble components ──

const BotBubble = ({ node }) => {
  const msg = node?.data?.message;
  if (!msg && node?.type !== 'delay') return null;

  const bubbleStyle = {
    background: '#fff',
    borderRadius: '2px 12px 12px 12px',
    padding: '8px 12px',
    maxWidth: 230,
    fontSize: 13,
    color: '#111',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    marginBottom: 2,
  };

  const timeStyle = {
    fontSize: 10, color: '#888',
    textAlign: 'right', marginTop: 4,
  };

  const btnStyle = {
    border: '1px solid #25d366',
    borderRadius: 8, padding: '7px 10px',
    textAlign: 'center', fontSize: 12,
    color: '#128c7e', background: '#fff',
    marginTop: 4,
  };

  if (node.type === 'delay') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <span style={{ fontSize: 10, color: '#888', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '3px 10px' }}>
          ⏱ {node.data.delayMinutes}min delay
        </span>
      </div>
    );
  }

  if (msg.type === 'text') {
    return (
      <div style={{ display: 'flex', marginBottom: 6 }}>
        <div>
          <div style={bubbleStyle}>
            <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            <p style={timeStyle}>10:30 AM ✓✓</p>
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === 'button') {
    return (
      <div style={{ marginBottom: 6 }}>
        <div style={bubbleStyle}>
          {msg.buttonHeader && <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13 }}>{msg.buttonHeader}</p>}
          <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.buttonBody}</p>
          {msg.buttonFooter && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>{msg.buttonFooter}</p>}
          <p style={timeStyle}>10:30 AM ✓✓</p>
        </div>
        <div style={{ display: 'flex', gap: 4, maxWidth: 230, flexWrap: 'wrap' }}>
          {(msg.buttons || []).map(b => (
            <div key={b.id} style={{ ...btnStyle, flex: 1 }}>{b.title}</div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'list') {
    return (
      <div style={{ marginBottom: 6 }}>
        <div style={bubbleStyle}>
          {msg.listHeader && <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{msg.listHeader}</p>}
          <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.listBody}</p>
          {msg.listFooter && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>{msg.listFooter}</p>}
          <p style={timeStyle}>10:30 AM ✓✓</p>
        </div>
        <div style={{ ...btnStyle, maxWidth: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#128c7e" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {msg.listButtonText || 'View options'}
        </div>
        {/* Expanded rows */}
        <div style={{ background: '#fff', borderRadius: 8, marginTop: 4, maxWidth: 230, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {(msg.sections || []).map((sec, si) => (
            <div key={si}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#128c7e', padding: '6px 10px 2px', margin: 0, textTransform: 'uppercase' }}>
                {sec.title}
              </p>
              {(sec.rows || []).map(row => (
                <div key={row.id} style={{ padding: '6px 10px', borderTop: '0.5px solid #f0f0f0' }}>
                  <p style={{ fontSize: 12, fontWeight: 500, margin: '0 0 1px', color: '#111' }}>{row.title}</p>
                  {row.description && <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{row.description}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'media') {
    return (
      <div style={{ marginBottom: 6 }}>
        <div style={{ ...bubbleStyle, padding: 0, overflow: 'hidden', maxWidth: 230 }}>
          <div style={{ background: '#cfe9ff', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 11, color: '#128c7e', margin: 0 }}>{(msg.mediaType || 'MEDIA').toUpperCase()}</p>
          </div>
          {msg.mediaCaption && (
            <div style={{ padding: '6px 10px' }}>
              <p style={{ margin: 0, fontSize: 12 }}>{msg.mediaCaption}</p>
              <p style={timeStyle}>10:30 AM ✓✓</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

const UserBubble = ({ text }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
    <div style={{
      background: '#dcf8c6',
      borderRadius: '12px 2px 12px 12px',
      padding: '8px 12px', maxWidth: 200,
      fontSize: 13, color: '#111',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{text}</p>
      <p style={{ fontSize: 10, color: '#888', textAlign: 'right', marginTop: 4 }}>10:30 AM ✓✓</p>
    </div>
  </div>
);

// ── Main TestPanel ──

export default function TestPanel({ workflowId, nodes, edges, onClose }) {
  const [tab, setTab] = useState('simulate');

  // Conversation state
  const [messages, setMessages]         = useState([]); // { type: 'bot'|'user'|'typing', node?, text? }
  const [pendingBranches, setPending]   = useState(null);
  const [pendingNodeId, setPendingNode] = useState(null);
  const [inputText, setInputText]       = useState('');
  const [started, setStarted]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const chatEndRef                      = useRef(null);

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingBranches]);

  const pushBotMessages = (nodesToSend) => {
    setMessages(prev => [
      ...prev,
      ...nodesToSend.map(node => ({ type: 'bot', node })),
    ]);
  };

  const addTypingThenSend = (nodesToSend, branches, branchNodeId) => {
    setMessages(prev => [...prev, { type: 'typing' }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.type !== 'typing'));
      pushBotMessages(nodesToSend);
      setPending(branches);
      setPendingNode(branchNodeId);
    }, 600);
  };

  const startConversation = async () => {
    if (!inputText.trim() || !workflowId) return;
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${API}http://localhost:5004/api/workflows/${workflowId}/simulate`,
        { incomingText: inputText, branchPath: [] },
        { headers }
      );

      if (!res.data.matched) {
        setError(`No workflow matched "${inputText}"`);
        setLoading(false);
        return;
      }

      setStarted(true);

      // Add user message
      const userMsg = { type: 'user', text: inputText };
      setMessages([userMsg]);
      setPending(null);

      // Find trigger node and walk forward
      const triggerNode = nodes.find(n => n.type === 'trigger');
      if (!triggerNode) return;

      const { nodesToSend, pendingBranches, pendingNodeId } = collectMessages(nodes, edges, triggerNode.id);
      addTypingThenSend(nodesToSend, pendingBranches, pendingNodeId);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start');
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSelect = (branch) => {
    // Add user bubble showing what they tapped
    setMessages(prev => [...prev, { type: 'user', text: branch.label }]);
    setPending(null);
    setPendingNode(null);

    // Walk forward from the target node
    const targetNode = nodes.find(n => n.id === branch.target);
    if (!targetNode) return;

    // Collect from the target node onward
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const { nodesToSend, pendingBranches, pendingNodeId } = collectMessages(nodes, edges, branch.target);

    addTypingThenSend(nodesToSend, pendingBranches, pendingNodeId);
  };

  const resetConversation = () => {
    setMessages([]);
    setPending(null);
    setPendingNode(null);
    setInputText('');
    setStarted(false);
    setError('');
  };

  // ── Preview helpers ──
  const buildPreviewPayload = (message) => {
    const base = { messaging_product: 'whatsapp', to: 'PREVIEW' };
    switch (message.type) {
      case 'text':
        return { ...base, type: 'text', text: { body: message.text } };
      case 'button':
        return {
          ...base, type: 'interactive',
          interactive: {
            type: 'button',
            header: message.buttonHeader ? { type: 'text', text: message.buttonHeader } : undefined,
            body: { text: message.buttonBody },
            footer: message.buttonFooter ? { text: message.buttonFooter } : undefined,
            action: { buttons: (message.buttons || []).map(b => ({ type: 'reply', reply: { id: b.id, title: b.title } })) },
          },
        };
      case 'list':
        return {
          ...base, type: 'interactive',
          interactive: {
            type: 'list',
            header: message.listHeader ? { type: 'text', text: message.listHeader } : undefined,
            body: { text: message.listBody },
            footer: message.listFooter ? { text: message.listFooter } : undefined,
            action: { button: message.listButtonText || 'View options', sections: message.sections || [] },
          },
        };
      case 'media':
        return { ...base, type: message.mediaType, [message.mediaType]: { link: message.mediaUrl, caption: message.mediaCaption } };
      default: return null;
    }
  };

  const getAllPreviewNodes = () => {
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) return [];
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const visited = new Set();
    const result  = [];
    const queue   = [triggerNode.id];
    while (queue.length > 0) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      const node = nodeMap[id];
      if (!node) continue;
      if (node.type !== 'trigger') result.push(node);
      edges.filter(e => e.source === id).forEach(e => { if (!visited.has(e.target)) queue.push(e.target); });
    }
    return result;
  };

  const getFlowSteps = () => {
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) return [];
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const visited = new Set([triggerNode.id]);
    const result  = [triggerNode];
    const queue   = [triggerNode.id];
    while (queue.length > 0) {
      const id = queue.shift();
      edges.filter(e => e.source === id).forEach(e => {
        if (visited.has(e.target)) return;
        visited.add(e.target);
        const node = nodeMap[e.target];
        if (!node) return;
        const label = e.sourceHandle ? resolveHandleLabel(nodes, id, e.sourceHandle) : null;
        result.push({ ...node, _branchLabel: label });
        queue.push(e.target);
      });
    }
    return result;
  };

  const getUnconnectedNodes = () => {
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) return [];
    const visited = new Set();
    const queue   = [triggerNode.id];
    while (queue.length > 0) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      edges.filter(e => e.source === id).forEach(e => queue.push(e.target));
    }
    return nodes.filter(n => !visited.has(n.id));
  };

  const typeColors = {
    trigger: { bg: '#EEEDFE', border: '#AFA9EC', color: '#534AB7', label: 'TRIGGER' },
    text:    { bg: '#E1F5EE', border: '#5DCAA5', color: '#0F6E56', label: 'TEXT'    },
    button:  { bg: '#E6F1FB', border: '#85B7EB', color: '#185FA5', label: 'BUTTON'  },
    list:    { bg: '#FAEEDA', border: '#EF9F27', color: '#854F0B', label: 'LIST'    },
    media:   { bg: '#FAECE7', border: '#F0997B', color: '#993C1D', label: 'MEDIA'   },
    delay:   { bg: '#F1EFE8', border: '#B4B2A9', color: '#5F5E5A', label: 'DELAY'   },
    message: { bg: '#E1F5EE', border: '#5DCAA5', color: '#0F6E56', label: 'MESSAGE' },
  };

  const previewNodes = getAllPreviewNodes();
  const flowSteps    = getFlowSteps();
  const unconnected  = getUnconnectedNodes();

  return (
    <div style={{
      width: 320, background: '#fff',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'sans-serif', overflow: 'hidden', flexShrink: 0,
    }}>

      {/* Header */}
      <div style={{ padding: '12px 14px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>Test workflow</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: 'flex' }}>
          <button style={tabStyle(tab === 'simulate')} onClick={() => setTab('simulate')}>Simulate</button>
          <button style={tabStyle(tab === 'preview')}  onClick={() => setTab('preview')}>Preview</button>
          <button style={tabStyle(tab === 'flow')}     onClick={() => setTab('flow')}>Flow</button>
        </div>
      </div>

      {/* ── SIMULATE TAB ── */}
      {tab === 'simulate' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* WhatsApp chat header */}
          <div style={{ background: '#075e54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              🤖
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>MyAutoBot</p>
              <p style={{ fontSize: 11, color: '#b2dfdb', margin: 0 }}>WhatsApp Business</p>
            </div>
            {started && (
              <button
                onClick={resetConversation}
                style={{ marginLeft: 'auto', fontSize: 11, color: '#b2dfdb', background: 'none', border: '1px solid #b2dfdb', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
              >
                ↺ Reset
              </button>
            )}
          </div>

          {/* Chat messages area */}
          <div style={{
            flex: 1, overflow: 'auto',
            background: '#e5ddd5',
            padding: '12px 10px',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23c8b9a8\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\'/%3E%3C/g%3E%3C/svg%3E")',
          }}>

            {!started && !error && (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.6 }}>
                  Type a keyword below to start the conversation
                </p>
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', margin: '8px 0' }}>
                <p style={{ fontSize: 12, color: '#e53e3e', margin: 0 }}>✗ {error}</p>
                <button
                  onClick={resetConversation}
                  style={{ fontSize: 11, color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 0', textDecoration: 'underline' }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Render conversation */}
            {messages.map((msg, i) => {
              if (msg.type === 'user') return <UserBubble key={i} text={msg.text} />;
              if (msg.type === 'typing') {
                return (
                  <div key={i} style={{ display: 'flex', marginBottom: 6 }}>
                    <div style={{ background: '#fff', borderRadius: '2px 12px 12px 12px', padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} style={{
                            width: 7, height: 7, borderRadius: '50%', background: '#999',
                            animation: `bounce 1s ease-in-out ${j * 0.15}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              if (msg.type === 'bot') return <BotBubble key={i} node={msg.node} />;
              return null;
            })}

            {/* Branch choice buttons */}
            {pendingBranches && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 10, color: '#888', textAlign: 'center', marginBottom: 8 }}>
                  Tap a reply
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pendingBranches.map(branch => (
                    <button
                      key={branch.handle}
                      onClick={() => handleBranchSelect(branch)}
                      style={{
                        background: '#fff',
                        border: '1px solid #25d366',
                        borderRadius: 10, padding: '10px 14px',
                        fontSize: 13, color: '#128c7e',
                        cursor: 'pointer', textAlign: 'center',
                        fontWeight: 500, width: '100%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        transition: 'background .1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      {branch.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* End of flow indicator */}
            {started && !pendingBranches && messages.length > 0 && messages[messages.length - 1]?.type === 'bot' && (
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <span style={{ fontSize: 10, color: '#888', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '3px 12px' }}>
                  End of conversation
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div style={{
            background: '#f0f0f0', padding: '8px 10px',
            display: 'flex', gap: 8, alignItems: 'center',
            borderTop: '1px solid #e5e7eb',
          }}>
            {!workflowId && (
              <p style={{ fontSize: 11, color: '#854d0e', margin: 0, flex: 1 }}>Save workflow first to test</p>
            )}
            {workflowId && (
              <>
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !started && startConversation()}
                  placeholder={started ? 'Use buttons above to reply...' : 'Type a keyword to start...'}
                  disabled={started || loading}
                  style={{
                    flex: 1, border: 'none', borderRadius: 20,
                    padding: '8px 14px', fontSize: 13,
                    outline: 'none', background: '#fff',
                    opacity: started ? 0.5 : 1,
                  }}
                />
                <button
                  onClick={startConversation}
                  disabled={started || loading || !inputText.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: started || !inputText.trim() ? '#ccc' : '#25d366',
                    border: 'none', cursor: started ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bounce animation */}
          <style>{`
            @keyframes bounce {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-4px); }
            }
          `}</style>
        </div>
      )}

      {/* ── PREVIEW TAB ── */}
      {tab === 'preview' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
            Phone mockup of all messages including branches.
          </p>
          <div style={{ background: '#e5ddd5', borderRadius: 16, padding: 14, maxWidth: 260, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: '#555', margin: 0 }}>10:30</p>
              <p style={{ fontSize: 10, color: '#555', margin: 0 }}>MyAutoBot</p>
            </div>
            {previewNodes.length === 0 ? (
              <p style={{ fontSize: 12, color: '#888', textAlign: 'center', padding: '20px 0' }}>No message nodes connected yet</p>
            ) : (
              previewNodes.map(node => {
                if (node.type === 'delay') {
                  return (
                    <div key={node.id} style={{ textAlign: 'center', padding: '6px 0' }}>
                      <span style={{ fontSize: 10, color: '#888', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '3px 10px' }}>
                        ⏱ {node.data.delayMinutes}min delay
                      </span>
                    </div>
                  );
                }
                const msg = node.data?.message;
                if (!msg) return null;
                const payload = buildPreviewPayload(msg);
                if (!payload) return null;
                return (
                  <div key={node.id} style={{ marginBottom: 8 }}>
                    {node._branchLabel && (
                      <div style={{ textAlign: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 9, color: '#5b21b6', background: '#ede9fe', borderRadius: 20, padding: '2px 8px' }}>
                          if: {node._branchLabel}
                        </span>
                      </div>
                    )}
                    <BotBubble node={node} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── FLOW TAB ── */}
      {tab === 'flow' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
            All nodes and branches in execution order.
          </p>
          {flowSteps.length === 0 ? (
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>No nodes found</p>
          ) : (
            flowSteps.map((node, i) => {
              const msgType = node.data?.message?.type || node.type;
              const c = typeColors[msgType] || typeColors[node.type] || typeColors.message;
              const summary =
                node.type === 'trigger' ? `Keyword: "${node.data.keyword}" (${node.data.matchType})`
              : node.type === 'delay'   ? `Wait ${node.data.delayMinutes} minutes`
              : node.data?.message?.type === 'text'   ? (node.data.message.text       || 'No text set')
              : node.data?.message?.type === 'button' ? (node.data.message.buttonBody || 'No body set')
              : node.data?.message?.type === 'list'   ? (node.data.message.listBody   || 'No body set')
              : node.data?.message?.type === 'media'  ? (node.data.message.mediaUrl   || 'No URL set')
              : '—';
              return (
                <div key={`${node.id}-${i}`}>
                  {node._branchLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 12px' }}>
                      <div style={{ width: 1, height: 12, background: '#d1d5db' }} />
                      <span style={{ fontSize: 10, background: '#ede9fe', color: '#5b21b6', borderRadius: 20, padding: '2px 8px' }}>
                        if: {node._branchLabel}
                      </span>
                    </div>
                  )}
                  <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: '#fff', borderRadius: 20, padding: '2px 8px', border: `1px solid ${c.border}` }}>
                        {c.label}
                      </span>
                      <span style={{ fontSize: 10, color: '#9ca3af' }}>Step {i + 1}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                      {summary}
                    </p>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                      <svg width="14" height="20" viewBox="0 0 14 20">
                        <line x1="7" y1="0" x2="7" y2="14" stroke="#d1d5db" strokeWidth="1.5"/>
                        <polygon points="7,20 3,12 11,12" fill="#d1d5db"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })
          )}
          {unconnected.length > 0 && (
            <div style={{ marginTop: 16, background: '#fefce8', border: '1px solid #fde047', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#854d0e', margin: '0 0 4px' }}>
                ⚠ {unconnected.length} unconnected node{unconnected.length > 1 ? 's' : ''}
              </p>
              {unconnected.map(n => (
                <p key={n.id} style={{ fontSize: 11, color: '#92400e', margin: '2px 0 0' }}>
                  • {n.type} — {n.id.split('-')[0]}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}