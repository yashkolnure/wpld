const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const METHOD_COLORS = {
  GET:    { bg:"#eff6ff", color:"#2563eb" },
  POST:   { bg:"#f0fdf4", color:"#16a34a" },
  PUT:    { bg:"#fffbeb", color:"#d97706" },
  PATCH:  { bg:"#fdf4ff", color:"#9333ea" },
  DELETE: { bg:"#fef2f2", color:"#dc2626" },
};

const groups = [
  {
    title:"Authentication", base:"/api/auth",
    desc:"Register and log in. The login endpoint returns a JWT token used for all protected routes.",
    endpoints:[
      { method:"POST",  path:"/api/auth/register",  auth:false, note:"Create a new user account" },
      { method:"POST",  path:"/api/auth/login",     auth:false, note:"Log in and receive a JWT token" },
      { method:"PATCH", path:"/api/auth/fcm-token", auth:true,  note:"Update FCM push notification token" },
    ],
  },
  {
    title:"WhatsApp Connection", base:"/api/whatsapp",
    desc:"Connect and manage your WhatsApp Business API credentials and phone numbers.",
    endpoints:[
      { method:"POST",   path:"/api/whatsapp/connect",               auth:true,  note:"Connect WhatsApp credentials" },
      { method:"POST",   path:"/api/whatsapp/embedded-connect",      auth:true,  note:"Connect via embedded signup flow" },
      { method:"GET",    path:"/api/whatsapp/status",                auth:true,  note:"Get connection status" },
      { method:"DELETE", path:"/api/whatsapp/disconnect",            auth:true,  note:"Disconnect WhatsApp account" },
      { method:"GET",    path:"/api/whatsapp/webhook-info",          auth:true,  note:"Get your webhook URL and verify token" },
      { method:"GET",    path:"/api/whatsapp/onboarding",            auth:true,  note:"Get saved onboarding progress" },
      { method:"PUT",    path:"/api/whatsapp/onboarding",            auth:true,  note:"Save onboarding progress" },
      { method:"DELETE", path:"/api/whatsapp/onboarding",            auth:true,  note:"Clear onboarding progress" },
      { method:"POST",   path:"/api/whatsapp/numbers/add",           auth:true,  note:"Add a phone number" },
      { method:"POST",   path:"/api/whatsapp/numbers/request-otp",   auth:true,  note:"Request OTP for number verification" },
      { method:"POST",   path:"/api/whatsapp/numbers/verify-otp",    auth:true,  note:"Verify OTP" },
      { method:"POST",   path:"/api/whatsapp/numbers/register",      auth:true,  note:"Register a verified phone number" },
    ],
  },
  {
    title:"Workflows", base:"/api/workflows",
    desc:"Create and manage automation workflows. All routes require authentication.",
    endpoints:[
      { method:"GET",    path:"/api/workflows",               auth:true, note:"List all workflows" },
      { method:"POST",   path:"/api/workflows",               auth:true, note:"Create a new workflow" },
      { method:"GET",    path:"/api/workflows/:id",           auth:true, note:"Get a single workflow" },
      { method:"PUT",    path:"/api/workflows/:id",           auth:true, note:"Update a workflow" },
      { method:"DELETE", path:"/api/workflows/:id",           auth:true, note:"Delete a workflow" },
      { method:"PATCH",  path:"/api/workflows/:id/toggle",   auth:true, note:"Toggle workflow active/paused" },
      { method:"POST",   path:"/api/workflows/:id/simulate", auth:true, note:"Simulate a workflow run" },
    ],
  },
  {
    title:"Message Templates", base:"/api/templates",
    desc:"Manage WhatsApp Business message templates.",
    endpoints:[
      { method:"GET",    path:"/api/templates",       auth:true, note:"List all templates" },
      { method:"POST",   path:"/api/templates",       auth:true, note:"Create a new template" },
      { method:"POST",   path:"/api/templates/sync",  auth:true, note:"Sync templates from Meta" },
      { method:"DELETE", path:"/api/templates/:name", auth:true, note:"Delete a template by name" },
    ],
  },
  {
    title:"Broadcast Campaigns", base:"/api/broadcasts",
    desc:"Send broadcast messages to contacts using approved templates.",
    endpoints:[
      { method:"GET",  path:"/api/broadcasts",           auth:true, note:"List all campaigns" },
      { method:"POST", path:"/api/broadcasts",           auth:true, note:"Create and send a campaign" },
      { method:"GET",  path:"/api/broadcasts/tags",      auth:true, note:"List all contact tags" },
      { method:"GET",  path:"/api/broadcasts/active24",  auth:true, note:"Get contacts in active 24h window" },
    ],
  },
  {
    title:"Bulk Cold Outreach", base:"/api/bulk",
    desc:"Upload phone number lists and send approved templates at scale.",
    endpoints:[
      { method:"GET",  path:"/api/bulk", auth:true, note:"List all bulk campaigns" },
      { method:"POST", path:"/api/bulk", auth:true, note:"Create and launch a bulk campaign" },
    ],
  },
  {
    title:"Contacts", base:"/api/contacts",
    desc:"Read and manage your WhatsApp contact CRM.",
    endpoints:[
      { method:"GET",    path:"/api/contacts",        auth:true, note:"List all contacts" },
      { method:"GET",    path:"/api/contacts/stats",  auth:true, note:"Get contact statistics" },
      { method:"GET",    path:"/api/contacts/export", auth:true, note:"Export contacts as CSV" },
      { method:"GET",    path:"/api/contacts/:id",    auth:true, note:"Get a single contact" },
      { method:"PATCH",  path:"/api/contacts/:id",    auth:true, note:"Update a contact" },
      { method:"DELETE", path:"/api/contacts/:id",    auth:true, note:"Delete a contact" },
    ],
  },
  {
    title:"Wallet & Payments", base:"/api/wallet",
    desc:"Manage your WPLeads wallet balance and Razorpay recharge flow.",
    endpoints:[
      { method:"GET",  path:"/api/wallet",                       auth:true, note:"Get wallet balance and transactions" },
      { method:"POST", path:"/api/wallet/recharge/create-order", auth:true, note:"Create a Razorpay recharge order" },
      { method:"POST", path:"/api/wallet/recharge/verify",       auth:true, note:"Verify payment and credit wallet" },
    ],
  },
  {
    title:"Webhook", base:"/api/webhook",
    desc:"Meta webhook endpoint. Register the GET URL in the Meta Developer Portal for verification.",
    endpoints:[
      { method:"GET",  path:"/api/webhook", auth:false, note:"Meta webhook verification handshake" },
      { method:"POST", path:"/api/webhook", auth:false, note:"Receive incoming Meta events (signature-verified)" },
    ],
  },
];

