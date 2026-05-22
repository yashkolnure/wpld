import React, { useState } from "react";

const platforms = [
  { key: "wpleads",    name: "WPLeads",    tag: "YOU",      highlight: true,  color: "#25d366" },
  { key: "wati",       name: "WATI",       tag: null,       highlight: false, color: "#94a3b8" },
  { key: "doubletick", name: "DoubleTick", tag: null,       highlight: false, color: "#94a3b8" },
  { key: "gallabox",   name: "Gallabox",   tag: null,       highlight: false, color: "#94a3b8" },
  { key: "aisensy",    name: "AiSensy",    tag: null,       highlight: false, color: "#94a3b8" },
];

const rows = [
  {
    category: "Cost",
    feature: "Monthly Platform Fee",
    icon: "💰",
    wpleads:    { val: "FREE",        type: "best"    },
    wati:       { val: "$99 / mo",    type: "bad"     },
    doubletick: { val: "$42 / mo",    type: "bad"     },
    gallabox:   { val: "$58 / mo",    type: "bad"     },
    aisensy:    { val: "$20 / mo",    type: "bad"     },
  },
  {
    category: "Cost",
    feature: "Broadcast Markup Fee",
    icon: "📢",
    wpleads:    { val: "25%",         type: "neutral" },
    wati:       { val: "35%",         type: "bad"     },
    doubletick: { val: "20%",         type: "neutral" },
    gallabox:   { val: "35%",         type: "bad"     },
    aisensy:    { val: "25%",         type: "neutral" },
  },
  {
    category: "Cost",
    feature: "Pay-per-use only",
    icon: "💳",
    wpleads:    { val: "Yes",         type: "best"    },
    wati:       { val: "No",          type: "bad"     },
    doubletick: { val: "No",          type: "bad"     },
    gallabox:   { val: "No",          type: "bad"     },
    aisensy:    { val: "No",          type: "bad"     },
  },
  {
    category: "Automation",
    feature: "Workflow Builder",
    icon: "🔀",
    wpleads:    { val: "Advanced",    type: "best"    },
    wati:       { val: "Basic",       type: "neutral" },
    doubletick: { val: "Limited",     type: "bad"     },
    gallabox:   { val: "Basic",       type: "neutral" },
    aisensy:    { val: "Basic",       type: "neutral" },
  },
  {
    category: "Automation",
    feature: "Bulk Cold Outreach",
    icon: "📤",
    wpleads:    { val: "Included",    type: "best"    },
    wati:       { val: "Add-on",      type: "neutral" },
    doubletick: { val: "Limited",     type: "neutral" },
    gallabox:   { val: "Add-on",      type: "neutral" },
    aisensy:    { val: "Limited",     type: "neutral" },
  },
  {
    category: "Automation",
    feature: "Broadcast Campaigns",
    icon: "📡",
    wpleads:    { val: "Unlimited",   type: "best"    },
    wati:       { val: "Yes",         type: "neutral" },
    doubletick: { val: "Yes",         type: "neutral" },
    gallabox:   { val: "Yes",         type: "neutral" },
    aisensy:    { val: "Yes",         type: "neutral" },
  },
  {
    category: "Automation",
    feature: "Template Management",
    icon: "📋",
    wpleads:    { val: "Built-in",    type: "best"    },
    wati:       { val: "Yes",         type: "neutral" },
    doubletick: { val: "Limited",     type: "bad"     },
    gallabox:   { val: "Yes",         type: "neutral" },
    aisensy:    { val: "Yes",         type: "neutral" },
  },
  {
    category: "Platform",
    feature: "Built-in CRM",
    icon: "👥",
    wpleads:    { val: "Included",    type: "best"    },
    wati:       { val: "Basic",       type: "neutral" },
    doubletick: { val: "Basic",       type: "neutral" },
    gallabox:   { val: "Basic",       type: "neutral" },
    aisensy:    { val: "Basic",       type: "neutral" },
  },
  {
    category: "Platform",
    feature: "Analytics Dashboard",
    icon: "📊",
    wpleads:    { val: "Advanced",    type: "best"    },
    wati:       { val: "Basic",       type: "neutral" },
    doubletick: { val: "Limited",     type: "bad"     },
    gallabox:   { val: "Basic",       type: "neutral" },
    aisensy:    { val: "Basic",       type: "neutral" },
  },
];

function Cell({ d }) {
  if (d.type === "best") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(37,211,102,0.15)", border:"1.5px solid rgba(37,211,102,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="10" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 4.5l3 3L11 1" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontSize:11, fontWeight:800, color:"#16a34a", letterSpacing:0.2 }}>{d.val}</span>
    </div>
  );
  if (d.type === "bad") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(239,68,68,0.08)", border:"1.5px solid rgba(239,68,68,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", opacity:0.7 }}>{d.val}</span>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(148,163,184,0.1)", border:"1.5px solid rgba(148,163,184,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:8, height:2, background:"#94a3b8", borderRadius:2 }}/>
      </div>
      <span style={{ fontSize:11, fontWeight:600, color:"#64748b" }}>{d.val}</span>
    </div>
  );
}

