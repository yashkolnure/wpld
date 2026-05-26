import { useState } from "react";

const categories = [
  {
    icon: "🚀", title: "Getting Started", color: "#16a34a", bg: "#f0fdf4",
    items: [
      { q: "How do I create my WPLeads account?", a: "Visit wpleads.in and click 'Get Started'. You can sign up using your business email and password, or continue with Google. Once registered, you will land directly in your dashboard." },
      { q: "How do I connect my WhatsApp Business account?", a: "In your dashboard, go to the WhatsApp API section. Paste your Phone Number ID, WhatsApp Business Account (WABA) ID, and your Permanent Access Token from the Meta Developer Portal. Click Connect — your number will be live in seconds." },
      { q: "How do I register the webhook in Meta?", a: "After connecting your credentials, go to WhatsApp API → Webhook Info in your dashboard to copy your unique webhook URL and verify token. Paste these into the Webhook Configuration section in the Meta Developer Portal. This step is done only once." },
      { q: "How long does the full setup take?", a: "End-to-end setup — from account creation to your first live workflow — takes under 5 minutes if you already have your Meta API credentials ready." },
    ],
  },
  {
    icon: "🎨", title: "Workflow Builder", color: "#2563eb", bg: "#eff6ff",
    items: [
      { q: "How do I create a new workflow?", a: "From your dashboard, click 'Workflows' in the sidebar, then 'New Workflow'. This opens the visual builder canvas. Drag nodes from the panel onto the canvas and connect them to design your conversation flow. Hit Save to publish." },
      { q: "What is a keyword trigger?", a: "A keyword trigger is the entry point of a workflow. When an incoming WhatsApp message matches your keyword (exact match or 'contains' match), the workflow fires automatically. You can configure multiple triggers per workflow." },
      { q: "What node types are available in the builder?", a: "The canvas supports message nodes (send text, images, or media), button nodes (interactive reply buttons), delay nodes (pause between steps), and trigger nodes (keyword-based start conditions). Connect them in any order to design dynamic conversation paths." },
      { q: "How do I activate or pause a workflow?", a: "From the Workflows list in your dashboard, use the toggle switch next to any workflow to activate or pause it instantly. Paused workflows stop executing new conversations but retain all their configuration." },
    ],
  },
  {
    icon: "📢", title: "Broadcast & Campaigns", color: "#0891b2", bg: "#ecfeff",
    items: [
      { q: "How do I send a broadcast message?", a: "Go to Broadcast in your dashboard. Select an approved WhatsApp message template, choose your target audience (all contacts or a tag-filtered group), and click Send. Credits are deducted from your wallet based on the number of recipients." },
      { q: "What is bulk cold outreach?", a: "Bulk cold outreach lets you upload a CSV of phone numbers and send an approved template to all of them at scale. Go to Cold Outreach in your dashboard, upload your file, select a template, and launch the campaign." },
      { q: "Why can I only use approved templates for broadcasts?", a: "Meta's WhatsApp Business Policy requires that messages to contacts outside an active 24-hour conversation window must use pre-approved templates. This is a Meta requirement that applies to all WhatsApp Business API providers." },
      { q: "How do I check broadcast delivery status?", a: "Open any campaign from the Broadcast section. The campaign detail view shows sent, delivered, and read counts for every recipient in that campaign." },
    ],
  },
  {
    icon: "📋", title: "Templates", color: "#7c3aed", bg: "#f5f3ff",
    items: [
      { q: "How do I create a new message template?", a: "Go to Templates in your dashboard and click 'New Template'. Add a template name, select a category (Marketing, Utility, or Authentication), write your message body, and submit. Meta typically reviews templates within minutes to a few hours." },
      { q: "How do I sync my existing Meta templates?", a: "If you already have approved templates in your Meta Business account, click 'Sync Templates' in the Templates section. WPLeads will import all your Meta-approved templates and make them available for broadcasts and outreach." },
      { q: "Why was my template rejected?", a: "Meta rejects templates that contain prohibited content, misleading claims, policy violations, or overly promotional language in Utility categories. Review Meta's template guidelines, revise your message to be clear and specific, then resubmit." },
    ],
  },
  {
    icon: "👥", title: "Contacts & CRM", color: "#db2777", bg: "#fdf2f8",
    items: [
      { q: "How are contacts added to the CRM?", a: "Contacts are added automatically when someone messages your WhatsApp number for the first time. Their phone number, name (if available), and conversation history are stored. You can also manage and tag contacts manually from the Contacts section." },
      { q: "How do I filter contacts by tag?", a: "In the Contacts section, use the filter panel to select one or more tags. Tags can be applied manually or assigned through workflow logic. Tagged groups can also be used as the target audience for broadcast campaigns." },
      { q: "Can I export my contact list?", a: "Yes. In the Contacts section, click 'Export' to download your full contact list. The export includes phone numbers, names, applied tags, and last message timestamps." },
    ],
  },
  {
    icon: "💰", title: "Wallet & Billing", color: "#d97706", bg: "#fffbeb",
    items: [
      { q: "How do I add credits to my wallet?", a: "Go to Wallet in your dashboard and click 'Recharge'. Enter the amount and complete the payment via Razorpay, which supports UPI, credit/debit cards, and net banking. Credits are added to your wallet instantly after a successful payment." },
      { q: "How are message credits deducted?", a: "Broadcast and bulk outreach messages are charged at a 25% markup on Meta's standard per-message rate. The exact cost depends on the recipient's country and message category as defined by Meta's pricing." },
      { q: "My wallet was not credited after payment. What should I do?", a: "Note your Razorpay transaction reference ID and email admin@avenirya.com. Our team will verify the payment and manually credit your wallet if the transaction is confirmed." },
      { q: "Where can I see my transaction history?", a: "Your full wallet transaction history — including all top-ups, message deductions, and timestamps — is available in the Wallet section of your dashboard." },
    ],
  },
];

