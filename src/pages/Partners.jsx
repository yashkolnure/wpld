import { Link } from "react-router-dom";

// ── Brand contact (reused in CTAs) ──────────────────────────────────────────
const DEMO_WA = "https://wa.me/918767640530?text=Hi%2C%20I'm%20interested%20in%20the%20WPLeads%20White-Label%20Partner%20Program.%20Please%20book%20me%20a%20free%20demo.";
const EMAIL = "admin@avenirya.com";
const PHONE = "+918767640530";

// ── Section 1 data ──────────────────────────────────────────────────────────
const revenueSplit = [
  { type: "Monthly subscription you charge your clients", who: "You keep 100%", amt: "You decide the price", you: true },
  { type: "One-time setup fee you pay to us", who: "Avenirya (one-time)", amt: "₹5,999", you: false },
  { type: "Messaging usage (Meta API costs)", who: "Avenirya 25% markup", amt: "At cost + 25%", you: false },
];
const earnings = [
  { clients: "10",  price: "₹2,000", month: "₹20,000",   year: "₹2,40,000" },
  { clients: "25",  price: "₹2,000", month: "₹50,000",   year: "₹6,00,000" },
  { clients: "50",  price: "₹2,000", month: "₹1,00,000", year: "₹12,00,000" },
  { clients: "100", price: "₹3,000", month: "₹3,00,000", year: "₹36,00,000" },
];

// ── Section 2 data ──────────────────────────────────────────────────────────
const included = [
  { icon: "🌐", title: "Custom Domain", desc: "Your platform runs on a domain of your choice." },
  { icon: "☁️", title: "Managed Hosting", desc: "Fully managed cloud hosting — no servers to set up." },
  { icon: "🎨", title: "White-Label Branding", desc: "Your logo, business name and brand on the platform." },
  { icon: "🔒", title: "SSL Security", desc: "HTTPS encryption for your platform and all client data." },
  { icon: "🟢", title: "WhatsApp API Setup", desc: "Meta-approved API configuration & verification help." },
  { icon: "📊", title: "Partner Dashboard", desc: "One dashboard to manage and monitor every client." },
  { icon: "🎓", title: "Onboarding & Training", desc: "Full walkthrough — how to use, manage and sell it." },
  { icon: "🤝", title: "Client Enrollment Support", desc: "We help you onboard your first clients." },
];

// ── Section 3 data ──────────────────────────────────────────────────────────
const aveniryaHandles = [
  "Platform development and feature updates",
  "Cloud hosting, servers & uptime management",
  "WhatsApp API management and Meta compliance",
  "Technical customer support for platform issues",
  "Security, data management and backups",
  "Bug fixes and performance improvements",
];
const youHandle = [
  "Finding and approaching potential clients",
  "Selling the platform under your brand",
  "Onboarding clients and managing relationships",
  "Setting your own pricing and collecting payments",
  "Building your brand and reputation",
  "Renewing client subscriptions month over month",
];

// ── Section 4 data ──────────────────────────────────────────────────────────
const features = [
  { icon: "🟢", title: "WhatsApp API Access", desc: "Official Meta API — legally compliant business messaging." },
  { icon: "🤖", title: "AI Chatbots", desc: "Automates customer conversations 24/7, no human agents." },
  { icon: "🔀", title: "Workflow Automation", desc: "Multi-step automated flows triggered by customer actions." },
  { icon: "📢", title: "Broadcast Campaigns", desc: "Send bulk promotional or info messages to contact lists." },
  { icon: "👥", title: "CRM & Contacts", desc: "Manage, tag and segment all customer contacts in one place." },
  { icon: "📝", title: "Template Management", desc: "Create and manage Meta-approved message templates." },
  { icon: "📈", title: "Analytics Dashboard", desc: "Track delivery, open rates, responses and campaign results." },
  { icon: "🎯", title: "Lead Capture", desc: "Capture and qualify inbound leads right through WhatsApp." },
];

// ── Section 5 data ──────────────────────────────────────────────────────────
const compare = [
  { name: "WATI", fee: "~$99/mo", role: "Customer — you pay them", share: "None", hl: false },
  { name: "Gallabox", fee: "~$58/mo", role: "Customer — you pay them", share: "None", hl: false },
  { name: "DoubleTick", fee: "~$42/mo", role: "Customer — you pay them", share: "None", hl: false },
  { name: "AiSensy", fee: "~$20/mo", role: "Customer — you pay them", share: "None", hl: false },
  { name: "WPLeads (White-Label)", fee: "₹5,999 one-time", role: "Owner — you sell to others", share: "100% of subscription", hl: true },
];

