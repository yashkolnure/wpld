const channels = [
  {
    icon: "💬", label: "WHATSAPP SUPPORT", title: "Chat with Support",
    desc: "Get quick answers on WhatsApp. Best for platform questions, onboarding help, and account issues.",
    cta: "Open WhatsApp", href: "https://wa.me/917499835687?text=Hello!%20I%20need%20support%20with%20WPLeads.",
    ctaColor: "#25d366", ctaHover: "#1db954",
    badge: "Fastest response", badgeColor: "#16a34a", badgeBg: "#f0fdf4",
  },
  {
    icon: "📧", label: "EMAIL SUPPORT", title: "Email Us",
    desc: "For detailed queries, billing issues, data requests, or anything that requires a written record.",
    cta: "admin@avenirya.com", href: "mailto:admin@avenirya.com",
    ctaColor: "#0f172a", ctaHover: "#334155",
    badge: "Within 1 business day", badgeColor: "#2563eb", badgeBg: "#eff6ff",
  },
  {
    icon: "🚀", label: "BOOK A DEMO", title: "See WPLeads Live",
    desc: "Want to see the platform in action before committing? Message us to schedule a live walkthrough.",
    cta: "Request Demo", href: "https://wa.me/917498869327?text=Hi!%20I%20want%20to%20book%20a%20WPLeads%20demo.",
    ctaColor: "#7c3aed", ctaHover: "#6d28d9",
    badge: "Sales & partnerships", badgeColor: "#7c3aed", badgeBg: "#f5f3ff",
  },
];

const details = [
  { icon: "🏢", label: "Company",  value: "Avenirya Solutions OPC Pvt Ltd" },
  { icon: "📍", label: "Location", value: "Made in India 🇮🇳" },
  { icon: "📞", label: "Phone",    value: "+91 8767640530", href: "tel:+918767640530" },
  { icon: "📧", label: "Email",    value: "admin@avenirya.com", href: "mailto:admin@avenirya.com" },
];

export default function Contact() {
  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'DM Sans',sans-serif", color:"#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", padding:"clamp(120px,15vw,160px) clamp(20px,5vw,60px) 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto", animation:"wpl-fadeup 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:100, padding:"6px 14px", fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:1.4, color:"#16a34a", textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#25d366", animation:"wpl-ping 1.5s ease-in-out infinite" }} />
            CONTACT
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:20 }}>We're here to help</h1>
          <p style={{ fontSize:17, color:"rgba(0,0,0,0.55)", lineHeight:1.6 }}>
            Choose the channel that works best for you. We typically respond within one business day.
          </p>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section style={{ background:"#fff", padding:"80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, marginBottom:64 }}>
            {channels.map(ch => (
              <div key={ch.label} style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:24, padding:"32px 28px", background:"#fff", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:ch.badgeBg, borderRadius:100, padding:"4px 10px", fontSize:10, fontWeight:800, color:ch.badgeColor, letterSpacing:0.3, marginBottom:20, alignSelf:"flex-start" }}>{ch.badge}</div>
                <div style={{ fontSize:28, marginBottom:14 }}>{ch.icon}</div>
                <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8, fontFamily:"'DM Mono',monospace" }}>{ch.label}</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#0f172a", marginBottom:12, letterSpacing:"-0.02em" }}>{ch.title}</div>
                <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.7, margin:"0 0 28px", flexGrow:1 }}>{ch.desc}</p>
                <a href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noreferrer" : undefined}
                  style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", background:ch.ctaColor, color:"#fff", padding:"13px 24px", borderRadius:50, fontSize:13, fontWeight:700, textDecoration:"none", transition:"background 0.2s,transform 0.2s" }}
                  onMouseOver={e => { e.currentTarget.style.background=ch.ctaHover; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.background=ch.ctaColor; e.currentTarget.style.transform="translateY(0)"; }}
                >{ch.cta}</a>
              </div>
            ))}
          </div>

          {/* ── BUSINESS DETAILS ── */}
          <div style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:24, padding:"36px 40px", background:"#fafafa" }}>
            <div style={{ fontSize:11, fontWeight:900, color:"#94a3b8", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:24 }}>BUSINESS DETAILS</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
              {details.map(d => (
                <div key={d.label} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, border:"1px solid rgba(0,0,0,0.07)", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:800, color:"#94a3b8", letterSpacing:0.8, textTransform:"uppercase", marginBottom:3 }}>{d.label}</div>
                    {d.href ? (
                      <a href={d.href} style={{ fontSize:14, fontWeight:600, color:"#0f172a", textDecoration:"none" }}
                        onMouseOver={e => e.currentTarget.style.color="#25d366"}
                        onMouseOut={e => e.currentTarget.style.color="#0f172a"}
                      >{d.value}</a>
                    ) : (
                      <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{d.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
