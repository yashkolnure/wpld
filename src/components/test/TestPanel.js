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

const collectMessages = (nodes, edges, startNodeId) => {
  const nodeMap     = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodesToSend = [];
  let currentId     = startNodeId;
  while (true) {
    const node = nodeMap[currentId];
    if (!node) break;
    if (node.type !== 'trigger') nodesToSend.push(node);
    const outgoing = edges.filter(e => e.source === currentId);
    if (!outgoing.length) break;
    if (outgoing.length > 1) {
      return { nodesToSend, pendingBranches: getBranches(nodes, edges, currentId), pendingNodeId: currentId };
    }
    const nextNode = nodeMap[outgoing[0].target];
    if (!nextNode) break;
    currentId = nextNode.id;
  }
  return { nodesToSend, pendingBranches: null, pendingNodeId: null };
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

// pendingBranches + onBranchSelect are passed only to the LAST bot bubble
function BotBubble({ node, pendingBranches, onBranchSelect }) {
  const msg = node?.data?.message;
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
  const [messages, setMessages]       = useState([]);
  const [pendingBranches, setPending] = useState(null);
  const [inputText, setInputText]     = useState('');
  const [started, setStarted]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const chatEndRef                    = useRef(null);

  const triggerKw   = nodes.find(n => n.type === 'trigger')?.data?.keyword || '';
  const triggerKws  = triggerKw.split(',').map(k => k.trim()).filter(Boolean);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingBranches]);

  const addTypingThenSend = (nodesToSend, branches) => {
    setMessages(prev => [...prev, { type: 'typing' }]);
    setTimeout(() => {
      setMessages(prev => [...prev.filter(m => m.type !== 'typing'), ...nodesToSend.map(node => ({ type: 'bot', node }))]);
      setPending(branches);
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

    const text     = inputText.toLowerCase().trim();
    const keywords = keyword.split(',').map(k => k.toLowerCase().trim()).filter(Boolean);
    const matched  = keywords.some(kw =>
      matchType === 'exact' ? text === kw : text.includes(kw)
    );

    if (!matched) {
      const kwDisplay = keywords.length > 1 ? keywords.join(', ') : keywords[0];
      setError(`"${inputText}" doesn't match any trigger keyword (${matchType}): ${kwDisplay}`);
      return;
    }

    setStarted(true);
    setError('');
    setMessages([{ type: 'user', text: inputText }]);
    setPending(null);

    const { nodesToSend, pendingBranches } = collectMessages(nodes, edges, triggerNode.id);
    addTypingThenSend(nodesToSend, pendingBranches);
  };

  const handleBranchSelect = (branch) => {
    setMessages(prev => [...prev, { type: 'user', text: branch.label }]);
    setPending(null);
    const { nodesToSend, pendingBranches } = collectMessages(nodes, edges, branch.target);
    addTypingThenSend(nodesToSend, pendingBranches);
  };

  const reset = () => {
    setMessages([]); setPending(null); setInputText(''); setStarted(false); setError('');
  };

  const isConversationEnd = started && !pendingBranches && messages.length > 0 && messages[messages.length - 1]?.type === 'bot';

  return (
    <div style={{ width: 350, background: '#fff', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', fontFamily: "'Inter',sans-serif", overflow: 'hidden', flexShrink: 0 }}>

      {/* WA-style top bar */}
      <div style={{ background: '#075e54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>WPLeads Bot</p>
          <p style={{ fontSize: 11, color: '#b2dfdb', margin: 0 }}>
            {triggerKws.length > 0
              ? `Triggers: ${triggerKws.slice(0, 3).map(k => `"${k}"`).join(', ')}${triggerKws.length > 3 ? ` +${triggerKws.length - 3} more` : ''}`
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
                ? <>Type any keyword — e.g. <strong>"{triggerKws[0]}"</strong> — to start</>
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
      <div style={{ background: '#f0f0f0', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid #ddd', flexShrink: 0 }}>
        <>
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !started && startConversation()}
              placeholder={started ? 'Tap a reply button above...' : `Type "${triggerKws[0] || 'keyword'}" to start...`}
              disabled={started}
              style={{ flex: 1, border: 'none', borderRadius: 22, padding: '9px 15px', fontSize: 13, outline: 'none', background: '#fff', opacity: started ? 0.5 : 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            />
            <button
              onClick={startConversation}
              disabled={started || !inputText.trim()}
              style={{ width: 38, height: 38, borderRadius: '50%', background: (started || !inputText.trim()) ? '#d1d5db' : '#25d366', border: 'none', cursor: started ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </>
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
