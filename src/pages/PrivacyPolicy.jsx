const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;}
  @keyframes wpl-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
`;

const sections = [
  {
    n: "01", title: "Introduction",
    content: `WPLeads is a WhatsApp Business automation platform operated by Avenirya Solutions OPC Pvt Ltd ("we," "our," or "us"). This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the WPLeads platform at wpleads.in. By registering an account or using WPLeads in any capacity, you agree to the practices described in this policy.`,
  },
  {
    n: "02", title: "Information We Collect",
    list: [
      { heading: "Account Information", text: "When you register, we collect your full name, email address, and a securely hashed password. If you sign in via Google OAuth, we receive your Google profile name, email address, and profile photo." },
      { heading: "WhatsApp Business Credentials", text: "To connect your WhatsApp Business account, you provide your Phone Number ID, WhatsApp Business Account (WABA) ID, and API Access Token. These credentials are stored encrypted using AES-256 encryption and are never stored or exposed in plaintext." },
      { heading: "Contact & Lead Data", text: "Incoming contacts, phone numbers, names, and chat histories from your connected WhatsApp number are captured and stored to power your CRM, workflow automation, and lead tracking features." },
      { heading: "Payment Information", text: "Wallet top-ups are processed through Razorpay. We receive transaction confirmations and reference IDs from Razorpay. We do not store raw card numbers, UPI IDs, or bank credentials on our servers." },
      { heading: "Usage & Configuration Data", text: "We store your workflow configurations, message templates, broadcast campaigns, bulk outreach jobs, and message delivery logs to operate the platform on your behalf." },
      { heading: "Technical & Log Data", text: "We may collect standard server logs including IP addresses, browser type, and access timestamps for security monitoring and debugging." },
    ],
  },
  {
    n: "03", title: "How We Use Your Information",
    list: [
      { heading: "Platform Operation", text: "To authenticate your account, connect your WhatsApp Business API, execute your automation workflows, and deliver all core product features." },
      { heading: "Billing & Payments", text: "To manage your wallet balance, process top-ups via Razorpay, track per-message usage, and maintain your full transaction history." },
      { heading: "Security & Fraud Prevention", text: "To detect and prevent unauthorized access, protect your API credentials, and monitor platform integrity." },
      { heading: "Support & Communications", text: "To respond to your support requests and send important service notifications such as payment receipts or account alerts." },
      { heading: "Platform Improvement", text: "To understand how WPLeads is used and make informed improvements to features, performance, and reliability." },
    ],
  },
  {
    n: "04", title: "Data Storage & Security",
    content: `Your data is stored on servers located in Mumbai, India (WPL-EDGE — Cluster 01). We apply AES-256 encryption to sensitive credentials such as your WhatsApp API access tokens. Authentication sessions are managed using JWT tokens stored in your browser's local storage. We implement access controls and infrastructure monitoring to protect your data. While we take security seriously, no system can guarantee absolute security, and you are responsible for maintaining the confidentiality of your account password.`,
  },
  {
    n: "05", title: "Third-Party Services",
    list: [
      { heading: "Meta / WhatsApp Business API", text: "Messages you send via WPLeads are routed through Meta's WhatsApp Business API. Meta's own Platform Terms and Data Policy apply to message delivery and processing." },
      { heading: "Razorpay", text: "Payment processing for wallet top-ups is handled by Razorpay. Razorpay's Privacy Policy governs any payment data they collect during checkout." },
      { heading: "Google OAuth", text: "If you sign in using 'Sign in with Google', Google receives and processes your authentication request according to Google's Privacy Policy." },
      { heading: "No Data Sales", text: "We do not sell, rent, or trade your personal data to any third party for advertising or marketing purposes." },
    ],
  },
  {
    n: "06", title: "Cookies & Local Storage",
    content: `WPLeads uses browser local storage to persist your JWT authentication token for session management across page loads. We may use standard analytics tracking to understand general platform usage patterns. You can clear your browser's local storage at any time via browser settings, which will log you out of the platform.`,
  },
  {
    n: "07", title: "Data Retention",
    content: `Account data is retained for as long as your account remains active. Contact and chat data is retained to maintain continuity of your CRM and workflow history. Payment and transaction records are retained as required by applicable Indian financial regulations (typically seven to eight years). You may request deletion of your account and associated personal data by contacting us at admin@avenirya.com. Deletion requests are processed within 30 days.`,
  },
  {
    n: "08", title: "Your Rights",
    list: [
      { heading: "Access", text: "You may request a copy of the personal data we hold about you." },
      { heading: "Correction", text: "You may update your account information at any time from your dashboard settings." },
      { heading: "Deletion", text: "You may request deletion of your account and associated personal data by emailing admin@avenirya.com." },
      { heading: "Portability", text: "You may request an export of your contact and workflow configuration data." },
      { heading: "Withdraw Consent", text: "You may disconnect your WhatsApp credentials or delete your account at any time to withdraw consent for data processing." },
    ],
  },
  {
    n: "09", title: "Changes to This Policy",
    content: `We may update this Privacy Policy as the platform evolves or as required by applicable law. We will notify registered users of material changes via email or an in-platform notice before changes take effect. Continued use of WPLeads after an updated policy is posted constitutes your acceptance of the revised terms.`,
  },
  {
    n: "10", title: "Contact Us",
    content: `For any privacy-related queries, data access requests, or deletion requests, please contact:\n\nAvenirya Solutions OPC Pvt Ltd\nEmail: admin@avenirya.com\nPhone: +91 8767640530\nWebsite: avenirya.com`,
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

export default function PrivacyPolicy() {
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
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:18 }}>Privacy Policy</h1>
          <p style={{ fontSize:16, color:"rgba(0,0,0,0.55)", lineHeight:1.6, marginBottom:20 }}>How WPLeads collects, uses, and protects your data.</p>
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
