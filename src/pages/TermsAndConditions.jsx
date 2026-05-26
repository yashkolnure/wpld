const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;}
  @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
`;

const sections = [
  {
    n: "01", title: "Acceptance of Terms",
    content: `By accessing or using the WPLeads platform at wpleads.in, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, you must not register or use the platform. These Terms constitute a legally binding agreement between you and Avenirya Solutions OPC Pvt Ltd, the operator of WPLeads.`,
  },
  {
    n: "02", title: "About WPLeads",
    content: `WPLeads is a WhatsApp Business automation platform that enables businesses to build automated conversation flows, manage contacts and leads, run broadcast campaigns, send bulk outreach messages, and manage WhatsApp message templates — all through the official Meta WhatsApp Business API. WPLeads is developed and operated by Avenirya Solutions OPC Pvt Ltd, an Official Meta Technology Partner.`,
  },
  {
    n: "03", title: "Account Registration & Responsibility",
    list: [
      { heading: "Accurate Information", text: "You must provide accurate, complete, and up-to-date information when registering. Providing false information may result in immediate account termination." },
      { heading: "Account Security", text: "You are solely responsible for maintaining the confidentiality of your login credentials. Do not share your password or API credentials with unauthorized parties." },
      { heading: "Age Requirement", text: "You must be at least 18 years of age to create a WPLeads account. Business accounts must be operated by an authorized representative." },
      { heading: "Account Responsibility", text: "You are responsible for all activity that occurs under your account, including automated messages sent through your connected WhatsApp number." },
    ],
  },
  {
    n: "04", title: "Permitted Use",
    content: `WPLeads may only be used for lawful business communication purposes. You must have prior consent from, or an existing business relationship with, the contacts you message through the platform. All automation flows, broadcast campaigns, and outreach messages must comply with WhatsApp's Business Policy, Meta's Platform Terms, and applicable local laws including Indian IT and telecommunications regulations.`,
  },
  {
    n: "05", title: "Prohibited Activities",
    list: [
      { heading: "Spam & Unsolicited Messaging", text: "You must not use WPLeads to send spam, unsolicited marketing messages, or bulk messages to users who have not opted in or with whom you have no existing business relationship." },
      { heading: "Illegal Content", text: "You must not send, distribute, or automate delivery of content that is illegal, defamatory, obscene, fraudulent, or violates any third-party rights." },
      { heading: "Phishing & Fraud", text: "You must not use WPLeads to impersonate any person or entity, conduct phishing attempts, or engage in any form of financial fraud." },
      { heading: "Policy Violations", text: "You must not violate WhatsApp's Commerce Policy, Business Policy, or Meta's Platform Terms through the use of WPLeads." },
      { heading: "Reverse Engineering", text: "You must not attempt to reverse-engineer, copy, decompile, or create derivative works of the WPLeads platform." },
      { heading: "Credential Sharing", text: "You must not share your WhatsApp API credentials or WPLeads account access with unauthorized third parties." },
    ],
  },
  {
    n: "06", title: "WhatsApp & Meta Platform Compliance",
    content: `You are solely responsible for ensuring that your use of WhatsApp through WPLeads complies at all times with Meta's Platform Terms and WhatsApp's Business Policy. WPLeads provides the tooling and infrastructure for automation; the content of your messages and the management of your audience consent are entirely your responsibility. WPLeads is not liable for WhatsApp account restrictions, quality rating penalties, or account bans resulting from policy violations by you.`,
  },
  {
    n: "07", title: "Wallet, Payments & Billing",
    list: [
      { heading: "Wallet Top-Ups", text: "Wallet credits are added via Razorpay using UPI, credit/debit cards, or net banking. Credits are denominated in Indian Rupees (INR) unless otherwise specified." },
      { heading: "Pay-Per-Message Model", text: "Broadcast and bulk outreach messages are charged at a 25% markup on Meta's standard per-message rate, deducted from your wallet balance." },
      { heading: "Non-Refundable Credits", text: "Wallet credits are non-refundable once consumed for message delivery. Unused credits may be considered for refund at our discretion — contact admin@avenirya.com for queries." },
      { heading: "Pricing Changes", text: "WPLeads reserves the right to adjust platform pricing or markup rates with reasonable prior notice to registered users." },
      { heading: "Failed Transactions", text: "If a payment is debited from your payment method but your wallet is not credited, contact admin@avenirya.com with your Razorpay transaction reference ID for resolution." },
    ],
  },
  {
    n: "08", title: "Intellectual Property",
    content: `WPLeads, its visual design, source code, workflow engine, and all associated product content are the exclusive intellectual property of Avenirya Solutions OPC Pvt Ltd. All rights are reserved. You retain full ownership of the content you create using WPLeads — your workflows, message templates, contact data, and broadcast configurations. By using WPLeads, you grant Avenirya Solutions OPC Pvt Ltd a limited, non-exclusive license to process your content solely to operate and deliver the platform services.`,
  },
  {
    n: "09", title: "Service Availability & Modifications",
    content: `WPLeads targets 99.9% platform uptime but does not guarantee uninterrupted or error-free service. Scheduled maintenance and emergency updates may cause temporary downtime. We are not liable for service interruptions caused by Meta's WhatsApp Business API, Razorpay, or any other third-party dependency. We reserve the right to modify, update, or discontinue platform features at any time, with reasonable notice provided for material changes.`,
  },
  {
    n: "10", title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, Avenirya Solutions OPC Pvt Ltd's total liability to you for any claim arising from or related to your use of WPLeads shall not exceed the amount you paid to WPLeads in the thirty (30) days preceding the claim. We are not liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, data loss, or business interruption, regardless of whether we were advised of the possibility of such damages.`,
  },
  {
    n: "11", title: "Account Suspension & Termination",
    content: `You may delete your WPLeads account at any time from the platform. We reserve the right to suspend or permanently terminate any account that violates these Terms, engages in abuse of the platform, or poses a risk to other users or to Meta's infrastructure. Upon termination, your workflows and configuration data may be retained for up to 30 days for audit purposes, after which it will be permanently deleted. Wallet credit balances at the time of suspension due to policy violations are forfeited.`,
  },
  {
    n: "12", title: "Governing Law & Dispute Resolution",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms or your use of WPLeads shall be subject to the exclusive jurisdiction of the competent courts located in India. We encourage you to contact us at admin@avenirya.com to attempt resolution before initiating formal proceedings.`,
  },
  {
    n: "13", title: "Contact Us",
    content: `For questions about these Terms, account issues, billing disputes, or any other matter, please contact:\n\nAvenirya Solutions OPC Pvt Ltd\nEmail: admin@avenirya.com\nPhone: +91 8767640530\nWebsite: avenirya.com`,
  },
];

function SectionCard({ sec }) {
  return (
    <div style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:20, padding:"32px 36px", background:"#fff" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:20, marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", fontFamily:"'DM Mono',monospace", letterSpacing:1, paddingTop:4, flexShrink:0 }}>{sec.n}</div>
        <h2 style={{ fontSize:18, fontWeight:800, color:"#0f172a", margin:0, lineHeight:1.3 }}>{sec.title}</h2>
      </div>
      {sec.content && (
        <div style={{ paddingLeft:30 }}>
          {sec.content.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize:15, color:"#374151", lineHeight:1.75, margin: i > 0 ? "12px 0 0" : 0 }}>{para}</p>
          ))}
        </div>
      )}
      {sec.list && (
        <div style={{ paddingLeft:30, display:"flex", flexDirection:"column", gap:16 }}>
          {sec.list.map(item => (
            <div key={item.heading} style={{ paddingLeft:16, borderLeft:"2px solid rgba(37,211,102,0.4)" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{item.heading}</div>
              <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.7, margin:0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TermsAndConditions() {
  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'DM Sans',sans-serif", color:"#111" }}>
      <style>{SHARED_STYLE}</style>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", padding:"clamp(120px,15vw,160px) clamp(20px,5vw,60px) 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto", animation:"wpl-fadeup 0.7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.25)", borderRadius:100, padding:"6px 14px", fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:1.4, color:"#16a34a", textTransform:"uppercase", marginBottom:24 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#25d366", animation:"wpl-ping 1.5s ease-in-out infinite" }} />
            LEGAL
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:18 }}>Terms &amp; Conditions</h1>
          <p style={{ fontSize:16, color:"rgba(0,0,0,0.55)", lineHeight:1.6, marginBottom:20 }}>Please read these Terms carefully before using WPLeads.</p>
          <div style={{ display:"inline-block", fontSize:12, fontWeight:700, color:"#64748b", fontFamily:"'DM Mono',monospace" }}>Last updated: May 2026</div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ background:"#fff", padding:"80px clamp(20px,5vw,60px) 100px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", flexDirection:"column", gap:24 }}>
          {sections.map(sec => <SectionCard key={sec.n} sec={sec} />)}
        </div>
      </section>
    </div>
  );
}
