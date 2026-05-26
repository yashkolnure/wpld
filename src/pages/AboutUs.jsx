import { Link } from "react-router-dom";

const stats = [
  { value: "99.9%",   label: "Uptime SLA" },
  { value: "24ms",    label: "API Latency" },
  { value: "AES-256", label: "Encryption Standard" },
  { value: "Mumbai",  label: "Server Region" },
];

const features = [
  { icon: "⚡", title: "Keyword Triggers",        desc: "Fire workflows instantly when users message a specific phrase. Supports exact match and contains logic." },
  { icon: "🎨", title: "Visual Flow Builder",     desc: "Build complex conversation trees without code using our drag-and-drop canvas." },
  { icon: "📢", title: "Broadcast Campaigns",     desc: "Send targeted messages to all your contacts or a filtered segment in a single click." },
  { icon: "📤", title: "Bulk Cold Outreach",      desc: "Upload a list of phone numbers and send approved WhatsApp templates at scale." },
  { icon: "👥", title: "Built-in CRM",            desc: "Every contact is automatically saved, tagged, and searchable. Manage your audience effortlessly." },
  { icon: "💰", title: "Wallet & Pay-per-Message",desc: "Recharge your wallet once and pay only for what you send. Full transaction history included." },
];

export default function AboutUs() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'DM Sans', sans-serif", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", padding:"clamp(120px,15vw,160px) clamp(20px,5vw,60px) 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:800, margin:"0 auto", animation:"wpl-fadeup 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:100, padding:"6px 14px", fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:1.4, color:"#16a34a", textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#25d366", animation:"wpl-ping 1.5s ease-in-out infinite" }} />
            ABOUT US
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,60px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:20 }}>
            Built to Automate the<br />
            <span style={{ background:"linear-gradient(135deg,#25d366 0%,#059669 60%,#16a34a 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Future of Customer Conversations
            </span>
          </h1>
          <p style={{ fontSize:17, color:"rgba(0,0,0,0.6)", lineHeight:1.6, maxWidth:560, margin:"0 auto 32px" }}>
            WPLeads is a WhatsApp Business automation platform built by{" "}
            <strong style={{ color:"#0f172a" }}>Avenirya Solutions OPC Pvt Ltd</strong>. We help businesses
            capture leads, automate customer responses, and run campaigns — all through WhatsApp, without code.
          </p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0f172a", color:"#fff", borderRadius:100, padding:"8px 20px", fontSize:12, fontWeight:800, letterSpacing:0.3 }}>
            🤝 Official Meta Technology Partner
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:"#fff", padding:"64px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign:"center", padding:"36px 20px", border:"1px solid rgba(0,0,0,0.07)", borderRadius:20, background:"#fafafa" }}>
              <div style={{ fontSize:30, fontWeight:900, color:"#0f172a", letterSpacing:"-0.04em", marginBottom:8 }}>{s.value}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLACEHOLDER: OUR STORY ── */}
      <section style={{ background:"#fff", padding:"0 clamp(20px,5vw,60px) 64px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ border:"2px dashed #e2e8f0", borderRadius:20, padding:"48px 40px", textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>PLACEHOLDER — OUR STORY</div>
            <p style={{ fontSize:15, color:"#94a3b8", lineHeight:1.7, maxWidth:560, margin:"0 auto" }}>
              Add your founding story here — why WPLeads was built, the problem it solves, and the journey from idea to platform. Include the founding year, inspiration, and vision.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BUILD ── */}
      <section style={{ background:"#fafafa", padding:"80px clamp(20px,5vw,60px)", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#25d366", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>WHAT WE BUILD</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)", fontWeight:900, color:"#0a0a0a", letterSpacing:"-0.03em", lineHeight:1.15 }}>
              Everything you need to automate WhatsApp
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
            {features.map(f => (
              <div key={f.title}
                style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.07)", borderRadius:20, padding:"28px 24px", transition:"box-shadow 0.2s,transform 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.boxShadow="0 8px 24px -8px rgba(0,0,0,0.1)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"#64748b", lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLACEHOLDER: TEAM ── */}
      <section style={{ background:"#fff", padding:"80px clamp(20px,5vw,60px)", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ border:"2px dashed #e2e8f0", borderRadius:20, padding:"48px 40px", textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>PLACEHOLDER — OUR TEAM</div>
            <p style={{ fontSize:15, color:"#94a3b8", lineHeight:1.7, maxWidth:560, margin:"0 auto" }}>
              Add team member profiles here — photos, names, titles, and brief bios. Founder: Yash Kolnure. Include any additional team members you'd like to feature.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section style={{ background:"#0f172a", padding:"80px clamp(20px,5vw,60px)", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", marginBottom:14 }}>
            Get in touch
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:40 }}>
            Have questions about WPLeads? We're happy to help.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            <a href="mailto:admin@avenirya.com"
              style={{ background:"#25d366", color:"#fff", padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:700, textDecoration:"none", transition:"background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background="#1db954"}
              onMouseOut={e => e.currentTarget.style.background="#25d366"}
            >admin@avenirya.com</a>
            <a href="tel:+918767640530"
              style={{ background:"rgba(255,255,255,0.08)", color:"#fff", padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:700, textDecoration:"none", border:"1px solid rgba(255,255,255,0.18)", transition:"background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,0.14)"}
              onMouseOut={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            >+91 8767640530</a>
          </div>
        </div>
      </section>
    </div>
  );
}