// ── Section 6 data ──────────────────────────────────────────────────────────
const market = [
  { icon: "🌍", value: "3+ Billion", label: "WhatsApp users worldwide" },
  { icon: "🏢", value: "200M+", label: "Businesses on WhatsApp" },
  { icon: "🇮🇳", value: "500M+", label: "WhatsApp users in India" },
  { icon: "👀", value: "~98%", label: "Avg. message open rate" },
  { icon: "💬", value: "175M+", label: "People message businesses daily" },
  { icon: "📲", value: "10 slots", label: "Partner slots in this phase" },
];
const industries = [
  "Restaurants", "Real Estate", "Education", "Healthcare", "E-commerce",
  "Travel Agencies", "Financial Services", "Insurance", "Automobile Dealers",
  "Marketing Agencies", "Coaching Institutes", "Local Businesses",
];

// ── Section 7 data ──────────────────────────────────────────────────────────
const useCases = [
  { icon: "🍽️", title: "Restaurant Ordering Bot", industry: "Food & Beverage", auto: "Menu sharing, order collection, delivery updates." },
  { icon: "🏠", title: "Real Estate Lead Bot", industry: "Real Estate", auto: "Property enquiries, site-visit scheduling, follow-ups." },
  { icon: "🎓", title: "Admission Enquiry Bot", industry: "Education / Coaching", auto: "Course info, application links, fee reminders." },
  { icon: "🎧", title: "Customer Support Bot", industry: "All Industries", auto: "FAQs, ticket creation, agent escalation routing." },
  { icon: "📅", title: "Appointment Booking", industry: "Healthcare, Salons, Clinics", auto: "Slot booking, reminders, rescheduling." },
  { icon: "📦", title: "Order Tracking", industry: "E-commerce", auto: "Order status updates, returns & exchange flows." },
  { icon: "🎉", title: "Marketing Campaigns", industry: "All Industries", auto: "Promotional broadcasts, coupons, re-engagement." },
  { icon: "✨", title: "AI Sales Assistant", industry: "All Industries", auto: "24/7 lead qualification, product info, follow-ups." },
];

// ── Section 8 data ──────────────────────────────────────────────────────────
const whyJoin = [
  { icon: "🚀", text: "WhatsApp automation is early-stage in India — early partners capture the market first." },
  { icon: "🔁", text: "Recurring subscriptions mean your revenue compounds every month you retain clients." },
  { icon: "📍", text: "Clients exist in every city and every industry — no geographic limitation." },
  { icon: "🧠", text: "No technical knowledge required — if you can sell, you can run this business." },
  { icon: "⏳", text: "Only 10 partner slots are available in this phase." },
];

// ── Shared bits ─────────────────────────────────────────────────────────────
const lift = {
  onMouseOver: e => { e.currentTarget.style.boxShadow = "0 12px 28px -10px rgba(0,0,0,0.14)"; e.currentTarget.style.transform = "translateY(-4px)"; },
  onMouseOut: e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; },
};
const card = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, transition: "box-shadow 0.2s, transform 0.2s" };

const Label = ({ children, color = "#25d366" }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{children}</div>
);
const H2 = ({ children }) => (
  <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.15 }}>{children}</h2>
);