export default function HelpCenter() {
  const [openSection, setOpenSection] = useState(null);
  const [openItem,    setOpenItem]    = useState(null);

  const toggleSection = (si) => { setOpenSection(openSection === si ? null : si); setOpenItem(null); };
  const toggleItem    = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'DM Sans',sans-serif", color:"#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hc-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", padding:"clamp(120px,15vw,160px) clamp(20px,5vw,60px) 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto", animation:"wpl-fadeup 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:100, padding:"6px 14px", fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:1.4, color:"#16a34a", textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#25d366", animation:"wpl-ping 1.5s ease-in-out infinite" }} />
            SUPPORT
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:20 }}>Help Center</h1>
          <p style={{ fontSize:17, color:"rgba(0,0,0,0.55)", lineHeight:1.6 }}>
            Guides and answers for every part of WPLeads. Can't find what you need?{" "}
            <a href="mailto:admin@avenirya.com" style={{ color:"#25d366", fontWeight:700, textDecoration:"none" }}>Contact us.</a>
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background:"#fff", padding:"80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>

          {/* Category grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, marginBottom:56 }}>
            {categories.map((cat, si) => (
              <button key={cat.title} onClick={() => toggleSection(si)}
                style={{ textAlign:"left", background: openSection === si ? cat.bg : "#fafafa", border: openSection === si ? `1.5px solid ${cat.color}30` : "1px solid rgba(0,0,0,0.07)", borderRadius:20, padding:"24px", cursor:"pointer", transition:"background 0.2s,border 0.2s,box-shadow 0.2s", fontFamily:"'DM Sans',sans-serif" }}
                onMouseOver={e => { if (openSection !== si) e.currentTarget.style.boxShadow="0 6px 18px -6px rgba(0,0,0,0.1)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow="none"; }}
              >
                <div style={{ fontSize:26, marginBottom:12 }}>{cat.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{cat.title}</div>
                <div style={{ fontSize:12, color:"#64748b", fontWeight:500 }}>{cat.items.length} articles</div>
                <div style={{ marginTop:14, fontSize:11, fontWeight:800, color:cat.color, letterSpacing:0.3 }}>
                  {openSection === si ? "▲ COLLAPSE" : "▼ EXPAND"}
                </div>
              </button>
            ))}
          </div>

          {/* Expanded accordion */}
          {openSection !== null && (
            <div style={{ animation:"hc-open 0.2s ease both" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
                <span style={{ fontSize:22 }}>{categories[openSection].icon}</span>
                <h2 style={{ fontSize:22, fontWeight:900, color:"#0f172a", margin:0, letterSpacing:"-0.02em" }}>{categories[openSection].title}</h2>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0, border:"1px solid rgba(0,0,0,0.07)", borderRadius:20, overflow:"hidden" }}>
                {categories[openSection].items.map((item, ii) => {
                  const key = `${openSection}-${ii}`;
                  return (
                    <div key={ii} style={{ borderBottom: ii < categories[openSection].items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <button onClick={() => toggleItem(key)}
                        style={{ width:"100%", textAlign:"left", background: openItem === key ? "#fafafa" : "#fff", border:"none", padding:"20px 24px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, fontFamily:"'DM Sans',sans-serif", transition:"background 0.15s" }}
                      >
                        <span style={{ fontSize:15, fontWeight:700, color:"#0f172a", lineHeight:1.4 }}>{item.q}</span>
                        <span style={{ width:24, height:24, borderRadius:"50%", border:"1.5px solid rgba(0,0,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background: openItem === key ? "#0f172a" : "#fff", color: openItem === key ? "#fff" : "#64748b", fontSize:16, transition:"background 0.2s,color 0.2s" }}>
                          {openItem === key ? "−" : "+"}
                        </span>
                      </button>
                      {openItem === key && (
                        <div style={{ padding:"0 24px 20px", animation:"hc-open 0.18s ease both" }}>
                          <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.75, margin:0 }}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"#0f172a", padding:"80px clamp(20px,5vw,60px)", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", marginBottom:14 }}>Still need help?</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:36 }}>Our team responds within one business day.</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            <a href="https://wa.me/917499835687" target="_blank" rel="noreferrer"
              style={{ background:"#25d366", color:"#fff", padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:700, textDecoration:"none", transition:"background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background="#1db954"}
              onMouseOut={e => e.currentTarget.style.background="#25d366"}
            >WhatsApp Support</a>
            <a href="mailto:admin@avenirya.com"
              style={{ background:"rgba(255,255,255,0.08)", color:"#fff", padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:700, textDecoration:"none", border:"1px solid rgba(255,255,255,0.18)", transition:"background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,0.14)"}
              onMouseOut={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            >admin@avenirya.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