function MethodBadge({ method }) {
  const s = METHOD_COLORS[method] || { bg:"#f1f5f9", color:"#475569" };
  return (
    <span style={{ display:"inline-block", background:s.bg, color:s.color, fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:6, letterSpacing:0.3, flexShrink:0 }}>
      {method}
    </span>
  );
}

export default function ApiDocs() {
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
            INTERNAL REFERENCE
          </div>
          <h1 style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.1, color:"#0a0a0a", marginBottom:20 }}>API Reference</h1>
          <p style={{ fontSize:17, color:"rgba(0,0,0,0.55)", lineHeight:1.6 }}>Complete endpoint listing for the WPLeads backend API.</p>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{ background:"#fafafa", padding:"48px clamp(20px,5vw,60px)", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          <div style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:16, padding:"20px 24px", background:"#fff" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8, fontFamily:"'DM Mono',monospace" }}>BASE URL</div>
            <code style={{ fontSize:13, fontWeight:600, color:"#0f172a", fontFamily:"'DM Mono',monospace", wordBreak:"break-all" }}>{BASE_URL}</code>
          </div>
          <div style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:16, padding:"20px 24px", background:"#fff" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8, fontFamily:"'DM Mono',monospace" }}>AUTHENTICATION</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>JWT Bearer Token</div>
            <code style={{ fontSize:12, color:"#64748b", fontFamily:"'DM Mono',monospace", display:"block", marginTop:4 }}>Authorization: Bearer &lt;token&gt;</code>
          </div>
          <div style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:16, padding:"20px 24px", background:"#fff" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8, fontFamily:"'DM Mono',monospace" }}>CONTENT TYPE</div>
            <code style={{ fontSize:13, fontWeight:600, color:"#0f172a", fontFamily:"'DM Mono',monospace" }}>application/json</code>
          </div>
        </div>
      </section>

      {/* ── ENDPOINT GROUPS ── */}
      <section style={{ background:"#fff", padding:"64px clamp(20px,5vw,60px) 100px" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", flexDirection:"column", gap:32 }}>
          {groups.map(group => (
            <div key={group.title} style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ background:"#fafafa", padding:"20px 28px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:17, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{group.title}</div>
                <div style={{ fontSize:13, color:"#64748b", lineHeight:1.5 }}>{group.desc}</div>
                <code style={{ fontSize:11, color:"#94a3b8", fontFamily:"'DM Mono',monospace", display:"block", marginTop:6 }}>{group.base}</code>
              </div>
              <div>
                {group.endpoints.map((ep, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 28px", borderBottom: i < group.endpoints.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", flexWrap:"wrap" }}>
                    <MethodBadge method={ep.method} />
                    <code style={{ fontSize:13, fontFamily:"'DM Mono',monospace", color:"#0f172a", fontWeight:500, flexGrow:1, minWidth:160 }}>{ep.path}</code>
                    <span style={{ fontSize:13, color:"#64748b", minWidth:180 }}>{ep.note}</span>
                    <span style={{ fontSize:10, fontWeight:800, letterSpacing:0.5, color: ep.auth ? "#d97706" : "#16a34a", background: ep.auth ? "#fffbeb" : "#f0fdf4", padding:"2px 8px", borderRadius:100, fontFamily:"'DM Mono',monospace", flexShrink:0 }}>
                      {ep.auth ? "AUTH" : "PUBLIC"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
