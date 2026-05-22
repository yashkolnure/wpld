import React from 'react';

/* ── Palette ── */
const PALETTE = [
  { type:'trigger', label:'Keyword Trigger', color:'#7c3aed', bg:'#f5f3ff', border:'#c4b5fd', icon:'⚡' },
  { type:'text',    label:'Text Message',    color:'#0f766e', bg:'#f0fdfa', border:'#5eead4', icon:'💬' },
  { type:'button',  label:'Buttons',         color:'#1d4ed8', bg:'#eff6ff', border:'#93c5fd', icon:'🔘' },
  { type:'list',    label:'List Message',    color:'#b45309', bg:'#fffbeb', border:'#f59e0b', icon:'📋' },
  { type:'media',   label:'Media',           color:'#be185d', bg:'#fdf2f8', border:'#f9a8d4', icon:'🖼️' },
  { type:'delay',   label:'Delay',           color:'#475569', bg:'#f8fafc', border:'#cbd5e1', icon:'⏱️' },
];
const PAL = Object.fromEntries(PALETTE.map(p => [p.type, p]));

/*
  FLOW LAYOUT  (all dimensions in px)
  ─────────────────────────────────────────────────────────────
  Node              x     y    w    approx-h   cx      cy-bot
  ─────────────────────────────────────────────────────────────
  Trigger          390    20   210     88       495      108
  Welcome          350   162   260    108       480      270
  Menu             325   330   270    198       460      528
  Electronics       30   582   240    196       150      ─
  Fashion          700   582   240    196       820      ─
  ─────────────────────────────────────────────────────────────

  EDGES  (from-cx, from-bot)  →  (to-cx, to-top)
  1  495,108  →  480,162   straight down
  2  480,270  →  460,330   straight down
  3  460,528  →  150,582   branch left
  4  460,528  →  820,582   branch right
*/

const NODES = [
  {
    id:'trigger', x:390, y:20, w:210, type:'trigger',
    label:'Keyword Trigger',
    title: '"catalog"',
    sub:   'Match: Contains',
  },
  {
    id:'welcome', x:350, y:162, w:260, type:'text',
    label:'Text Message',
    title: 'Welcome! 👋',
    sub:   'Hi! Welcome to WPLeads Store.\nHow can I help you today?',
  },
  {
    id:'menu', x:325, y:330, w:270, type:'button',
    label:'Button Message',
    title: 'Browse our catalog',
    sub:   'Choose a category to explore:',
    btns:  ['📱 Electronics', '👕 Fashion'],
  },
  {
    id:'electronics', x:30, y:582, w:245, type:'list',
    label:'List Message',
    title: 'Electronics',
    sub:   'Tap a product to learn more:',
    items: ['iPhone 15 Pro', 'MacBook Air M3', 'AirPods Pro'],
  },
  {
    id:'fashion', x:695, y:582, w:245, type:'list',
    label:'List Message',
    title: 'Fashion',
    sub:   'Tap a product to learn more:',
    items: ['Summer Dress', 'Denim Jacket', 'Sneakers'],
  },
];

const EDGES = [
  { d:'M 495 108 C 495 135 480 135 480 162', color:'#a78bfa' },
  { d:'M 480 270 C 480 300 460 300 460 330', color:'#34d399' },
  { d:'M 460 528 C 460 555 152 555 152 582', color:'#60a5fa', dashed:true },
  { d:'M 460 528 C 460 555 817 555 817 582', color:'#60a5fa', dashed:true },
];