export default function PricingComparisonSection() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <section style={{
      paddingTop: "clamp(70px,8vw,110px)",
      fontFamily: "'DM Sans','Sora',system-ui,sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@500;600&display=swap');
        .cmp-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .cmp-table { width: 100%; min-width: 700px; border-collapse: separate; border-spacing: 0; }
        .cmp-hl-col { background: linear-gradient(180deg, rgba(37,211,102,0.06) 0%, rgba(37,211,102,0.03) 100%); }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:100, padding:"5px 14px", fontSize:10.5, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:2, color:"#16a34a", textTransform:"uppercase", marginBottom:16 }}>
            Platform Comparison
          </div>
          <h2 style={{ fontSize:"clamp(28px,3.5vw,46px)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:12, color:"#0a0a0a" }}>
            Why businesses choose<br/>
            <span style={{ background:"linear-gradient(135deg,#25d366,#059669)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>WPLeads over the rest</span>
          </h2>
          <p style={{ fontSize:15, color:"rgba(0,0,0,0.5)", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
            No subscriptions. No bloated pricing. Just the most powerful WhatsApp automation — completely free.
          </p>
        </div>

        {/* Table */}
        <div style={{ background:"#fff", borderRadius:24, border:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 24px 60px rgba(0,0,0,0.08)", overflow:"hidden" }}>
          <div className="cmp-wrap">
            <table className="cmp-table">

              {/* ── HEADER ROW ── */}
              <thead>
                <tr>
                  {/* Feature label column */}
                  <th style={{ padding:"24px 24px 20px", textAlign:"left", background:"#f8fafc", borderBottom:"2px solid #f1f5f9", width:"22%", minWidth:160 }}>
                    <span style={{ fontSize:10, fontWeight:800, color:"#94a3b8", letterSpacing:2, textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>Feature</span>
                  </th>

                  {platforms.map(p => (
                    <th key={p.key} style={{ padding:"0", textAlign:"center", background: p.highlight ? "#0f172a" : "#f8fafc", borderBottom:`2px solid ${p.highlight ? "#25d366" : "#f1f5f9"}`, position:"relative" }}>
                      <div style={{ padding:"20px 16px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                        {/* YOU badge */}
                        {p.tag && (
                          <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", background:"#25d366", color:"#fff", fontSize:8, fontWeight:900, padding:"3px 10px", borderRadius:"0 0 8px 8px", letterSpacing:1.5 }}>
                            {p.tag}
                          </div>
                        )}
                        {/* Logo circle */}
                        <div style={{ width:40, height:40, borderRadius:12, background: p.highlight ? "rgba(37,211,102,0.15)" : "#fff", border:`1.5px solid ${p.highlight ? "rgba(37,211,102,0.4)" : "rgba(0,0,0,0.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color: p.highlight ? "#25d366" : "#64748b", boxShadow: p.highlight ? "0 4px 16px rgba(37,211,102,0.25)" : "none" }}>
                          {p.name[0]}
                        </div>
                        <span style={{ fontSize:13, fontWeight:900, color: p.highlight ? "#fff" : "#0a0a0a", letterSpacing:"-0.02em" }}>{p.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── BODY ROWS ── */}
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={row.feature}
                    onMouseEnter={() => setHoveredRow(ri)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ background: hoveredRow === ri ? "#fafbff" : ri % 2 === 0 ? "#fff" : "#fafafa", transition:"background 0.15s" }}
                  >
                    {/* Feature name */}
                    <td style={{ padding:"15px 24px", borderBottom:"1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <span style={{ fontSize:15 }}>{row.icon}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:"#0a0a0a" }}>{row.feature}</span>
                      </div>
                    </td>

                    {/* Values */}
                    {platforms.map(p => (
                      <td key={p.key} style={{
                        padding:"15px 12px",
                        textAlign:"center",
                        borderBottom:"1px solid rgba(0,0,0,0.05)",
                        background: p.highlight
                          ? hoveredRow === ri
                            ? "rgba(37,211,102,0.07)"
                            : "rgba(37,211,102,0.04)"
                          : "transparent",
                        borderLeft:  p.highlight ? "1px solid rgba(37,211,102,0.12)" : "none",
                        borderRight: p.highlight ? "1px solid rgba(37,211,102,0.12)" : "none",
                      }}>
                        <Cell d={row[p.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

              {/* ── FOOTER CTA ROW ── */}
              <tfoot>
                <tr>
                  <td style={{ padding:"20px 24px", background:"#f8fafc", borderTop:"2px solid #f1f5f9" }}>
                    <span style={{ fontSize:12, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>Get Started</span>
                  </td>
                  {platforms.map(p => (
                    <td key={p.key} style={{ padding:"16px 12px", textAlign:"center", background: p.highlight ? "#0f172a" : "#f8fafc", borderTop: `2px solid ${p.highlight ? "#25d366" : "#f1f5f9"}` }}>
                      {p.highlight ? (
                        <a href="/register" style={{ display:"inline-block", background:"linear-gradient(135deg,#25d366,#16a34a)", color:"#fff", fontSize:11.5, fontWeight:800, padding:"9px 18px", borderRadius:100, textDecoration:"none", boxShadow:"0 6px 18px rgba(37,211,102,0.35)", letterSpacing:0.3 }}>
                          Start Free →
                        </a>
                      ) : (
                        <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8" }}>Paid plan</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>

            </table>
          </div>
        </div>

        {/* Bottom win-chips */}
        <div style={{ marginTop:36, display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12 }}>
          {[
            { icon:"💸", text:"$0 Monthly Fee" },
            { icon:"⚡", text:"Instant Setup" },
            { icon:"🔀", text:"Advanced Automation" },
            { icon:"📤", text:"Bulk Cold Outreach" },
            { icon:"👥", text:"Built-in CRM" },
            { icon:"📊", text:"Full Analytics" },
          ].map(c => (
            <div key={c.text} style={{ display:"flex", alignItems:"center", gap:7, background:"#fff", border:"1px solid rgba(0,0,0,0.07)", borderRadius:100, padding:"8px 16px", fontSize:12.5, fontWeight:700, color:"#0a0a0a", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize:13 }}>{c.icon}</span>{c.text}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
