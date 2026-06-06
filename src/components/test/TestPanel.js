import { useState, useRef, useEffect } from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────

const resolveHandleLabel = (nodes, nodeId, handle) => {
  if (!handle) return handle;
  const node = nodes.find(n => n.id === nodeId);
  const msg  = node?.data?.message;
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

// ── Condition evaluator (mirrors backend logic) ───────────────────────────
const evalCondition = (node, vars) => {
  const { variable = '', operator = 'equals', value = '' } = node.data || {};
  const actual = (vars[variable] || '').toString().toLowerCase().trim();
  const target = value.toLowerCase().trim();
  switch (operator) {
    case 'equals':       return actual === target;
    case 'not_equals':   return actual !== target;
    case 'contains':     return actual.includes(target);
    case 'not_contains': return !actual.includes(target);
    case 'starts_with':  return actual.startsWith(target);
    case 'ends_with':    return actual.endsWith(target);
    case 'greater_than': return parseFloat(actual) > parseFloat(target);
    case 'less_than':    return parseFloat(actual) < parseFloat(target);
    case 'is_set':       return actual !== '' && actual !== 'undefined';
    case 'is_not_set':   return actual === '' || actual === 'undefined';
    default:             return false;
  }
};

const collectMessages = (nodes, edges, startNodeId, vars = {}) => {
  const nodeMap     = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodesToSend = [];
  let currentId     = startNodeId;
  while (true) {
    const node = nodeMap[currentId];
    if (!node) break;
    if (node.type !== 'trigger') nodesToSend.push(node);

    // Stop at collect_input — needs user response before continuing
    if (node.type === 'collect_input') {
      return { nodesToSend, pendingBranches: null, pendingNodeId: null, pendingInput: node };
    }

    // Auto-resolve condition nodes using collected vars
    if (node.type === 'condition') {
      const outgoing = edges.filter(e => e.source === currentId);
      const result   = evalCondition(node, vars);
      const handle   = result ? 'true' : 'false';
      const edge     = outgoing.find(e => e.sourceHandle === handle) || outgoing[0];
      if (!edge) break;
      const nextNode = nodeMap[edge.target];
      if (!nextNode) break;
      currentId = nextNode.id;
      continue; // don't push the condition node itself as a message
    }

    const outgoing = edges.filter(e => e.source === currentId);
    if (!outgoing.length) break;
    if (outgoing.length > 1) {
      return { nodesToSend, pendingBranches: getBranches(nodes, edges, currentId), pendingNodeId: currentId, pendingInput: null };
    }
    const nextNode = nodeMap[outgoing[0].target];
    if (!nextNode) break;
    currentId = nextNode.id;
  }
  return { nodesToSend, pendingBranches: null, pendingNodeId: null, pendingInput: null };
};

// ── WhatsApp-accurate bubble components ───────────────────────────────────────

// Shared styles
const WA = {
  text:      '#111b21',
  subtext:   '#667781',
  teal:      '#008069',
  tealLight: '#e9f5f3',
  divider:   '#e9edef',
  shadow:    '0 1px 0.5px rgba(11,20,26,0.13)',
  radius:    '0px 8px 8px 8px',
};

// Timestamp + double-tick row
function Meta({ time = '10:30' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, marginTop: 2 }}>
      <span style={{ fontSize: 11, color: WA.subtext }}>{time}</span>
      {/* Blue double-tick (read receipt) */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path d="M11.071.936L4.5 7.5 1.929 4.936" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.071.936L8.5 7.5" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const getInputHint = (inputType, varName) => {
  if (inputType === 'phone')  return '📱 Type your WhatsApp number';
  if (inputType === 'email')  return '📧 Type your email address';
  if (inputType === 'number') return '🔢 Type a number';
  if (varName && varName !== 'input') {
    const display = varName.charAt(0).toUpperCase() + varName.slice(1);
    return `✏️ Type your ${display}`;
  }
  return '✏️ Type your reply';
};

// pendingBranches + onBranchSelect are passed only to the LAST bot bubble
function BotBubble({ node, pendingBranches, onBranchSelect }) {
  const msg = node?.data?.message;

  // ── Collect Input bubble ──
  if (node?.type === 'collect_input') {
    const { question, variableName, inputType = 'text' } = node.data || {};
    const hint = getInputHint(inputType, variableName);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4 }}>
        {/* Question bubble */}
        <div style={{ display: 'flex' }}>
          <div style={{ background: '#fff', borderRadius: WA.radius, padding: '6px 7px 8px 9px', maxWidth: '80%', boxShadow: WA.shadow, position: 'relative' }}>
            <svg style={{ position: 'absolute', top: 0, left: -8 }} width="8" height="13" viewBox="0 0 8 13">
              <path d="M8 0 Q0 0 0 13 L8 8 Z" fill="#fff"/>
            </svg>
            <p style={{ margin: '0 0 6px', fontSize: 14, lineHeight: 1.5, color: WA.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {question || `Please type your ${variableName || 'answer'}`}
            </p>
            {/* Input type hint chip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 20, padding: '3px 9px', fontSize: 11, color: '#0369a1', fontWeight: 600 }}>
              {hint}
              {variableName && (
                <span style={{ fontFamily: 'monospace', background: '#e0f2fe', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>
                  {`→ {{${variableName}}}`}
                </span>
              )}
            </div>
            <Meta />
          </div>
        </div>
      </div>
    );
  }

  if (!msg && node?.type !== 'delay') return null;

  // ── Delay chip ──
  if (node.type === 'delay') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 10px' }}>
        <span style={{ fontSize: 11, color: WA.subtext, background: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: '4px 14px', boxShadow: WA.shadow }}>
          ⏱ {node.data.delayMinutes}min delay
        </span>
      </div>
    );
  }

  // ── Text message ──
  if (msg.type === 'text') {
    return (
      <div style={{ display: 'flex', marginBottom: 2 }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, padding: '6px 7px 8px 9px', maxWidth: '75%', boxShadow: WA.shadow, position: 'relative' }}>
          {/* Bubble tail */}
          <svg style={{ position: 'absolute', top: 0, left: -8 }} width="8" height="13" viewBox="0 0 8 13">
            <path d="M8 0 Q0 0 0 13 L8 8 Z" fill="#fff"/>
          </svg>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</p>
          <Meta />
        </div>
      </div>
    );
  }

  // ── Button (interactive reply) message ──
  if (msg.type === 'button') {
    const btns = msg.buttons || [];
    return (
      <div style={{ marginBottom: 2, maxWidth: '80%' }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, overflow: 'hidden', boxShadow: WA.shadow }}>
          {/* Body */}
          <div style={{ padding: '6px 7px 8px 9px' }}>
            {msg.buttonHeader && (
              <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: WA.text }}>{msg.buttonHeader}</p>
            )}
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text }}>{msg.buttonBody}</p>
            {msg.buttonFooter && (
              <p style={{ margin: '3px 0 0', fontSize: 12, color: WA.subtext }}>{msg.buttonFooter}</p>
            )}
            <Meta />
          </div>
          {/* Buttons — each is a tappable reply */}
          {btns.map((btn, i) => {
            const branch = pendingBranches?.find(br => br.handle === btn.id);
            const active = !!branch;
            return (
              <button
                key={btn.id}
                onClick={active ? () => onBranchSelect(branch) : undefined}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '10px 16px',
                  border: 'none', borderTop: `1px solid ${WA.divider}`,
                  background: 'transparent',
                  color: active ? WA.teal : WA.subtext,
                  fontSize: 14, fontWeight: 500,
                  cursor: active ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (active) e.currentTarget.style.background = WA.tealLight; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Reply icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
                </svg>
                {btn.title}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── List message ──
  if (msg.type === 'list') {
    const hasBranches = !!pendingBranches;
    return (
      <div style={{ marginBottom: 2, maxWidth: '80%' }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, overflow: 'hidden', boxShadow: WA.shadow }}>
          {/* Body */}
          <div style={{ padding: '6px 7px 8px 9px' }}>
            {msg.listHeader && (
              <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: WA.text }}>{msg.listHeader}</p>
            )}
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text }}>{msg.listBody}</p>
            {msg.listFooter && (
              <p style={{ margin: '3px 0 0', fontSize: 12, color: WA.subtext }}>{msg.listFooter}</p>
            )}
            <Meta />
          </div>
          {/* "View options" button — expands to show rows */}
          <div style={{ borderTop: `1px solid ${WA.divider}`, padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: WA.teal, fontSize: 14, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={WA.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill={WA.teal} stroke="none"/>
              <circle cx="3" cy="12" r="1" fill={WA.teal} stroke="none"/><circle cx="3" cy="18" r="1" fill={WA.teal} stroke="none"/>
            </svg>
            {msg.listButtonText || 'View options'}
          </div>
        </div>
        {/* Expanded rows — shown directly as they are branch selectors */}
        {(msg.sections || []).map((sec, si) => (
          <div key={si} style={{ background: '#fff', borderRadius: 8, marginTop: 2, overflow: 'hidden', boxShadow: WA.shadow }}>
            {sec.title && (
              <p style={{ fontSize: 11, fontWeight: 700, color: WA.teal, padding: '7px 12px 4px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f5faf9', borderBottom: `1px solid ${WA.divider}` }}>
                {sec.title}
              </p>
            )}
            {(sec.rows || []).map((row, ri) => {
              const branch = pendingBranches?.find(br => br.handle === row.id);
              const active = !!branch;
              return (
                <button
                  key={row.id}
                  onClick={active ? () => onBranchSelect(branch) : undefined}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 14px',
                    border: 'none',
                    borderTop: ri === 0 ? 'none' : `1px solid ${WA.divider}`,
                    background: 'transparent',
                    cursor: active ? 'pointer' : 'default',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (active) e.currentTarget.style.background = WA.tealLight; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 1px', color: active ? WA.teal : WA.text }}>{row.title}</p>
                  {row.description && <p style={{ fontSize: 12, color: WA.subtext, margin: 0 }}>{row.description}</p>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // ── CTA URL button ──
  if (msg.type === 'cta_url') {
    return (
      <div style={{ marginBottom: 2, maxWidth: '80%' }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, overflow: 'hidden', boxShadow: WA.shadow }}>
          <div style={{ padding: '6px 7px 8px 9px' }}>
            {msg.header && <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: WA.text }}>{msg.header}</p>}
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
            {msg.footer && <p style={{ margin: '3px 0 0', fontSize: 12, color: WA.subtext }}>{msg.footer}</p>}
            <Meta />
          </div>
          <a href={msg.url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 16px', borderTop: `1px solid ${WA.divider}`, color: '#027eb5', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#027eb5" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            {msg.buttonText || 'Open Link'}
          </a>
        </div>
      </div>
    );
  }

  // ── Flow (native form) ──
  if (msg.type === 'flow') {
    return (
      <div style={{ marginBottom: 2, maxWidth: '80%' }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, overflow: 'hidden', boxShadow: WA.shadow }}>
          <div style={{ padding: '6px 7px 8px 9px' }}>
            {msg.header && <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: WA.text }}>{msg.header}</p>}
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
            {msg.footer && <p style={{ margin: '3px 0 0', fontSize: 12, color: WA.subtext }}>{msg.footer}</p>}
            <Meta />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 16px', borderTop: `1px solid ${WA.divider}`, color: WA.teal, fontSize: 14, fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={WA.teal} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
            {msg.flowCta || 'Open Form'}
          </div>
        </div>
        <p style={{ fontSize: 10, color: WA.subtext, margin: '4px 0 0', textAlign: 'center' }}>
          📋 Opens a native WhatsApp form (Flow {msg.flowId || '—'})
        </p>
      </div>
    );
  }

  // ── Media message ──
  if (msg.type === 'media') {
    const isVideo    = msg.mediaType === 'video';
    const isDocument = msg.mediaType === 'document';
    return (
      <div style={{ marginBottom: 2 }}>
        <div style={{ background: '#fff', borderRadius: WA.radius, overflow: 'hidden', boxShadow: WA.shadow, maxWidth: '75%' }}>
          {isDocument ? (
            /* Document: icon + filename */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
              <div style={{ width: 40, height: 44, background: '#e3f2fd', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: WA.text, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {msg.mediaUrl ? msg.mediaUrl.split('/').pop() || 'document.pdf' : 'document.pdf'}
                </p>
                <p style={{ fontSize: 11, color: WA.subtext, margin: 0 }}>PDF · Tap to open</p>
              </div>
            </div>
          ) : (
            /* Image / Video: preview area */
            <div style={{ position: 'relative', width: 220, height: 160, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {msg.mediaUrl ? (
                <img
                  src={msg.mediaUrl}
                  alt="media"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 36 }}>{isVideo ? '🎬' : '🖼️'}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{isVideo ? 'Video' : 'Image'}</span>
                </div>
              )}
              {isVideo && (
                <div style={{ position: 'absolute', width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              )}
            </div>
          )}
          {/* Caption + timestamp */}
          <div style={{ padding: '5px 7px 6px 9px' }}>
            {msg.mediaCaption && (
              <p style={{ fontSize: 14, color: WA.text, margin: '0 0 2px', lineHeight: 1.4 }}>{msg.mediaCaption}</p>
            )}
            <Meta />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
      <div style={{ background: '#d9fdd3', borderRadius: '8px 0px 8px 8px', padding: '6px 7px 8px 9px', maxWidth: '75%', boxShadow: WA.shadow, position: 'relative' }}>
        {/* Sent bubble tail */}
        <svg style={{ position: 'absolute', top: 0, right: -8 }} width="8" height="13" viewBox="0 0 8 13">
          <path d="M0 0 Q8 0 8 13 L0 8 Z" fill="#d9fdd3"/>
        </svg>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: WA.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</p>
        <Meta />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function TestPanel({ workflowId, nodes, edges, onClose }) {
  const [messages, setMessages]           = useState([]);
  const [pendingBranches, setPending]     = useState(null);
  const [pendingInput, setPendingInput]   = useState(null);   // collect_input node awaiting response
  const [collectedVars, setCollectedVars] = useState({});     // { name: 'John', phone: '...' }
  const [inputText, setInputText]         = useState('');
  const [started, setStarted]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const chatEndRef                        = useRef(null);

  const triggerRaw = nodes.find(n => n.type === 'trigger')?.data?.keyword || '';
  const triggerKw  = triggerRaw; // kept for compat
  const triggerKws = triggerRaw.split(',').map(k => k.trim()).filter(Boolean);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingBranches]);

  // substitute {{var}} placeholders with collected values
  const interpolate = (node, vars) => {
    if (!node?.data?.message?.text) return node;
    const text = node.data.message.text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
    return { ...node, data: { ...node.data, message: { ...node.data.message, text } } };
  };

  const addTypingThenSend = (nodesToSend, branches, inputNode, vars = collectedVars) => {
    setMessages(prev => [...prev, { type: 'typing' }]);
    setTimeout(() => {
      const rendered = nodesToSend.map(n => ({ type: 'bot', node: interpolate(n, vars) }));
      setMessages(prev => [...prev.filter(m => m.type !== 'typing'), ...rendered]);
      setPending(branches);
      setPendingInput(inputNode || null);
    }, 600);
  };

  const startConversation = () => {
    if (!inputText.trim()) return;

    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      setError('No trigger node found. Add a Keyword Trigger to the canvas.');
      return;
    }

    const { keyword = '', matchType = 'contains' } = triggerNode.data;
    if (!keyword.trim()) {
      setError('Set a keyword on the Trigger node first.');
      return;
    }

    const text = inputText.toLowerCase().trim();
    // Support comma-separated keywords — match ANY of them
    const keywords = keyword.split(',').map(k => k.toLowerCase().trim()).filter(Boolean);
    const matched  = keywords.some(kw =>
      matchType === 'exact' ? text === kw : text.includes(kw)
    );

    if (!matched) {
      const kwList = keywords.map(k => `"${k}"`).join(', ');
      setError(`"${inputText}" doesn't match any trigger keyword: ${kwList} (${matchType}).`);
      return;
    }

    setStarted(true);
    setError('');
    setMessages([{ type: 'user', text: inputText }]);
    setPending(null);

    const { nodesToSend, pendingBranches, pendingInput } = collectMessages(nodes, edges, triggerNode.id, collectedVars);
    addTypingThenSend(nodesToSend, pendingBranches, pendingInput);
  };

  const handleBranchSelect = (branch) => {
    setMessages(prev => [...prev, { type: 'user', text: branch.label }]);
    setPending(null);
    const { nodesToSend, pendingBranches, pendingInput } = collectMessages(nodes, edges, branch.target, collectedVars);
    addTypingThenSend(nodesToSend, pendingBranches, pendingInput);
  };

  // Called when user submits an answer to a collect_input node
  const handleInputSubmit = () => {
    if (!inputText.trim() || !pendingInput) return;
    const varName = pendingInput.data.variableName || 'input';
    const newVars = { ...collectedVars, [varName]: inputText.trim() };
    setCollectedVars(newVars);
    setMessages(prev => [...prev, { type: 'user', text: inputText.trim() }]);
    setInputText('');
    setPendingInput(null);
    // Find the node after this collect_input node and continue
    const outgoing = edges.filter(e => e.source === pendingInput.id);
    if (!outgoing.length) return;
    const nextNode = nodes.find(n => n.id === outgoing[0].target);
    if (!nextNode) return;
    const { nodesToSend, pendingBranches, pendingInput: nextInput } = collectMessages(nodes, edges, nextNode.id, newVars);
    addTypingThenSend([nextNode, ...nodesToSend.filter(n => n.id !== nextNode.id)], pendingBranches, nextInput, newVars);
  };

  const reset = () => {
    setMessages([]); setPending(null); setPendingInput(null);
    setCollectedVars({}); setInputText(''); setStarted(false); setError('');
  };

  const isConversationEnd = started && !pendingBranches && !pendingInput && messages.length > 0 && messages[messages.length - 1]?.type === 'bot';
  const isAwaitingInput   = !!pendingInput;

  return (
    <div style={{ width: 350, background: '#fff', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', fontFamily: "'Inter',sans-serif", overflow: 'hidden', flexShrink: 0 }}>

      {/* WA-style top bar */}
      <div style={{ background: '#075e54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>WPLeads Bot</p>
          <p style={{ fontSize: 11, color: '#b2dfdb', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {triggerKws.length > 0
              ? `Triggers: ${triggerKws.map(k => `"${k}"`).join(', ')}`
              : 'WhatsApp Business'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {started && (
            <button onClick={reset} style={{ fontSize: 11, color: '#b2dfdb', background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
              ↺ Reset
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}>×</button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#efeae2', padding: '14px 12px 14px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 0h80v80H0z' fill='%23efeae2'/%3E%3Cpath opacity='.03' d='M40 10c16.6 0 30 13.4 30 30S56.6 70 40 70 10 56.6 10 40 23.4 10 40 10z' fill='%23000'/%3E%3C/svg%3E")` }}>

        {/* Start hint */}
        {!started && !error && (
          <div style={{ textAlign: 'center', padding: '50px 24px 20px' }}>
            <div style={{ fontSize: 38, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 12, color: '#777', margin: 0, lineHeight: 1.7 }}>
              {triggerKws.length > 0
                ? <>Type any of: {triggerKws.map((k, i) => <strong key={i}>"{k}"{i < triggerKws.length - 1 ? ', ' : ''}</strong>)} to start</>
                : 'Add a Keyword Trigger node to begin'}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', margin: '0 0 4px' }}>No match</p>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>{error}</p>
            <button onClick={reset} style={{ fontSize: 11, color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0 }}>← Try again</button>
          </div>
        )}

        {/* Messages — pass pendingBranches only to the last bot bubble */}
        {messages.map((msg, i) => {
          if (msg.type === 'user') return <UserBubble key={i} text={msg.text} />;
          if (msg.type === 'typing') return (
            <div key={i} style={{ display: 'flex', marginBottom: 10 }}>
              <div style={{ background: '#fff', borderRadius: WA.radius, padding: '10px 14px', boxShadow: WA.shadow, display: 'inline-block' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: WA.subtext, animation: `tp-bounce 1.2s ease-in-out ${j * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          );
          if (msg.type === 'bot') {
            // Only the last bot message gets branch selectors injected into its buttons
            const isLast = messages.slice(i + 1).every(m => m.type !== 'bot');
            return (
              <BotBubble
                key={i}
                node={msg.node}
                pendingBranches={isLast ? pendingBranches : null}
                onBranchSelect={isLast ? handleBranchSelect : null}
              />
            );
          }
          return null;
        })}

        {/* End of conversation */}
        {isConversationEnd && (
          <div style={{ textAlign: 'center', margin: '14px 0 4px' }}>
            <span style={{ fontSize: 11, color: WA.subtext, background: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: '4px 16px', boxShadow: WA.shadow }}>
              🔒 End of conversation
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{ background: '#f0f0f0', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid #ddd', flexShrink: 0, flexDirection: 'column' }}>
        {/* Collect Input hint */}
        {isAwaitingInput && (
          <div style={{ width: '100%', background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#0369a1', fontWeight: 600 }}>
            📝 Waiting for: <code style={{ background: '#e0f2fe', borderRadius: 3, padding: '1px 4px' }}>{'{{' + (pendingInput?.data?.variableName || 'input') + '}}'}</code>
            <span style={{ color: '#6b7280', fontWeight: 400 }}> · Type your answer and press Enter</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, width: '100%', alignItems: 'center' }}>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (isAwaitingInput) handleInputSubmit();
                else if (!started) startConversation();
              }
            }}
            placeholder={
              isAwaitingInput ? `Type your ${pendingInput?.data?.inputType || 'answer'}...`
              : started       ? 'Tap a reply button above...'
              : triggerKws.length > 1 ? `Type "${triggerKws[0]}" or "${triggerKws[1]}" to start...`
              : `Type "${triggerKw || 'keyword'}" to start...`
            }
            disabled={started && !isAwaitingInput}
            style={{ flex: 1, border: 'none', borderRadius: 22, padding: '9px 15px', fontSize: 13, outline: 'none', background: '#fff', opacity: (started && !isAwaitingInput) ? 0.5 : 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          />
          <button
            onClick={isAwaitingInput ? handleInputSubmit : startConversation}
            disabled={(started && !isAwaitingInput) || !inputText.trim()}
            style={{ width: 38, height: 38, borderRadius: '50%', background: ((started && !isAwaitingInput) || !inputText.trim()) ? '#d1d5db' : isAwaitingInput ? '#0891b2' : '#25d366', border: 'none', cursor: ((started && !isAwaitingInput) || !inputText.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tp-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