// Responsive table wrapper
const TableWrap = ({ children }) => (
  <div style={{ overflowX: "auto", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 18, WebkitOverflowScrolling: "touch" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520, fontSize: 14 }}>{children}</table>
  </div>
);
const Th = ({ children, right }) => (
  <th style={{ textAlign: right ? "right" : "left", padding: "14px 18px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6, background: "#f0fdf4", borderBottom: "1px solid rgba(0,0,0,0.08)", whiteSpace: "nowrap" }}>{children}</th>
);
const Td = ({ children, right, bold, color }) => (
  <td style={{ textAlign: right ? "right" : "left", padding: "14px 18px", color: color || "#334155", fontWeight: bold ? 800 : 500, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>{children}</td>
);

export default function Partners() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', sans-serif", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes wpl-fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-ping{0%,100%{opacity:1}50%{opacity:.25}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 45%,#f8f0ff 100%)", padding: "clamp(120px,15vw,160px) clamp(20px,5vw,60px) 84px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", animation: "wpl-fadeup 0.7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: 1.4, color: "#16a34a", textTransform: "uppercase", marginBottom: 24 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#25d366", animation: "wpl-ping 1.5s ease-in-out infinite" }} />
            WHITE-LABEL PARTNER PROGRAM
          </div>
          <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#0a0a0a", marginBottom: 20 }}>
            Launch your own WhatsApp<br />
            <span style={{ background: "linear-gradient(135deg,#25d366 0%,#059669 60%,#16a34a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              automation SaaS — under your brand
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto 14px" }}>
            Resell the WPLeads platform under your own name, set your own prices, and keep <strong style={{ color: "#0f172a" }}>100% of subscription revenue</strong>. No monthly licensing fees.
          </p>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 30 }}>Developed by <strong style={{ color: "#0f172a" }}>Avenirya Solutions OPC Pvt Ltd</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <a href={DEMO_WA} target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", padding: "14px 32px", borderRadius: 50, fontSize: 15, fontWeight: 800, textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(37,211,102,0.6)" }}>Book a FREE Demo</a>
            <a href="#revenue" style={{ background: "#fff", color: "#0f172a", padding: "14px 30px", borderRadius: 50, fontSize: 15, fontWeight: 800, textDecoration: "none", border: "1px solid rgba(0,0,0,0.1)" }}>See the earnings →</a>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, background: "#0f172a", color: "#fff", borderRadius: 100, padding: "8px 18px", fontSize: 12.5, fontWeight: 800 }}>
            🔥 Only 10 partner slots available in this phase
          </div>
        </div>
      </section>

      {/* ── 1. REVENUE MODEL ── */}
      <section id="revenue" style={{ background: "#fff", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Label>Revenue Model — How You Make Money</Label>
            <H2>Keep 100% of your subscription revenue</H2>
            <p style={{ fontSize: 15.5, color: "#64748b", lineHeight: 1.7, maxWidth: 680, margin: "16px auto 0" }}>
              This is a white-label reseller arrangement. You sell WPLeads under your own brand, collect monthly subscription fees from your clients, and keep every rupee. There are <strong style={{ color: "#0f172a" }}>no monthly licensing fees</strong> payable to us.
            </p>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 12, letterSpacing: 0.2 }}>Revenue split — clearly stated</h3>
          <TableWrap>
            <thead><tr><Th>Revenue Type</Th><Th>Who Earns It</Th><Th right>Amount</Th></tr></thead>
            <tbody>
              {revenueSplit.map(r => (
                <tr key={r.type} style={{ background: r.you ? "#f0fdf4" : "#fff" }}>
                  <Td>{r.type}</Td>
                  <Td bold color={r.you ? "#16a34a" : "#334155"}>{r.who}</Td>
                  <Td right bold>{r.amt}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>

          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#0f172a", borderRadius: 16, padding: "18px 22px", margin: "22px 0 40px" }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>💡</span>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, margin: 0 }}>
              In plain terms: you pay ₹5,999 <strong style={{ color: "#4ade80" }}>once</strong> to set up. After that, every rupee you collect from clients as platform subscription is <strong style={{ color: "#4ade80" }}>yours</strong>. We only earn from the one-time fee and a small 25% markup on actual Meta message-delivery costs.
            </p>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 12, letterSpacing: 0.2 }}>Earnings projection <span style={{ fontWeight: 600, color: "#94a3b8" }}>(at ₹2,000–3,000 per client / month)</span></h3>
          <TableWrap>
            <thead><tr><Th>Clients</Th><Th>Price / Client / Mo</Th><Th right>Your Monthly Revenue</Th><Th right>Your Annual Revenue</Th></tr></thead>
            <tbody>
              {earnings.map(e => (
                <tr key={e.clients}>
                  <Td bold color="#0f172a">{e.clients}</Td>
                  <Td>{e.price}</Td>
                  <Td right bold color="#16a34a">{e.month}</Td>
                  <Td right bold color="#16a34a">{e.year}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 12, lineHeight: 1.6 }}>Pricing is entirely your decision. The figures above are examples only — charge more or less based on your client and market.</p>
        </div>
      </section>

      {/* ── 2. WHAT YOU PAY ── */}
      <section style={{ background: "#fafafa", padding: "80px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Label color="#d97706">Partner Investment</Label>
            <H2>One simple, one-time fee</H2>
          </div>
          <div style={{ maxWidth: 460, margin: "0 auto 44px", textAlign: "center", background: "linear-gradient(135deg,#fffbeb,#fff)", border: "1px solid #fde68a", borderRadius: 24, padding: "32px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: 1 }}>One-Time Setup Fee</div>
            <div style={{ fontSize: "clamp(44px,8vw,60px)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1.1, margin: "6px 0" }}>₹5,999</div>
            <div style={{ fontSize: 13.5, color: "#92400e", fontWeight: 700 }}>No monthly fees · No recurring licensing charges</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {included.map(i => (
              <div key={i.title} style={{ ...card, padding: "24px 22px" }} {...lift}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{i.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{i.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. RESPONSIBILITIES ── */}
      <section style={{ background: "#fff", padding: "80px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Label color="#2563eb">Division of Responsibilities</Label>
            <H2>You sell. We handle the tech.</H2>
            <p style={{ fontSize: 15, color: "#64748b", marginTop: 14 }}>A clear split — you need zero technical knowledge.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 22, padding: "28px 26px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1d4ed8", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>🛠️ Avenirya handles <span style={{ fontWeight: 600, color: "#3b82f6" }}>· technology</span></div>
              {aveniryaHandles.map(t => (
                <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#2563eb", fontWeight: 900, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 22, padding: "28px 26px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#15803d", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>💼 You handle <span style={{ fontWeight: 600, color: "#22c55e" }}>· business</span></div>
              {youHandle.map(t => (
                <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#16a34a", fontWeight: 900, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PLATFORM FEATURES ── */}
      <section style={{ background: "#fafafa", padding: "80px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Label>The Platform</Label>
            <H2>Everything your clients get — under your brand</H2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {features.map(f => (
              <div key={f.title} style={{ ...card, padding: "26px 22px" }} {...lift}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. COMPARISON ── */}
      <section style={{ background: "#fff", padding: "80px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Label color="#7c3aed">How It Compares</Label>
            <H2>Stop paying for platforms. Become one.</H2>
            <p style={{ fontSize: 15, color: "#64748b", marginTop: 14, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Existing platforms sell directly to businesses at fixed monthly rates. As a WPLeads partner, <strong style={{ color: "#0f172a" }}>you become the platform</strong>.
            </p>
          </div>
          <TableWrap>
            <thead><tr><Th>Platform</Th><Th>Monthly Fee</Th><Th>Your Role</Th><Th right>Your Revenue Share</Th></tr></thead>
            <tbody>
              {compare.map(c => (
                <tr key={c.name} style={{ background: c.hl ? "#f0fdf4" : "#fff" }}>
                  <Td bold color={c.hl ? "#15803d" : "#0f172a"}>{c.name}</Td>
                  <Td>{c.fee}</Td>
                  <Td color={c.hl ? "#15803d" : "#64748b"}>{c.role}</Td>
                  <Td right bold color={c.hl ? "#16a34a" : "#94a3b8"}>{c.share}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      </section>

      {/* ── 6. MARKET OPPORTUNITY (dark) ── */}
      <section style={{ background: "linear-gradient(135deg,#065f56 0%,#022c22 100%)", padding: "84px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#4ade80", letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>Market Opportunity</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>WhatsApp is the channel. The timing is now.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 36 }}>
            {market.map(m => (
              <div key={m.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "24px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4, lineHeight: 1.4 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 16 }}>High-demand industries</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {industries.map(i => (
              <span key={i} style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#bbf7d0", padding: "7px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600 }}>{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. USE CASES ── */}
      <section style={{ background: "#fff", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Label color="#0891b2">What You Can Sell</Label>
            <H2>Proven, in-demand automation</H2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {useCases.map(u => (
              <div key={u.title} style={{ ...card, padding: "24px 22px" }} {...lift}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{u.icon}</span>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a" }}>{u.title}</div>
                    <div style={{ fontSize: 11.5, color: "#0891b2", fontWeight: 700 }}>{u.industry}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{u.auto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WHY JOIN + CTA ── */}
      <section style={{ background: "#fafafa", padding: "80px clamp(20px,5vw,60px) 70px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Label>Why Join Now</Label>
            <H2>Only 10 partner slots in this phase</H2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {whyJoin.map(w => (
              <div key={w.text} style={{ ...card, display: "flex", gap: 14, alignItems: "center", padding: "18px 20px" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.5, fontWeight: 500 }}>{w.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (dark) ── */}
      <section style={{ background: "#0a0a0a", padding: "84px clamp(20px,5vw,60px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", color: "#4ade80", borderRadius: 100, padding: "7px 16px", fontSize: 12, fontWeight: 800, marginBottom: 22 }}>🔥 Only 10 slots available</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.12, marginBottom: 14 }}>
            Book a free demo before slots fill up
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 36 }}>
            See the full platform and get all your questions answered. If you can sell, you can run this business.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <a href={DEMO_WA} target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", padding: "15px 34px", borderRadius: 50, fontSize: 15, fontWeight: 800, textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(37,211,102,0.6)" }}>Book a FREE Demo on WhatsApp</a>
            <a href={`mailto:${EMAIL}?subject=WPLeads%20Partner%20Program`} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "15px 30px", borderRadius: 50, fontSize: 15, fontWeight: 800, textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>{EMAIL}</a>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 34 }}>
            <a href={`tel:${PHONE}`} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontWeight: 700 }}>{PHONE}</a>
            {"  ·  "}Avenirya Solutions OPC Pvt Ltd
          </p>
          <Link to="/" style={{ display: "inline-block", marginTop: 22, color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>← Back to WPLeads home</Link>
        </div>
      </section>
    </div>
  );
}
