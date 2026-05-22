import React from "react";

const platforms = [
  {
    key: "wpleads",
    name: "WPLeads",
    logo: "https://i.ibb.co/8L4h1sM3/image.jpg",
    highlight: true,
  },
  {
    key: "wati",
    name: "WATI",
    logo: "https://www.wati.io/wp-content/uploads/2023/03/wati-logo-1.svg",
    highlight: false,
  },
  {
    key: "doubletick",
    name: "DoubleTick",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0PaS9SIiB23Kt37rwQ79udcdh9za01xVj0g&s",
    highlight: false,
  },
  {
    key: "gallabox",
    name: "Gallabox",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUm0W892SHxtZ143ZRJ5Flyfyx-2pBjYpfJg&s",
    highlight: false,
  },
  {
    key: "aisensy",
    name: "AiSensy",
    logo: "https://cdn-b.saashub.com/images/app/service_logos/210/ad85jji7yu8k/large.png?1651288093",
    highlight: false,
  },
];

const rows = [
  {
    feature: "Monthly Platform Fee",
    wpleads:    { val: "FREE",       type: "good" },
    wati:       { val: "$99/month",  type: "bad"  },
    doubletick: { val: "$42/month",  type: "bad"  },
    gallabox:   { val: "$58/month",  type: "bad"  },
    aisensy:    { val: "$20/month",  type: "bad"  },
  },
  {
    feature: "Markup on Meta Charges",
    wpleads:    { val: "25%",  type: "neutral" },
    wati:       { val: "35%",  type: "bad"     },
    doubletick: { val: "20%",  type: "neutral" },
    gallabox:   { val: "35%",  type: "bad"     },
    aisensy:    { val: "25%",  type: "neutral" },
  },
  {
    feature: "Pay Only When You Use",
    wpleads:    { val: "Yes", type: "good" },
    wati:       { val: "No",  type: "bad"  },
    doubletick: { val: "No",  type: "bad"  },
    gallabox:   { val: "No",  type: "bad"  },
    aisensy:    { val: "No",  type: "bad"  },
  },
  {
    feature: "Bulk Cold Outreach",
    wpleads:    { val: "Included", type: "good"    },
    wati:       { val: "Limited",  type: "neutral" },
    doubletick: { val: "Limited",  type: "neutral" },
    gallabox:   { val: "Limited",  type: "neutral" },
    aisensy:    { val: "Limited",  type: "neutral" },
  },
  {
    feature: "Workflow Builder",
    wpleads:    { val: "Advanced", type: "good"    },
    wati:       { val: "Basic",    type: "neutral" },
    doubletick: { val: "Limited",  type: "bad"     },
    gallabox:   { val: "Basic",    type: "neutral" },
    aisensy:    { val: "Basic",    type: "neutral" },
  },
  {
    feature: "Broadcast Campaigns",
    wpleads:    { val: "Unlimited", type: "good"    },
    wati:       { val: "Yes",       type: "neutral" },
    doubletick: { val: "Yes",       type: "neutral" },
    gallabox:   { val: "Yes",       type: "neutral" },
    aisensy:    { val: "Yes",       type: "neutral" },
  },
  {
    feature: "Built-in CRM",
    wpleads:    { val: "Included", type: "good"    },
    wati:       { val: "Basic",    type: "neutral" },
    doubletick: { val: "Basic",    type: "neutral" },
    gallabox:   { val: "Basic",    type: "neutral" },
    aisensy:    { val: "Basic",    type: "neutral" },
  },
];

const Check = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 5.5l3.5 3.5L13 1" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 1l9 9M10 1L1 10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Dash = () => (
  <svg width="12" height="3" viewBox="0 0 12 3" fill="none" style={{ flexShrink: 0 }}>
    <rect width="12" height="3" rx="1.5" fill="#94a3b8" />
  </svg>
);

const Cell = ({ d, highlight }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'DM Sans',system-ui,sans-serif",
    whiteSpace: "nowrap",
  };
  if (d.type === "good")    return <span style={{ ...base, color: "#16a34a" }}><Check />{d.val}</span>;
  if (d.type === "bad")     return <span style={{ ...base, color: "rgba(0,0,0,0.38)" }}><Cross />{d.val}</span>;
  return <span style={{ ...base, color: "rgba(0,0,0,0.5)" }}><Dash />{d.val}</span>;
};

