import React, { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Palette ─────────────────────────────────────── */
const PAL = {
  trigger:  { label:'Keyword Trigger', color:'#7c3aed', bg:'#f5f0ff', border:'#c4b5fd', icon:'⚡' },
  text:     { label:'Text Message',    color:'#0f766e', bg:'#effffa', border:'#5eead4', icon:'💬' },
  button:   { label:'Button Message',  color:'#1d4ed8', bg:'#eff6ff', border:'#93c5fd', icon:'🔘' },
  list:     { label:'List Message',    color:'#b45309', bg:'#fffbeb', border:'#fbbf24', icon:'📋' },
  media:    { label:'Media',           color:'#be185d', bg:'#fdf2f8', border:'#f9a8d4', icon:'🖼️' },
  delay:    { label:'Delay',           color:'#475569', bg:'#f8fafc', border:'#cbd5e1', icon:'⏱️' },
  condition:{ label:'Condition',       color:'#d97706', bg:'#fff7ed', border:'#fcd34d', icon:'🔀' },
};

/* ─── Node Definitions ─────────────────────────────── */
// We'll define nodes with fixed positions for a 0.65 scale canvas
// NODE_W = 220, layout spacing designed at 1x then zoomed
const NODES = [
  {
    id:'trigger', type:'trigger', x:340, y:40, w:220,
    title:'"catalog"',
    sub:'Match: Contains keyword',
    outputs:[{ id:'out', label:'', cx:0.5 }],
  },
  {
    id:'welcome', type:'text', x:310, y:180, w:260,
    title:'Welcome! 👋',
    sub:'Hi! Welcome to WPLeads Store.\nHow can I help you today?',
    outputs:[{ id:'out', label:'', cx:0.5 }],
  },
  {
    id:'menu', type:'button', x:290, y:370, w:280,
    title:'Browse our catalog',
    sub:'Choose a category to explore:',
    btns:['📱 Electronics','👕 Fashion'],
    outputs:[
      { id:'electronics', label:'📱 Electronics', cx:0.27 },
      { id:'fashion',     label:'👕 Fashion',     cx:0.73 },
    ],
  },
  {
    id:'electronics', type:'list', x:60, y:610, w:240,
    title:'📱 Electronics',
    sub:'Tap a product to learn more:',
    items:['iPhone 15 Pro','MacBook Air M3','AirPods Pro'],
    outputs:[{ id:'out', label:'', cx:0.5 }],
  },
  {
    id:'fashion', type:'list', x:560, y:610, w:240,
    title:'👕 Fashion',
    sub:'Tap a product to learn more:',
    items:['Summer Dress','Denim Jacket','Sneakers'],
    outputs:[{ id:'out', label:'', cx:0.5 }],
  },
  {
    id:'detail', type:'text', x:60, y:850, w:240,
    title:'Product Detail',
    sub:'Here\'s what you need to know about this item. Would you like to order?',
    outputs:[{ id:'out', label:'', cx:0.5 }],
  },
  {
    id:'order', type:'button', x:60, y:1030, w:240,
    title:'Ready to order?',
    sub:'',
    btns:['✅ Yes, Order','❌ No, Back'],
    outputs:[
      { id:'yes', label:'Order', cx:0.3 },
      { id:'no',  label:'Back',  cx:0.7 },
    ],
  },
];

/* ─── Edges ────────────────────────────────────────── */
// { from, fromOutput, to, toInput }
const EDGES = [
  { from:'trigger',     fromOut:'out',         to:'welcome',     color:'#a78bfa' },
  { from:'welcome',     fromOut:'out',         to:'menu',        color:'#34d399' },
  { from:'menu',        fromOut:'electronics', to:'electronics', color:'#60a5fa' },
  { from:'menu',        fromOut:'fashion',     to:'fashion',     color:'#f97316' },
  { from:'electronics', fromOut:'out',         to:'detail',      color:'#60a5fa' },
  { from:'fashion',     fromOut:'out',         to:'detail',      color:'#f97316' },
  { from:'detail',      fromOut:'out',         to:'order',       color:'#34d399' },
];

/* ─── Node Height Calculator ───────────────────────── */
function nodeHeight(n) {
  let h = 46 + 16; // header + padding top
  if (n.title) h += 18;
  if (n.sub)   h += n.sub.split('\n').length * 16 + 6;
  if (n.btns)  h += n.btns.length * 34 + 10;
  if (n.items) h += n.items.length * 28 + 10;
  h += 14; // padding bottom
  return h;
}

/* ─── Pin Positions ────────────────────────────────── */
function getInputPin(node) {
  return { x: node.x + node.w / 2, y: node.y };
}
function getOutputPin(node, outId) {
  const h = nodeHeight(node);
  const out = node.outputs?.find(o => o.id === outId) || node.outputs?.[0];
  const cx = out ? out.cx : 0.5;
  if (node.outputs?.length > 1 && out) {
    // multi-output: pins at bottom area
    return { x: node.x + node.w * cx, y: node.y + h };
  }
  return { x: node.x + node.w / 2, y: node.y + h };
}

/* ─── Edge Path ────────────────────────────────────── */
function edgePath(p1, p2) {
  const dy = Math.abs(p2.y - p1.y);
  const ctrl = Math.max(dy * 0.45, 40);
  return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + ctrl}, ${p2.x} ${p2.y - ctrl}, ${p2.x} ${p2.y}`;
}

/* ─── Single Node Component ────────────────────────── */
function FlowNode({ n, selected, onClick }) {
  const p = PAL[n.type];
  const h = nodeHeight(n);
  return (
    <div
      onClick={() => onClick(n.id)}
      style={{
        position:'absolute',
        left: n.x, top: n.y, width: n.w,
        background:'#fff',
        borderRadius: 12,
        border: `1.5px solid ${selected ? p.color : p.border}`,
        boxShadow: selected
          ? `0 0 0 3px ${p.color}33, 0 4px 20px rgba(0,0,0,0.12)`
          : '0 2px 12px rgba(0,0,0,0.07)',
        cursor:'pointer',
        userSelect:'none',
        transition:'box-shadow .15s, border-color .15s',
        zIndex: selected ? 10 : 5,
      }}
    >
      {/* Header */}
      <div style={{
        background: p.bg,
        padding:'8px 11px',
        borderRadius:'11px 11px 0 0',
        borderBottom:`1px solid ${p.border}`,
        display:'flex', alignItems:'center', gap:7,
      }}>
        <span style={{fontSize:11}}>{p.icon}</span>
        <span style={{fontSize:9.5, fontWeight:800, color:p.color, textTransform:'uppercase', letterSpacing:1, flex:1}}>{p.label}</span>
        <div style={{width:6,height:6,borderRadius:'50%',background:p.color,opacity:0.45}}/>
      </div>

      {/* Body */}
      <div style={{padding:'10px 13px 12px'}}>
        {n.title && <div style={{fontSize:12,fontWeight:700,color:'#1e293b',marginBottom:3}}>{n.title}</div>}
        {n.sub && <div style={{fontSize:10.5,color:'#64748b',lineHeight:1.55,whiteSpace:'pre-line'}}>{n.sub}</div>}

        {n.btns && (
          <div style={{marginTop:9, display:'flex', flexDirection:'column', gap:5}}>
            {n.btns.map((b,i) => (
              <div key={i} style={{
                padding:'6px 10px',
                border:`1.5px solid ${p.border}`,
                borderRadius:8, textAlign:'center',
                fontSize:10.5, color:p.color, fontWeight:700,
                background:p.bg,
              }}>{b}</div>
            ))}
          </div>
        )}

        {n.items && (
          <div style={{marginTop:9, display:'flex', flexDirection:'column', gap:4}}>
            {n.items.map((item,i) => (
              <div key={i} style={{
                padding:'5px 9px',
                background:'#f8fafc',
                border:'1px solid #f1f5f9',
                borderRadius:7,
                fontSize:10.5, color:'#475569', fontWeight:500,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                {item}
                <span style={{color:'#cbd5e1',fontSize:13}}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input pin (top) */}
      {n.id !== 'trigger' && (
        <div style={{
          position:'absolute', top:-6, left:'50%', transform:'translateX(-50%)',
          width:11, height:11, background:'#fff',
          border:`2px solid ${p.color}`, borderRadius:'50%', zIndex:15,
        }}/>
      )}

      {/* Output pins (bottom) */}
      {n.outputs && n.outputs.map(out => (
        <div key={out.id} style={{
          position:'absolute',
          bottom:-6,
          left: `calc(${out.cx * 100}% - 5.5px)`,
          width:11, height:11, background:'#fff',
          border:`2px solid ${p.color}`, borderRadius:'50%', zIndex:15,
        }}>
          {n.outputs.length > 1 && out.label && (
            <div style={{
              position:'absolute', top:14, left:'50%', transform:'translateX(-50%)',
              fontSize:8, fontWeight:700, color:p.color,
              whiteSpace:'nowrap', background:p.bg,
              padding:'1px 5px', borderRadius:4,
              border:`1px solid ${p.border}`,
            }}>{out.label}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── SVG Defs ─────────────────────────────────────── */
const EDGE_COLORS = ['#a78bfa','#34d399','#60a5fa','#f97316'];
function SvgDefs() {
  return (
    <defs>
      {EDGE_COLORS.map(c => {
        const id = c.replace('#','');
        return (
          <marker key={id} id={`arr-${id}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={c}/>
          </marker>
        );
      })}
    </defs>
  );
}