/* ── Single node ── */
function FlowNode({ n }) {
  const p = PAL[n.type];
  return (
    <div style={{
      position:'absolute', left:n.x, top:n.y, width:n.w,
      background:'#fff', borderRadius:13,
      border:`1.5px solid ${p.border}`,
      boxShadow:'0 2px 16px rgba(0,0,0,0.07)',
      zIndex:5,
    }}>
      {/* Header */}
      <div style={{
        background:p.bg, padding:'7px 11px',
        borderRadius:'12px 12px 0 0',
        borderBottom:`1px solid ${p.border}`,
        display:'flex', alignItems:'center', gap:7,
      }}>
        <span style={{fontSize:11}}>{p.icon}</span>
        <span style={{fontSize:9,fontWeight:800,color:p.color,textTransform:'uppercase',letterSpacing:0.9,flex:1}}>{n.label}</span>
        <div style={{width:6,height:6,borderRadius:'50%',background:p.color,opacity:0.5}}/>
      </div>
      {/* Body */}
      <div style={{padding:'11px 13px'}}>
        <div style={{fontSize:12,fontWeight:700,color:'#1e293b',marginBottom:3}}>{n.title}</div>
        <div style={{fontSize:10.5,color:'#64748b',lineHeight:1.5,whiteSpace:'pre-line'}}>{n.sub}</div>
        {n.btns && (
          <div style={{marginTop:9,display:'flex',flexDirection:'column',gap:5}}>
            {n.btns.map((b,i)=>(
              <div key={i} style={{
                padding:'6px 10px', border:'1.5px solid #dbeafe',
                borderRadius:8, textAlign:'center',
                fontSize:10.5, color:'#1d4ed8', fontWeight:700, background:'#eff6ff',
              }}>{b}</div>
            ))}
          </div>
        )}
        {n.items && (
          <div style={{marginTop:9,display:'flex',flexDirection:'column',gap:4}}>
            {n.items.map((item,i)=>(
              <div key={i} style={{
                padding:'5px 9px', background:'#f8fafc',
                border:'1px solid #f1f5f9', borderRadius:7,
                fontSize:10.5, color:'#475569', fontWeight:500,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                {item}
                <span style={{color:'#cbd5e1',fontSize:12}}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Handles */}
      {n.id !== 'electronics' && n.id !== 'fashion' && (
        <div style={{position:'absolute',bottom:-6,left:'50%',transform:'translateX(-50%)',width:10,height:10,background:'#fff',border:`2px solid ${p.color}`,borderRadius:'50%',zIndex:10}}/>
      )}
      {n.id !== 'trigger' && (
        <div style={{position:'absolute',top:-6,left:'50%',transform:'translateX(-50%)',width:10,height:10,background:'#fff',border:`2px solid ${p.color}`,borderRadius:'50%',zIndex:10}}/>
      )}
    </div>
  );
}

/* ── Main export ── */
export default function WorkflowBuilderPreview() {
  return (
    <section id="builder" style={{padding:'clamp(60px,7vw,100px) clamp(16px,4vw,48px)',background:'#fff'}}>
      <div style={{maxWidth:1400,margin:'0 auto'}}>

        {/* Section heading */}
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(99,102,241,0.07)',border:'1px solid rgba(99,102,241,0.18)',
            borderRadius:100,padding:'5px 14px',
            fontSize:10.5,fontWeight:700,letterSpacing:1.5,color:'#6366f1',textTransform:'uppercase',
            marginBottom:16,
          }}>Visual Builder</div>
          <h2 style={{fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,letterSpacing:'-0.03em',lineHeight:1.1,marginBottom:12,color:'#0a0a0a'}}>
            Build flows visually.<br/>Zero code needed.
          </h2>
          <p style={{fontSize:15,color:'rgba(0,0,0,0.5)',maxWidth:460,margin:'0 auto',lineHeight:1.7}}>
            Drag nodes, connect them, publish instantly. Every conversation path visible at a glance.
          </p>
        </div>

        {/* App chrome */}
        <div style={{
          background:'#fff', borderRadius:20, overflow:'hidden',
          border:'1px solid #e2e8f0',
          boxShadow:'0 30px 80px -16px rgba(0,0,0,0.13)',
          display:'flex', flexDirection:'column',
          height:680,
        }}>

          {/* Title bar */}
          <div style={{
            height:52, borderBottom:'1px solid #f1f5f9',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 18px', flexShrink:0,
            background:'#fff',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',gap:5}}>
                <div style={{width:11,height:11,borderRadius:'50%',background:'#ef4444'}}/>
                <div style={{width:11,height:11,borderRadius:'50%',background:'#f59e0b'}}/>
                <div style={{width:11,height:11,borderRadius:'50%',background:'#22c55e'}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:'#1e293b',marginLeft:6}}>Product catalog</span>
              <span style={{fontSize:10,color:'#10b981',background:'#ecfdf5',padding:'2px 8px',borderRadius:100,fontWeight:600}}>✓ Saved</span>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button style={{background:'#f8fafc',color:'#475569',border:'1px solid #e2e8f0',padding:'5px 13px',borderRadius:7,fontSize:12,fontWeight:600,cursor:'pointer'}}>Preview</button>
              <button style={{background:'#6366f1',color:'#fff',border:'none',padding:'6px 15px',borderRadius:7,fontSize:12,fontWeight:700,cursor:'pointer'}}>Publish</button>
            </div>
          </div>

          <div style={{display:'flex',flex:1,overflow:'hidden'}}>

            {/* ── LEFT SIDEBAR ── */}
            <div className="wf-sidebar" style={{
              width:188, borderRight:'1px solid #f1f5f9',
              padding:'14px 10px', background:'#fafafa',
              flexShrink:0, overflowY:'auto',
            }}>
              <p style={{fontSize:9,fontWeight:800,color:'#94a3b8',marginBottom:12,letterSpacing:1.5,textTransform:'uppercase',paddingLeft:4}}>Nodes</p>
              {PALETTE.map(p=>(
                <div key={p.type}
                  style={{
                    background:p.bg, border:`1px solid ${p.border}`,
                    borderRadius:8, padding:'7px 9px', marginBottom:6,
                    display:'flex', alignItems:'center', gap:7,
                    cursor:'grab',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateX(3px)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
                >
                  <span style={{fontSize:12,flexShrink:0}}>{p.icon}</span>
                  <span style={{fontSize:10.5,fontWeight:700,color:p.color,lineHeight:1.2}}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* ── CANVAS ── */}
            <div style={{
              flex:1, position:'relative', overflow:'auto',
              background:'#f8fafc',
              backgroundImage:'radial-gradient(#dde1e9 0.9px, transparent 0.9px)',
              backgroundSize:'24px 24px',
            }}>
              <div style={{width:1040, height:820, position:'relative'}}>

                {/* SVG connections */}
                <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1}}>
                  <defs>
                    {/* one arrowhead per edge color */}
                    <marker id="arr-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="#a78bfa"/>
                    </marker>
                    <marker id="arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="#34d399"/>
                    </marker>
                    <marker id="arr-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="#60a5fa"/>
                    </marker>
                  </defs>

                  {/* Edge 1: Trigger → Welcome */}
                  <path d="M 495 108 C 495 135 480 135 480 162"
                    stroke="#a78bfa" strokeWidth="2" fill="none"
                    strokeDasharray="6 4"
                    markerEnd="url(#arr-purple)"
                    style={{animation:'wf-flow 1.4s linear infinite'}}
                  />
                  {/* Edge 2: Welcome → Menu */}
                  <path d="M 480 270 C 480 300 460 300 460 330"
                    stroke="#34d399" strokeWidth="2" fill="none"
                    strokeDasharray="6 4"
                    markerEnd="url(#arr-green)"
                    style={{animation:'wf-flow 1.6s linear infinite'}}
                  />
                  {/* Edge 3: Menu → Electronics */}
                  <path d="M 460 528 C 460 555 152 555 152 582"
                    stroke="#60a5fa" strokeWidth="2" fill="none"
                    strokeDasharray="5 4"
                    markerEnd="url(#arr-blue)"
                    style={{animation:'wf-flow 1.8s linear infinite 0.3s'}}
                  />
                  {/* Edge 4: Menu → Fashion */}
                  <path d="M 460 528 C 460 555 817 555 817 582"
                    stroke="#60a5fa" strokeWidth="2" fill="none"
                    strokeDasharray="5 4"
                    markerEnd="url(#arr-blue)"
                    style={{animation:'wf-flow 1.8s linear infinite 0.6s'}}
                  />
                </svg>

                {/* Nodes */}
                {NODES.map(n => <FlowNode key={n.id} n={n} />)}
              </div>

              {/* Zoom controls */}
              <div style={{
                position:'sticky', bottom:16, left:16,
                display:'inline-flex', background:'#fff', borderRadius:10,
                border:'1px solid #e2e8f0', padding:3, gap:2,
                boxShadow:'0 4px 14px rgba(0,0,0,0.07)',
                float:'left', marginLeft:16, zIndex:20,
              }}>
                {['+','−','⊡'].map(c=>(
                  <div key={c} style={{
                    width:30, height:30,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:15, color:'#64748b', fontWeight:700, cursor:'pointer',
                    borderRadius:7,
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}
                  >{c}</div>
                ))}
              </div>
            </div>

            {/* ── RIGHT PREVIEW ── */}
            <div className="wf-sidebar" style={{
              width:268, borderLeft:'1px solid #f1f5f9',
              background:'#fff', display:'flex', flexDirection:'column', flexShrink:0,
            }}>
              <div style={{padding:'13px 16px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:10.5,fontWeight:800,color:'#1e293b',letterSpacing:0.6}}>PREVIEW</span>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 4px #22c55e'}}/>
                  <span style={{fontSize:9,color:'#64748b',fontWeight:600}}>Live</span>
                </div>
              </div>

              <div style={{flex:1,padding:'12px',background:'#f8fafc',display:'flex',flexDirection:'column',overflow:'hidden'}}>
                <div style={{
                  background:'#fff', borderRadius:14, overflow:'hidden',
                  flex:1, border:'1px solid #e2e8f0',
                  boxShadow:'0 6px 20px rgba(0,0,0,0.06)',
                  display:'flex', flexDirection:'column',
                }}>
                  {/* WA Header */}
                  <div style={{background:'#075e54',padding:'11px 13px',display:'flex',alignItems:'center',gap:9,flexShrink:0}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#25d366,#16a34a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>🤖</div>
                    <div>
                      <div style={{fontSize:11.5,fontWeight:700,color:'#fff'}}>WPLeads Bot</div>
                      <div style={{fontSize:8.5,color:'rgba(255,255,255,0.65)'}}>online</div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{flex:1,padding:'10px 9px',background:'#e5ddd5',display:'flex',flexDirection:'column',gap:7,overflowY:'auto'}}>
                    <div style={{textAlign:'center',fontSize:8.5,color:'#78909c',background:'rgba(255,255,255,0.7)',borderRadius:6,padding:'2px 10px',alignSelf:'center'}}>TODAY</div>

                    {/* Bot welcome */}
                    <div style={{alignSelf:'flex-start',background:'#fff',padding:'8px 10px',borderRadius:'3px 11px 11px 11px',maxWidth:'90%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}}>
                      <div style={{fontSize:7.5,fontWeight:700,color:'#075e54',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>WPLeads Bot</div>
                      <div style={{fontSize:10.5,lineHeight:1.5,color:'#111'}}>Welcome! 👋 Welcome to WPLeads Store. How can I help you?</div>
                      <div style={{fontSize:8,color:'#94a3b8',textAlign:'right',marginTop:3}}>10:32</div>
                    </div>

                    {/* Bot button message */}
                    <div style={{alignSelf:'flex-start',background:'#fff',padding:'8px 10px',borderRadius:'3px 11px 11px 11px',maxWidth:'90%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}}>
                      <div style={{fontSize:7.5,fontWeight:700,color:'#075e54',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>WPLeads Bot</div>
                      <div style={{fontSize:10.5,lineHeight:1.5,color:'#111',marginBottom:6}}>Browse our catalog. Choose a category:</div>
                      {['📱 Electronics','👕 Fashion'].map(b=>(
                        <div key={b} style={{textAlign:'center',fontSize:9.5,color:'#128C7E',fontWeight:700,border:'1px solid rgba(18,140,126,0.28)',borderRadius:7,padding:'4px 8px',background:'rgba(18,140,126,0.04)',marginBottom:4}}>{b}</div>
                      ))}
                      <div style={{fontSize:8,color:'#94a3b8',textAlign:'right',marginTop:2}}>10:32</div>
                    </div>

                    {/* User reply */}
                    <div style={{alignSelf:'flex-end',background:'#d9fdd3',padding:'8px 10px',borderRadius:'11px 3px 11px 11px',maxWidth:'72%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}}>
                      <div style={{fontSize:10.5,color:'#111'}}>📱 Electronics</div>
                      <div style={{fontSize:8,color:'#94a3b8',textAlign:'right',marginTop:3,display:'flex',alignItems:'center',justifyContent:'flex-end',gap:2}}>
                        10:33
                        <svg width="12" height="7" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L5 9.5L10 2" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L10 9.5L15 2" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>

                    {/* Bot list */}
                    <div style={{alignSelf:'flex-start',background:'#fff',padding:'8px 10px',borderRadius:'3px 11px 11px 11px',maxWidth:'90%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}}>
                      <div style={{fontSize:7.5,fontWeight:700,color:'#075e54',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>WPLeads Bot</div>
                      <div style={{fontSize:10.5,lineHeight:1.5,color:'#111',marginBottom:5}}>Electronics. Tap a product:</div>
                      {['iPhone 15 Pro','MacBook Air','AirPods Pro'].map((item,i)=>(
                        <div key={i} style={{padding:'4px 8px',fontSize:10,color:'#128C7E',fontWeight:600,borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between'}}>
                          {item}<span style={{color:'#cbd5e1'}}>›</span>
                        </div>
                      ))}
                      <div style={{fontSize:8,color:'#94a3b8',textAlign:'right',marginTop:5}}>10:33</div>
                    </div>
                  </div>

                  {/* Input */}
                  <div style={{padding:'7px 9px',background:'#f0f2f5',display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
                    <div style={{flex:1,background:'#fff',borderRadius:18,padding:'5px 11px',fontSize:9.5,color:'#adb5bd'}}>Type a message…</div>
                    <div style={{width:26,height:26,borderRadius:'50%',background:'#128C7E',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes wf-flow { to { stroke-dashoffset: -20; } }
        @media (max-width: 960px) { .wf-sidebar { display: none !important; } }
      `}</style>
    </section>
  );
}
