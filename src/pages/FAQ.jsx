import { useState } from "react";

const faqs = [
  {
    q: "What is WPLeads?",
    a: "WPLeads is a WhatsApp Business automation platform developed by Avenirya Solutions OPC Pvt Ltd. It lets businesses build automated conversation flows, capture leads, run broadcast campaigns, send bulk outreach, and manage contacts — all through WhatsApp, without writing a single line of code. WPLeads is an Official Meta Technology Partner.",
  },
  {
    q: "How do I get started with WPLeads?",
    a: "Create a free account on WPLeads, then go to the WhatsApp API section in your dashboard. Paste your Meta credentials (Phone Number ID, WhatsApp Business Account ID, and API Access Token), register our webhook URL in the Meta Developer Portal, and your account is live. The entire setup takes under 5 minutes.",
  },
  {
    q: "What do I need to connect WhatsApp?",
    a: "You need a WhatsApp Business API account set up through Meta. From there, you'll have a Phone Number ID, a WhatsApp Business Account (WABA) ID, and a Permanent Access Token. These are pasted into WPLeads during onboarding. WPLeads acts as the automation and management layer on top of your existing Meta API access.",
  },
  {
    q: "How does the visual workflow builder work?",
    a: "The drag-and-drop canvas lets you place message nodes, button nodes, delay nodes, and trigger nodes, then connect them to design a full conversation path. When a user messages your WhatsApp number and matches a configured trigger, the bot follows your flow automatically — no code required.",
  },
  {
    q: "What are keyword triggers?",
    a: "Keyword triggers activate a specific workflow when an incoming message matches a phrase you define. You can configure exact match (the message must be exactly your keyword) or 'contains' match (your keyword appears anywhere in the message). For example, if someone types 'price', your pricing flow starts immediately.",
  },
  {
    q: "How do broadcast campaigns work?",
    a: "Broadcast lets you send a pre-approved WhatsApp message template to all your contacts, or a filtered segment, at once. You choose your template, select your audience, and send. Broadcast messages are charged at a 25% markup on Meta's standard per-message rate, deducted from your WPLeads wallet.",
  },
  {
    q: "What is bulk cold outreach?",
    a: "Bulk cold outreach lets you upload a CSV file with phone numbers and send an approved WhatsApp template to all of them at scale. This is ideal for reaching new prospects or running marketing campaigns. You must use a Meta-approved message template — unapproved templates cannot be used for bulk outreach.",
  },
  {
    q: "How does the wallet and billing work?",
    a: "WPLeads uses a pay-per-message wallet model. You top up your wallet using Razorpay (supports UPI, credit/debit cards, and net banking). Messages are deducted from your balance as they are sent. The Pro plan has no monthly message cap — you only pay for what you actually send. Full transaction history is available in the Wallet section of your dashboard.",
  },
  {
    q: "What pricing plans are available?",
    a: "WPLeads offers three plans — Starter (Free): 1 active workflow, 1,000 messages/month, community support. Pro (Free, limited period): 2 workflows, unlimited messages, bulk cold outreach, broadcasts, template management, built-in CRM, and analytics. Enterprise (Custom pricing): unlimited workflows, unlimited WhatsApp numbers, dedicated instance, custom APIs, SLA guarantee, and a personal account manager.",
  },
  {
    q: "How do I create and manage message templates?",
    a: "The Template Management section in your WPLeads dashboard lets you create, edit, submit for Meta approval, and track the approval status of your WhatsApp message templates — without logging into the Meta Business Portal separately. Approved templates can then be used in broadcast campaigns and bulk outreach.",
  },
  {
    q: "Is my data and WhatsApp credentials secure?",
    a: "Yes. Your WhatsApp API credentials (Phone Number ID, WABA ID, and Access Token) are stored using AES-256 encryption. Authentication is handled via JWT tokens. Our servers run in Mumbai, India (WPL-EDGE — Cluster 01) with 24ms average API latency. We do not sell or share your data with third parties for marketing purposes.",
  },
  {
    q: "How do I reach support?",
    a: "You can email us at admin@avenirya.com or WhatsApp us directly at +91 7499835687. Our team typically responds within one business day. You can also use the floating WhatsApp widget on our website to start a conversation instantly.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'DM Sans',sans-serif", color:"#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes faq-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", padding:"clamp(120px,15vw,160px) clamp(20px,5vw,60px) 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto", animation:"wpl-fadeup 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:100, padding:"6px 14px", fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:1.4, color:"#16a34a", textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#25d366", animation:"wpl-ping 1.5s ease-in-out infinite" }} />
            FAQ
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:20 }}>
            Frequently Asked<br />Questions
          </h1>
          <p style={{ fontSize:17, color:"rgba(0,0,0,0.55)", lineHeight:1.6 }}>
            Everything you need to know about WPLeads. Can't find your answer?{" "}
            <a href="mailto:admin@avenirya.com" style={{ color:"#25d366", fontWeight:700, textDecoration:"none" }}>Get in touch.</a>
          </p>
        </div>
      </section>

      {/* ── ACCORDION ── */}
      <section style={{ background:"#fff", padding:"80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ borderBottom:"1px solid rgba(0,0,0,0.07)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width:"100%", textAlign:"left", background:"none", border:"none", padding:"24px 0", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:20, fontFamily:"'DM Sans',sans-serif" }}
              >
                <span style={{ fontSize:16, fontWeight:700, color: open === i ? "#0f172a" : "#1e293b", lineHeight:1.4, transition:"color 0.15s" }}>{item.q}</span>
                <span style={{ width:28, height:28, borderRadius:"50%", border:"1.5px solid rgba(0,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background: open === i ? "#0f172a" : "#fff", color: open === i ? "#fff" : "#64748b", fontSize:18, lineHeight:1, transition:"background 0.2s,color 0.2s" }}>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div style={{ paddingBottom:24, animation:"faq-open 0.2s ease both" }}>
                  <p style={{ fontSize:15, color:"#4b5563", lineHeight:1.75, margin:0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"#0f172a", padding:"80px clamp(20px,5vw,60px)", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", marginBottom:14 }}>Still have questions?</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:36 }}>Our team is happy to help. Reach out on WhatsApp or by email.</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            <a href="https://wa.me/917499835687" target="_blank" rel="noreferrer"
              style={{ background:"#25d366", color:"#fff", padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:700, textDecoration:"none", transition:"background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background="#1db954"}
              onMouseOut={e => e.currentTarget.style.background="#25d366"}
            >WhatsApp Us</a>
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