/* ─── Canvas bounds ────────────────────────────────── */
const CANVAS_W = 900;
const CANVAS_H = 1320;

/* ─── Main Component ───────────────────────────────── */
export default function WorkflowBuilder() {
  const [zoom, setZoom] = useState(0.72);
  const [selected, setSelected] = useState(null);
  const [nodes] = useState(NODES);
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const handleZoom = (delta) => setZoom(z => Math.min(1.2, Math.max(0.35, z + delta)));

  const selectedNode = selected ? nodeMap[selected] : null;
  const selectedPal  = selectedNode ? PAL[selectedNode.type] : null;

  return (
    <section style={{
      padding:'40px 20px 60px',
      background:'#f0f2f7',
      minHeight:'100vh',
      fontFamily:'"DM Sans", system-ui, sans-serif',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      <div style={{maxWidth:1340, margin:'0 auto'}}>

        {/* Header */}
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:7,
            background:'#6366f115', border:'1px solid #6366f130',
            borderRadius:100, padding:'4px 14px',
            fontSize:10, fontWeight:800, letterSpacing:1.8, color:'#6366f1',
            textTransform:'uppercase', marginBottom:12,
          }}>Visual Flow Builder</div>
          <h2 style={{
            fontSize:'clamp(24px,3vw,40px)', fontWeight:900,
            letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:8, color:'#0a0a0a',
          }}>
            Build flows visually.&nbsp;<span style={{color:'#6366f1'}}>Zero code</span>&nbsp;needed.
          </h2>
          <p style={{fontSize:14, color:'#64748b', maxWidth:420, margin:'0 auto', lineHeight:1.7}}>
            Connect nodes, define logic, publish instantly.
          </p>
        </div>

        {/* App Shell */}
        <div style={{
          background:'#fff', borderRadius:18, overflow:'hidden',
          border:'1px solid #e2e8f0',
          boxShadow:'0 20px 60px -10px rgba(0,0,0,0.12)',
          display:'flex', flexDirection:'column',
          height:'78vh', minHeight:520,
        }}>

          {/* Title bar */}
          <div style={{
            height:48, borderBottom:'1px solid #f1f5f9',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 16px', flexShrink:0, background:'#fff',
          }}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{display:'flex', gap:5}}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => (
                  <div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>
                ))}
              </div>
              <span style={{fontSize:12.5, fontWeight:700, color:'#1e293b', marginLeft:4}}>Product Catalog Flow</span>
              <span style={{fontSize:9.5, color:'#10b981', background:'#ecfdf5', padding:'2px 8px', borderRadius:100, fontWeight:700}}>✓ Saved</span>
            </div>
            <div style={{display:'flex', gap:7, alignItems:'center'}}>
              <span style={{fontSize:11, color:'#94a3b8', fontWeight:600}}>{Math.round(zoom*100)}%</span>
              <button onClick={() => handleZoom(0.1)} style={btnStyle}>＋</button>
              <button onClick={() => handleZoom(-0.1)} style={btnStyle}>－</button>
              <button onClick={() => setZoom(0.72)} style={btnStyle}>⊡</button>
              <div style={{width:1, height:22, background:'#e2e8f0', margin:'0 4px'}}/>
              <button style={{...btnStyle, background:'#f8fafc', padding:'5px 13px', fontSize:11.5, fontWeight:600}}>Preview</button>
              <button style={{background:'#6366f1', color:'#fff', border:'none', padding:'6px 14px', borderRadius:7, fontSize:11.5, fontWeight:700, cursor:'pointer'}}>Publish →</button>
            </div>
          </div>

          <div style={{display:'flex', flex:1, overflow:'hidden'}}>

            {/* ── Sidebar ── */}
            <div style={{
              width:168, borderRight:'1px solid #f1f5f9',
              padding:'12px 8px', background:'#fafafa',
              flexShrink:0, overflowY:'auto',
            }}>
              <p style={{fontSize:8.5, fontWeight:800, color:'#94a3b8', marginBottom:10, letterSpacing:1.8, textTransform:'uppercase', paddingLeft:3}}>Nodes</p>
              {Object.entries(PAL).map(([type, p]) => (
                <div key={type} style={{
                  background:p.bg,
                  border:`1px solid ${p.border}`,
                  borderRadius:8, padding:'7px 9px', marginBottom:5,
                  display:'flex', alignItems:'center', gap:7,
                  cursor:'grab', transition:'transform .15s, box-shadow .15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateX(3px)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
                >
                  <span style={{fontSize:12}}>{p.icon}</span>
                  <span style={{fontSize:10, fontWeight:700, color:p.color, lineHeight:1.3}}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* ── Canvas ── */}
            <div style={{
              flex:1, position:'relative', overflow:'auto',
              background:'#f8fafc',
              backgroundImage:'radial-gradient(#d1d8e4 1px, transparent 1px)',
              backgroundSize:'22px 22px',
            }}>
              <div style={{
                width: CANVAS_W * zoom,
                height: CANVAS_H * zoom,
                position:'relative',
                transformOrigin:'top left',
              }}>
                <div style={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                  position:'absolute',
                  top:0, left:0,
                  transform:`scale(${zoom})`,
                  transformOrigin:'top left',
                }}>

                  {/* SVG Edges */}
                  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2,overflow:'visible'}}>
                    <SvgDefs/>
                    {EDGES.map((e, i) => {
                      const fromNode = nodeMap[e.from];
                      const toNode   = nodeMap[e.to];
                      if (!fromNode || !toNode) return null;
                      const p1 = getOutputPin(fromNode, e.fromOut);
                      const p2 = getInputPin(toNode);
                      const d  = edgePath(p1, p2);
                      const cid = e.color.replace('#','');
                      return (
                        <g key={i}>
                          {/* Glow */}
                          <path d={d} stroke={e.color} strokeWidth={4} fill="none" opacity={0.18}/>
                          {/* Main */}
                          <path
                            d={d}
                            stroke={e.color}
                            strokeWidth={2}
                            fill="none"
                            strokeDasharray="7 5"
                            markerEnd={`url(#arr-${cid})`}
                            style={{animation:`flow-dash ${1.4 + i*0.15}s linear infinite`}}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nodes */}
                  {nodes.map(n => (
                    <FlowNode
                      key={n.id}
                      n={n}
                      selected={selected === n.id}
                      onClick={setSelected}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div style={{
              width:240, borderLeft:'1px solid #f1f5f9',
              background:'#fff', display:'flex', flexDirection:'column', flexShrink:0,
            }}>
              {/* Header */}
              <div style={{padding:'11px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:10, fontWeight:800, color:'#1e293b', letterSpacing:0.8}}>
                  {selected ? 'NODE PROPS' : 'PREVIEW'}
                </span>
                <div style={{display:'flex', alignItems:'center', gap:5}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 5px #22c55e'}}/>
                  <span style={{fontSize:9, color:'#64748b', fontWeight:600}}>Live</span>
                </div>
              </div>

              {selected && selectedNode ? (
                /* Node Properties */
                <div style={{flex:1, padding:'14px', overflowY:'auto'}}>
                  <div style={{
                    background: selectedPal.bg,
                    border:`1px solid ${selectedPal.border}`,
                    borderRadius:10, padding:'10px 12px', marginBottom:14,
                  }}>
                    <div style={{fontSize:10, fontWeight:800, color:selectedPal.color, textTransform:'uppercase', letterSpacing:0.9, marginBottom:2}}>
                      {selectedPal.icon} {selectedPal.label}
                    </div>
                    <div style={{fontSize:12, fontWeight:700, color:'#1e293b'}}>{selectedNode.title}</div>
                  </div>

                  {[
                    { label:'Node ID', value: selectedNode.id },
                    { label:'Type', value: selectedNode.type },
                    { label:'Outputs', value: selectedNode.outputs?.length || 0 },
                    { label:'Position', value: `${selectedNode.x}, ${selectedNode.y}` },
                  ].map(row => (
                    <div key={row.label} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'7px 0', borderBottom:'1px solid #f8fafc',
                    }}>
                      <span style={{fontSize:10.5, color:'#94a3b8', fontWeight:600}}>{row.label}</span>
                      <span style={{fontSize:10.5, color:'#1e293b', fontWeight:700, background:'#f8fafc', padding:'2px 7px', borderRadius:5}}>{row.value}</span>
                    </div>
                  ))}

                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop:16, width:'100%', padding:'7px',
                      background:'#f8fafc', border:'1px solid #e2e8f0',
                      borderRadius:8, fontSize:11, fontWeight:700,
                      color:'#475569', cursor:'pointer',
                    }}
                  >✕ Deselect</button>
                </div>
              ) : (
                /* WhatsApp Preview */
                <div style={{flex:1, padding:'10px', background:'#f8fafc', display:'flex', flexDirection:'column', overflow:'hidden'}}>
                  <div style={{
                    background:'#fff', borderRadius:12, overflow:'hidden',
                    flex:1, border:'1px solid #e2e8f0',
                    boxShadow:'0 4px 16px rgba(0,0,0,0.06)',
                    display:'flex', flexDirection:'column',
                  }}>
                    {/* WA Header */}
                    <div style={{background:'#075e54', padding:'10px 12px', display:'flex', alignItems:'center', gap:8, flexShrink:0}}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#25d366,#16a34a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>🤖</div>
                      <div>
                        <div style={{fontSize:11, fontWeight:700, color:'#fff'}}>WPLeads Bot</div>
                        <div style={{fontSize:8, color:'rgba(255,255,255,0.6)'}}>online</div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{flex:1, padding:'8px', background:'#e5ddd5', display:'flex', flexDirection:'column', gap:6, overflowY:'auto'}}>
                      <div style={{textAlign:'center',fontSize:8,color:'#78909c',background:'rgba(255,255,255,0.7)',borderRadius:5,padding:'2px 9px',alignSelf:'center'}}>TODAY</div>

                      {/* Bot welcome */}
                      <WaMsg side="bot" time="10:32">
                        <div style={{fontSize:10,lineHeight:1.5,color:'#111'}}>Welcome! 👋 Hi! Welcome to WPLeads Store.</div>
                      </WaMsg>

                      {/* Bot buttons */}
                      <WaMsg side="bot" time="10:32">
                        <div style={{fontSize:10,lineHeight:1.5,color:'#111',marginBottom:5}}>Browse our catalog. Choose a category:</div>
                        {['📱 Electronics','👕 Fashion'].map(b=>(
                          <div key={b} style={{textAlign:'center',fontSize:9,color:'#128C7E',fontWeight:700,border:'1px solid rgba(18,140,126,0.28)',borderRadius:6,padding:'3px 6px',background:'rgba(18,140,126,0.04)',marginBottom:3}}>{b}</div>
                        ))}
                      </WaMsg>

                      {/* User */}
                      <WaMsg side="user" time="10:33">
                        <div style={{fontSize:10,color:'#111'}}>📱 Electronics</div>
                      </WaMsg>

                      {/* Bot list */}
                      <WaMsg side="bot" time="10:33">
                        <div style={{fontSize:10,lineHeight:1.5,color:'#111',marginBottom:4}}>Electronics – tap a product:</div>
                        {['iPhone 15 Pro','MacBook Air','AirPods Pro'].map((item,i)=>(
                          <div key={i} style={{padding:'3px 7px',fontSize:9.5,color:'#128C7E',fontWeight:600,borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between'}}>
                            {item}<span style={{color:'#cbd5e1'}}>›</span>
                          </div>
                        ))}
                      </WaMsg>
                    </div>

                    {/* Input */}
                    <div style={{padding:'6px 8px',background:'#f0f2f5',display:'flex',gap:5,alignItems:'center',flexShrink:0}}>
                      <div style={{flex:1,background:'#fff',borderRadius:16,padding:'4px 10px',fontSize:9,color:'#adb5bd'}}>Type a message…</div>
                      <div style={{width:24,height:24,borderRadius:'50%',background:'#128C7E',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes flow-dash { to { stroke-dashoffset: -24; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </section>
  );
}

/* ─── WA Message Helper ─────────────────────────────── */
function WaMsg({ side, time, children }) {
  return (
    <div style={{
      alignSelf: side === 'user' ? 'flex-end' : 'flex-start',
      background: side === 'user' ? '#d9fdd3' : '#fff',
      padding:'7px 9px',
      borderRadius: side === 'user' ? '11px 3px 11px 11px' : '3px 11px 11px 11px',
      maxWidth:'92%',
      boxShadow:'0 1px 2px rgba(0,0,0,0.07)',
    }}>
      {side === 'bot' && (
        <div style={{fontSize:7,fontWeight:700,color:'#075e54',marginBottom:2,textTransform:'uppercase',letterSpacing:0.5}}>WPLeads Bot</div>
      )}
      {children}
      <div style={{fontSize:7.5,color:'#94a3b8',textAlign:'right',marginTop:2}}>{time}</div>
    </div>
  );
}

const btnStyle = {
  background:'#f8fafc', color:'#475569',
  border:'1px solid #e2e8f0',
  padding:'4px 10px', borderRadius:6,
  fontSize:13, fontWeight:700, cursor:'pointer',
  lineHeight:1,
};