export default function PricingComparisonSection() {
  return (
    <section style={{
        paddingTop: "clamp(60px,8vw,100px)",
      fontFamily: "'DM Sans','Sora',system-ui,sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@500;600&display=swap');
        
        /* Scrollable wrapper on mobile */
        .pc-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 24px; border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 20px 56px rgba(0,0,0,0.07); }
        .pc-table  { width: 100%; min-width: 780px; border-collapse: collapse; background: #fff; border-radius: 24px; overflow: hidden; }

        /* Sticky first column on all screens */
        .pc-feat { position: sticky; left: 0; z-index: 3; }
      `}</style>

      {/* Soft glow */}
      <div style={{ position:"absolute", top:-140, right:-140, width:420, height:420, borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.2)", borderRadius:100, padding:"5px 14px", fontSize:10.5, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:2, color:"#16a34a", textTransform:"uppercase", marginBottom:16 }}>
            Pricing Comparison
          </div>
          <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.08, marginBottom:12, color:"#0a0a0a" }}>
            Stop Paying High<br />
            <span style={{ background:"linear-gradient(135deg,#25d366,#059669)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              WhatsApp Platform Fees
            </span>
          </h2>
          <p style={{ fontSize:16, color:"rgba(0,0,0,0.5)", maxWidth:540, margin:"0 auto", lineHeight:1.7 }}>
            Compare monthly subscriptions, markup fees, and automation features before choosing your platform.
          </p>
        </div>

        {/* Table */}
        <div className="pc-scroll">
          <table className="pc-table">
            <thead>
              <tr>
                {/* Feature column header */}
                <th className="pc-feat" style={{ padding:"20px 24px", textAlign:"left", background:"#f8fafc", borderBottom:"1px solid rgba(0,0,0,0.07)", fontSize:10.5, fontWeight:700, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'DM Mono',monospace", minWidth:190 }}>
                  Features
                </th>

                {platforms.map(p => (
                  <th key={p.key} className={p.highlight ? "pc-th-hl" : ""} style={{ padding:"0", textAlign:"center", background: p.highlight ? undefined : "#f8fafc", borderBottom:"1px solid rgba(0,0,0,0.07)", minWidth:142, verticalAlign:"bottom" }}>
                    <div style={{ padding: p.highlight ? "22px 16px 18px" : "16px 16px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:10, position:"relative" }}>

               

                      {/* Logo */}
                      <div style={{ width:44, height:44, borderRadius:12, overflow:"hidden", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow: p.highlight ? "0 4px 14px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.1)", flexShrink:0 }}>
                        <img
                          src={p.logo}
                          alt={p.name}
                          style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }}
                          onError={e => { e.currentTarget.style.display="none"; e.currentTarget.parentNode.innerHTML = `<span style="font-size:13px;font-weight:900;color:${p.highlight?"#64748b":"#64748b"}">${p.name[0]}</span>`; }}
                        />
                      </div>

                      <span style={{ fontSize:14, fontWeight:900, letterSpacing:"-0.02em", color: p.highlight ? "#0a0a0a" : "#0a0a0a", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                        {p.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.feature} className="pc-tr" style={{ background: ri % 2 === 0 ? "#fff" : "rgba(248,250,252,0.55)" }}>

                  {/* Feature name */}
                  <td className="pc-feat" style={{ padding:"16px 24px", borderBottom:"1px solid rgba(0,0,0,0.04)", background: ri % 2 === 0 ? "#fff" : "rgba(248,250,252,0.98)", fontSize:14, fontWeight:700, color:"#0a0a0a" }}>
                    {row.feature}
                  </td>

                  {platforms.map(p => (
                    <td key={p.key} style={{ padding:"16px 12px", textAlign:"center", borderBottom:"1px solid rgba(0,0,0,0.04)", background: p.highlight ? "rgba(37,211,102,0.04)" : "transparent", borderLeft: p.highlight ? "1px solid rgba(37,211,102,0.1)" : "none", borderRight: p.highlight ? "1px solid rgba(37,211,102,0.1)" : "none" }}>
                      <Cell d={row[p.key]} highlight={p.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom pills */}
        <div style={{ marginTop:32, display:"flex", flexWrap:"wrap", justifyContent:"center", gap:10 }}>
          {["No Monthly Fees","Advanced Automation","Bulk Outreach","Built-in CRM"].map(label => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7, background:"#fff", border:"1px solid rgba(0,0,0,0.07)", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, color:"#0a0a0a", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ color:"#16a34a", fontSize:11 }}>✓</span>
              {label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}