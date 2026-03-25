import React from 'react';

const palette = [
  { type: 'trigger', label: 'Keyword trigger', color: '#534AB7', bg: '#EEEDFE', border: '#AFA9EC', icon: '⚡' },
  { type: 'text',    label: 'Text message',    color: '#0F6E56', bg: '#E1F5EE', border: '#5DCAA5', icon: '💬' },
  { type: 'button',  label: 'Button message',  color: '#185FA5', bg: '#E6F1FB', border: '#85B7EB', icon: '🔘' },
  { type: 'list',    label: 'List message',    color: '#854F0B', bg: '#FAEEDA', border: '#EF9F27', icon: '📜' },
  { type: 'media',   label: 'Media message',   color: '#993C1D', bg: '#FAECE7', border: '#F0997B', icon: '🖼️' },
  { type: 'delay',   label: 'Delay',           color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A9', icon: '⏳' },
];

const Handle = ({ position, color = "#6366f1" }) => (
  <div style={{
    position: "absolute",
    ...position,
    width: 10,
    height: 10,
    background: "#fff",
    border: `2px solid ${color}`,
    borderRadius: "50%",
    zIndex: 10
  }} />
);

function NodeBox({ x, y, label, content, nodePalette, btns, listItems, active, width = 230 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: width,
      background: "#fff", border: `1.5px solid ${active ? '#6366f1' : '#e2e8f0'}`, borderRadius: 12,
      boxShadow: active ? "0 0 0 3px rgba(99, 102, 241, 0.1), 0 10px 30px -10px rgba(0,0,0,0.1)" : "0 4px 20px -10px rgba(0,0,0,0.08)",
      zIndex: 5, transition: "all 0.2s ease"
    }}>
      {/* Node Header */}
      <div style={{ background: nodePalette.bg, padding: "8px 12px", borderRadius: "11px 11px 0 0", borderBottom: `1px solid ${nodePalette.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{fontSize: 12}}>{nodePalette.icon}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: nodePalette.color, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
      </div>

      {/* Node Body */}
      <div style={{ padding: "14px", fontSize: 12, color: "#1e293b" }}>
        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{content.title}</div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{content.body}</div>
        
        {listItems && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {listItems.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', padding: "8px 12px", border: "1.2px solid #f1f5f9", borderRadius: 8, fontSize: 11, background: "#f8fafc", color: "#475569", fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {item}
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cbd5e1" }} />
              </div>
            ))}
          </div>
        )}

        {btns && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {btns.map((b, idx) => (
              <div key={idx} style={{ padding: "8px", border: "1.5px solid #e2e8f0", borderRadius: 10, textAlign: "center", fontSize: 11, background: "#fff", color: "#185FA5", fontWeight: 700, cursor: "default" }}>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logic Handles (Matching your image) */}
      <Handle position={{ top: -6, left: "50%", marginLeft: -5 }} color={nodePalette.color} />
      <Handle position={{ bottom: -6, left: "50%", marginLeft: -5 }} color={nodePalette.color} />
      <Handle position={{ top: "50%", right: -6, marginTop: -5 }} color={nodePalette.color} />
      <Handle position={{ top: "50%", left: -6, marginTop: -5 }} color={nodePalette.color} />
    </div>
  );
}

export default function WorkflowBuilderPreview() {
  return (
    <section id="builder" style={{ padding: "80px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        
        {/* Production Frame */}
        <div style={{ 
          display: "flex", flexDirection: "column", height: 750, background: "#fff", borderRadius: 24, overflow: "hidden", 
          border: "1px solid #e2e8f0", boxShadow: "0 40px 120px -20px rgba(0,0,0,0.12)" 
        }}>
          
          {/* TOP NAV BAR */}
          <div style={{ height: 60, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Product catalog</span>
              <span style={{ fontSize: 11, color: "#10b981", background: "#ecfdf5", padding: "2px 8px", borderRadius: 100 }}>✓ Saved</span>
            </div>
            <button style={{ background: "#6366f1", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Update workflow</button>
          </div>

          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            
            {/* LEFT SIDEBAR */}
            <div style={{ width: 240, borderRight: "1px solid #f1f5f9", padding: "24px", background: "#fff" }} className="builder-sidebar">
              <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", marginBottom: 20, letterSpacing: 1 }}>DRAG TO CANVAS</p>
              {palette.map(p => (
                <div key={p.type} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 12, padding: "12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, cursor: "grab", transition: "transform 0.1s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <span style={{fontSize: 16}}>{p.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* MAIN CANVAS */}
            <div style={{ flex: 1, position: "relative", overflow: "auto", background: "#f8fafc", backgroundImage: "radial-gradient(#cbd5e1 0.8px, transparent 0.8px)", backgroundSize: "30px 30px" }}>
              <div style={{ width: 1200, height: 600, position: "relative" }}>
                
                {/* RE-LINKED SVG PATHS (Corrected Logic) */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  {/* Trigger to List */}
                  <path d="M430 85 C 430 150, 245 120, 245 150" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  
                  {/* List Item 1 to Text Message */}
                  <path d="M250 215 C 350 215, 450 180, 520 180" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  
                  {/* List Item 2 to Button Message */}
                  <path d="M250 255 C 350 255, 450 400, 540 400" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />

                  {/* Text Message to Button Message */}
                  <path d="M635 285 C 635 320, 635 340, 635 380" stroke="#6366f1" strokeWidth="2.5" fill="none" style={{animation: "wpl-edge-flow 20s linear infinite"}} strokeDasharray="6,6" />
                </svg>

                <NodeBox 
                  x={320} y={30} 
                  label="Keyword Trigger" 
                  content={{ title: '"catalog"', body: "MatchType: Contains" }} 
                  nodePalette={palette[0]} 
                />

                <NodeBox 
                  x={20} y={150} 
                  label="List Message" 
                  content={{ title: "Our products", body: "Browse our full range. Tap any item to learn more." }} 
                  nodePalette={palette[3]} 
                  listItems={["Product A", "Product B", "Product C", "Product D"]}
                />

                <NodeBox 
                  x={520} y={130} 
                  label="Text Message" 
                  content={{ title: "Product A Detail", body: "Product A — our best seller! Starts at $29. Includes full setup." }} 
                  nodePalette={palette[1]} 
                />

                <NodeBox 
                  x={540} y={380} 
                  label="Button Message" 
                  content={{ title: "Ready to order?", body: "Choose how you'd like to proceed." }} 
                  nodePalette={palette[2]} 
                  btns={["Place order 🛍️", "Talk to sales 📞", "See more"]}
                  active={true}
                />
              </div>

              {/* FLOATING CONTROLS */}
              <div style={{ position: "absolute", bottom: 30, left: 30, display: "flex", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 6, gap: 6, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                {['+', '-', '□', '⚡'].map(c => <div key={c} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#94a3b8", fontWeight: 700, cursor: "pointer" }}>{c}</div>)}
              </div>
            </div>

            {/* RIGHT TEST PREVIEW (WhatsApp Mockup) */}
            <div style={{ width: 340, borderLeft: "1px solid #f1f5f9", background: "#fff", display: "flex", flexDirection: "column" }} className="builder-sidebar">
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b", letterSpacing: 0.5 }}>TEST WORKFLOW</span>
                <span style={{ fontSize: 18, color: "#94a3b8", cursor: "pointer" }}>×</span>
              </div>
              
              <div style={{ padding: "24px", background: "#f8fafc", flex: 1 }}>
                <div style={{ background: "#fff", borderRadius: 20, height: "100%", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                   {/* WhatsApp Header */}
                   <div style={{ background: "#075e54", padding: "14px 18px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#128c7e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>WPLeads Preview</div>
                   </div>
                   
                   {/* WhatsApp Content */}
                   <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "#e5ddd5", flex: 1, backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundSize: "contain" }}>
                      
                      {/* List Message Bubble */}
                      <div style={{ alignSelf: "flex-start", background: "#fff", padding: "10px 12px", borderRadius: "0 12px 12px 12px", fontSize: 12, maxWidth: "85%", boxShadow: "0 1px 1px rgba(0,0,0,0.1)" }}>
                        <div style={{fontWeight: 700, color: "#000"}}>Our products</div>
                        <div style={{color: "#666", fontSize: 11, marginTop: 2}}>Browse our full range. Tap any item to learn more.</div>
                        <div style={{ marginTop: 10, padding: "8px", borderTop: "1px solid #eee", color: "#00a884", textAlign: "center", fontWeight: 700, fontSize: 11 }}>View catalog</div>
                      </div>

                      {/* Button Message Bubble */}
                      <div style={{ alignSelf: "flex-start", background: "#dcf8c6", padding: "10px 12px", borderRadius: "12px 0 12px 12px", fontSize: 12, maxWidth: "85%", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", border: "1px solid #c7e9b0" }}>
                        <div style={{fontWeight: 600}}>Ready to order? Choose how you'd like to proceed.</div>
                        <div style={{display: "flex", flexDirection: "column", gap: 6, marginTop: 10}}>
                           <div style={{background: "#fff", padding: "6px", borderRadius: 6, textAlign: "center", color: "#00a884", fontWeight: 700, fontSize: 11}}>Place order</div>
                           <div style={{background: "#fff", padding: "6px", borderRadius: 6, textAlign: "center", color: "#00a884", fontWeight: 700, fontSize: 11}}>Talk to sales</div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes wpl-edge-flow { 
          from { stroke-dashoffset: 120; } 
          to { stroke-dashoffset: 0; } 
        }
        @media (max-width: 1024px) {
          .builder-sidebar { display: none !important; }
        }
      `}</style>
    </section>
  );
}