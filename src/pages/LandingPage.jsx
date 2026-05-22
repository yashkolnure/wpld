import { useState, useEffect, useRef } from "react";
import WorkflowBuilderPreview from "../components/WorkflowBuilderPreview";
import PricingComparisonSection from "../components/PricingCompare";

/* ─────────────────────────────
   ICONS
───────────────────────────── */
const WaIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const isMobile = window.innerWidth < 768;

const CheckIcon = ({ dark }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="8" fill={dark ? "rgba(37,211,102,0.15)" : "rgba(37,211,102,0.12)"}/>
    <path d="M5 8l2 2 4-4" stroke="#25d366" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─────────────────────────────
   HERO ILLUSTRATION
───────────────────────────── */

function HeroIllustration() {
  const [sent,  setSent]  = useState(847219);
  const [leads, setLeads] = useState(3);
  const [clock, setClock] = useState("");

  /* live clock */
  useEffect(()=>{
    const tick=()=>setClock(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
    tick(); const t=setInterval(tick,1000); return ()=>clearInterval(t);
  },[]);
  /* incrementing counters */
  useEffect(()=>{
    const t=setInterval(()=>setSent(c=>c+Math.floor(Math.random()*4+1)),1800);
    return ()=>clearInterval(t);
  },[]);
  useEffect(()=>{
    const t=setInterval(()=>setLeads(c=>c+1),9000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{position:"relative", width:"100%"}}>
      <img
        src="/images/hero-phone.webp"
        alt="WPLeads WhatsApp automation"
      />

      {/* messages sent — anchored inside top-left of image */}
      <div style={{position:"absolute",top:16,left:16,zIndex:20,animation:"wpl-float2 6s ease-in-out infinite 0.8s"}}>
        <div style={{background:"#fff",borderRadius:50,padding:"7px 14px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",border:"1px solid rgba(0,0,0,0.06)"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#111",fontFamily:"system-ui",letterSpacing:"-0.03em",lineHeight:1}}>{sent.toLocaleString()}</div>
            <div style={{fontSize:8,color:"#6b7280",fontFamily:"system-ui",marginTop:1}}>messages sent</div>
          </div>
        </div>
      </div>

      {/* AI Bot pill — anchored inside bottom-left of image */}
      <div style={{position:"absolute",bottom:16,left:16,zIndex:20,animation:"wpl-float3 6.5s ease-in-out infinite 1.5s"}}>
        <div style={{background:"#0f172a",borderRadius:50,padding:"7px 14px",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(15,23,42,0.3)"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#25d366",boxShadow:"0 0 6px #25d366",animation:"wpl-ping 1.4s ease-in-out infinite",flexShrink:0}}/>
          <span style={{fontSize:10,fontWeight:700,color:"#fff",fontFamily:"system-ui",whiteSpace:"nowrap"}}>AI Bot Active</span>
          <span style={{fontSize:9,fontWeight:600,color:"#25d366",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>+{leads} leads</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   DATA
───────────────────────────── */
const features = [
  { icon:"⚡", title:"Keyword triggers",        desc:"Fire workflows instantly when users message a specific phrase. Support exact match or contains.", col:"#16a34a", bg:"#f0fdf4" },
  { icon:"🎨", title:"Visual flow builder",     desc:"Build complex conversation trees without a single line of code using our drag-and-drop canvas.", col:"#2563eb", bg:"#eff6ff" },
  { icon:"💬", title:"Interactive messages",    desc:"Send rich menus, image cards, and attachments. Native WhatsApp interactive features supported.", col:"#7c3aed", bg:"#f5f3ff" },
  { icon:"🔀", title:"Conversational branches", desc:"Route users down specific paths automatically based on the buttons they tap. True dynamic logic.", col:"#d97706", bg:"#fffbeb" },
  { icon:"📢", title:"Broadcast campaigns",     desc:"Send targeted messages to all your contacts or filter by tag. Reach the right audience in one click.", col:"#0891b2", bg:"#ecfeff" },
  { icon:"📤", title:"Bulk cold outreach",      desc:"Upload a list of phone numbers and send approved WhatsApp templates at scale. Perfect for marketing campaigns.", col:"#16a34a", bg:"#f0fdf4" },
  { icon:"📋", title:"Template management",     desc:"Create, submit, and manage WhatsApp message templates directly from your dashboard. No Meta portal needed.", col:"#7c3aed", bg:"#f5f3ff" },
  { icon:"👥", title:"Built-in CRM",            desc:"Every contact is automatically saved, tagged, and searchable. Manage your audience effortlessly.", col:"#2563eb", bg:"#eff6ff" },
  { icon:"💰", title:"Wallet & pay-per-message", desc:"Recharge your wallet once and pay only for what you send. Full transaction history, no surprise bills.", col:"#d97706", bg:"#fffbeb" },
  { icon:"🔒", title:"Enterprise security",     desc:"Your Meta credentials are encrypted securely. SOC 2 ready infrastructure with strict data privacy.", col:"#db2777", bg:"#fdf2f8" },
];

const steps = [
  { n:"01", title:"Connect WhatsApp",  desc:"Paste your Meta credentials securely." },
  { n:"02", title:"Register webhook",  desc:"Copy our URL to Meta. One-time setup." },
  { n:"03", title:"Build workflow",    desc:"Drag nodes to design your conversation." },
  { n:"04", title:"Go live instantly", desc:"Hit Save. Automation is live immediately." },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever free, no card needed",
    cta: "Get started free",
    popular: false,
    meta: [
      { icon: "🔁", label: "1 Active Workflow",     note: "Build 1 automation flow" },
      { icon: "💬", label: "1,000 msgs / month",    note: "Resets every month" },
      { icon: "📈", label: "25% Markup Fee",         note: "on broadcast messages only" },
    ],
    features: [
      "1 Active Workflow",
      "1,000 Messages per month",
      "25% Markup on Broadcast Messages",
      "Basic Message Types",
      "1 WhatsApp Number",
      "Community Support",
      "Pay-per-message wallet"
    ]
  },
  {
    name: "Pro",
    price: "Free",
    originalPrice: "$25",
    sub: "All features included — no card needed",
    cta: "Start for free",
    popular: true,
    meta: [
      { icon: "🔁", label: "2 Workflows included",  note: "+ ₹100 per extra workflow" },
      { icon: "💬", label: "Unlimited Messages",     note: "No monthly cap" },
      { icon: "📈", label: "25% Markup Fee",         note: "on broadcast messages only" },
    ],
    features: [
      "2 Workflows included",
      "₹100 per extra workflow",
      "Unlimited Message Limit",
      "25% Markup on Broadcast Messages",
      "Bulk Cold Outreach",
      "Broadcast Campaigns",
      "Template Management",
      "All Interactive Message Types",
      "Built-in CRM & Contact Tags",
      "Analytics Dashboard",
      "Priority Support"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Tailored for large scale teams",
    cta: "Talk to sales",
    popular: false,
    meta: [
      { icon: "♾️", label: "Unlimited Workflows",   note: "No restrictions" },
      { icon: "💬", label: "Unlimited Messages",     note: "No cap on sends" },
      { icon: "📈", label: "25% Markup Fee",         note: "on broadcast msgs only" },
    ],
    features: [
      "Everything in Pro",
      "Unlimited WhatsApp Numbers",
      "Dedicated Instance",
      "Custom API & Webhooks",
      "SLA & Uptime Guarantee",
      "Personal Account Manager",
      "Onboarding Assistance"
    ]
  },
];
const testimonials = [
  { text:"We went from manually replying to 200+ messages a day to zero. WPLeads paid for itself in the first week.", name:"Priya Mehta",   role:"Founder, QuickKart", color:"#16a34a" },
  { text:"Set up our entire customer support FAQ in 20 minutes. Response time went from hours to under 3 seconds.",   name:"James Okafor", role:"Head of CX, Finova",  color:"#2563eb" },
  { text:"The branching logic is what sold me. Other tools only do linear flows — this one mirrors real conversations.", name:"Sana Rashid", role:"Marketing Lead, Bolt", color:"#7c3aed" },
];

const logos = ["QuickKart","Finova","Bolt Co.","Nuvora","ShopFlow","PrimeHub","ZoomCart","NexaHQ"];


/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled,   setScrolled]   = useState(false);
  const [pricingTier, setPricingTier] = useState(0);
  const navigate = (p) => { if(typeof window!=="undefined") window.location.href=p; };

  // Sync How It Works Terminal
  useEffect(()=>{
    const t = setInterval(()=>setActiveStep(s=>(s+1)%steps.length), 3500);
    return ()=>clearInterval(t);
  },[]);

  // Navbar scroll
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"#ffffff",color:"#111",overflowX:"hidden",fontFamily:"'DM Sans','Sora',system-ui,sans-serif"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes wpl-ping    {0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes wpl-bounce  {0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes wpl-fadeup  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wpl-fadein  {from{opacity:0}to{opacity:1}}
        @keyframes wpl-float   {0%,100%{transform:translate(-50%,-50%) perspective(1400px) rotateY(-9deg) rotateX(2.5deg) translateY(0px)} 50%{transform:translate(-50%,-50%) perspective(1400px) rotateY(-9deg) rotateX(2.5deg) translateY(-14px)}}
        @keyframes wpl-shimmer {0%{transform:translateX(-100%)} 100%{transform:translateX(100%)}}
        @keyframes wpl-float2  {0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)}}
        @keyframes wpl-float3  {0%,100%{transform:translateY(0px)} 50%{transform:translateY(8px)}}
        @keyframes marquee     {from{transform:translateX(0)}to{transform:translateX(-50%)}}
        ::-webkit-scrollbar{width:0}
        html{scroll-behavior:smooth}
        a{text-decoration:none}
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
      `}</style>


      {/* ══ HERO (Unchanged) ══ */}
<section style={{
  minHeight: "100vh", 
  display: "flex", 
  alignItems: "center",
  padding: isMobile 
    ? "clamp(120px,18vw,160px) 20px 60px" 
    : "clamp(90px,12vw,130px) clamp(20px,5vw,60px) 60px",
  background: "linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)",
  overflow: "hidden", 
  position: "relative",
}}>
  <div style={{
    position: "absolute", 
    inset: 0, 
    backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", 
    backgroundSize: "60px 60px", 
    pointerEvents: "none"
  }}/>
  
  <div style={{
    width: "100%", 
    maxWidth: 1280, 
    margin: "0 auto", 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
    gap: 60, 
    alignItems: "center", 
    position: "relative", 
    zIndex: 1
  }}>
    <div style={{animation: "wpl-fadein 0.7s ease both"}}>
      {/* BADGE: Highlights the Free Credits immediately */}
      <div style={{
        display: "inline-flex", 
        alignItems: "center", 
        gap: 8, 
        background: "rgba(37,211,102,0.1)", 
        border: "1px solid rgba(37,211,102,0.25)", 
        borderRadius: 100, 
        padding: "6px 14px", 
        fontSize: 11, 
        fontFamily: "'DM Mono',monospace", 
        fontWeight: 600, 
        letterSpacing: 1.4, 
        color: "#16a34a", 
        textTransform: "uppercase", 
        marginBottom: 24
      }}>
        <span style={{width: 5, height: 5, borderRadius: "50%", background: "#25d366", animation: "wpl-ping 1.5s ease-in-out infinite"}}/>
        OFFICIAL META PARTNER
      </div>

      {/* MAIN HEADING */}
      <h1 style={{fontSize: "clamp(40px,5vw,66px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, marginBottom: 20, color: "#0a0a0a"}}>
        Get WhatsApp API<br/>
        <span style={{position: "relative", display: "inline-block"}}>
          <span style={{background: "linear-gradient(135deg,#25d366 0%,#059669 60%,#16a34a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
            Free in 5 Minutes
          </span>
          <svg style={{position: "absolute", bottom: -3, left: 0, width: "100%"}} height="5" viewBox="0 0 240 5" fill="none" preserveAspectRatio="none">
            <path d="M0 4Q60 0.5 120 4Q180 0.5 240 4" stroke="#25d366" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </span>
      </h1>

      {/* SUBTEXT */}
      <p style={{fontSize: 17, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, marginBottom: 32, maxWidth: 500, fontWeight: 400}}>
        Experience <strong>Instant Setup</strong> with our self-hosted gateway. No complex approvals, no long waits—start sending messages with your free credits today.
      </p>

      {/* QUICK STATS / FEATURES */}
      <div style={{display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36}}>
        {[{icon: "🚀", l: "Instant Activation"}, {icon: "💰", l: "No Setup Fee"}, {icon: "🛠️", l: "Developer Ready"}].map(f => (
          <div key={f.l} style={{display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 100, padding: "7px 14px", fontSize: 12.5, fontWeight: 500, color: "rgba(0,0,0,0.55)"}}>
            <span style={{fontSize: 13}}>{f.icon}</span>{f.l}
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div style={{display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 44}}>
        <button 
          onClick={() => navigate("/register")} 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "16px 36px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 20px -5px rgba(37,211,102,0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontFamily: "inherit",
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.background = "#128C7E";
          }} 
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#25D366";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Get Free API Access
        </button>

        <button 
          onClick={() => window.open("https://wa.me/917498869327?text=Hi! I want to test the free API setup.", "_blank")} 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
            color: "#075E54",
            border: "2px solid #25D366",
            borderRadius: "50px",
            padding: "16px 36px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "inherit",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.05)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }} 
          onMouseOut={e => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <WaIcon size={18} color="#075E54" /> 
          Test Demo
        </button>
      </div>
    </div>
    
    <div style={{position: "relative", animation: "wpl-fadein 1s ease 0.15s both"}}>
      <HeroIllustration/>
    </div>
  </div>
</section>

      {/* ══ UPGRADED LOGO STRIP ══ */}
      <div style={{borderTop:"1px solid rgba(0,0,0,0.06)",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"24px 0",overflow:"hidden",background:"#fafafa",WebkitMaskImage:"linear-gradient(to right, transparent, black 15%, black 85%, transparent)"}}>
        <div style={{display:"flex",alignItems:"center",gap:80,animation:"marquee 30s linear infinite",width:"max-content"}}>
          {[...logos,...logos,...logos].map((l,i)=>(
            <div key={i} style={{fontSize:13,fontWeight:800,color:"rgba(0,0,0,0.25)",letterSpacing:2,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",whiteSpace:"nowrap"}}>{l}</div>
          ))}
        </div>
      </div>
      <div className="hidden md:block">
      <WorkflowBuilderPreview />
    </div>
      {/* ══ USE CASES — PHONE MOCKUPS ══ */}
      <section id="usecases" style={{ padding: "clamp(80px,8vw,120px) clamp(20px,5vw,60px)", background: "#f8fafc", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 500, letterSpacing: 2, color: "#16a34a", textTransform: "uppercase", marginBottom: 18 }}>Real Use Cases</div>
            <h2 style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 16, color: "#0a0a0a" }}>See WP<span style={{ color: "#16a34a" }}>Leads</span> in action</h2>
            <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>From e-commerce to restaurants — businesses across industries automate WhatsApp with WPLeads.</p>
          </div>

          {/* ── Use Case 1: E-commerce ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 60, alignItems: "center", marginBottom: 110 }}>
            {/* Text */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: 1.5, color: "#16a34a", textTransform: "uppercase", marginBottom: 20 }}>🛒 E-Commerce</div>
              <h3 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, color: "#0a0a0a" }}>Turn browsers into<br />buyers on WhatsApp</h3>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, marginBottom: 28 }}>Automate your entire store experience — welcome messages, product showcases, order tracking, and support — all inside WhatsApp.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Send personalised welcome messages instantly", "Showcase products with images & quick-reply buttons", "Let customers track orders without leaving WhatsApp", "Handle support queries 24/7 with smart automation"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14.5, color: "rgba(0,0,0,0.65)" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Phone + floating elements */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 520 }}>
              {/* Green ripple circles */}
              {[180, 260, 340].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: "1.5px solid rgba(37,211,102,0.15)", top: "50%", right: "-5%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              ))}
              {/* Floating stat badge top-left */}
              <div style={{ position: "absolute", top: 40, left: 0, background: "#fff", borderRadius: 16, padding: "12px 16px", boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: "1px solid rgba(0,0,0,0.06)", zIndex: 20, animation: "wpl-float2 5s ease-in-out infinite" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#16a34a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>📈 Conversion Rate</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em" }}>3.2x</div>
                <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>vs email campaigns</div>
              </div>
              {/* Floating "Bot Active" badge bottom-right */}
              <div style={{ position: "absolute", bottom: 50, right: 0, background: "#fff", borderRadius: 50, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)", zIndex: 20, animation: "wpl-float3 6s ease-in-out infinite 0.5s" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#25d366,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(37,211,102,0.35)" }}>🤖</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.02em" }}>Bot Active</div>
                  <div style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)" }}>Responding in 0ms</div>
                </div>
              </div>
              <img
                src="/images/usecase2.png"
                alt="E-commerce WhatsApp automation"
                style={{ width: "100%", maxWidth: 480, borderRadius: 20, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.14))", display: "block", margin: "0 auto", zIndex: 10, position: "relative" }}
              />
            </div>
          </div>

          {/* ── Use Case 2: Restaurants / Food ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 60, alignItems: "center", marginBottom: 110 }}>
            {/* Phone + floating elements */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 520, order: isMobile ? 2 : 0 }}>
              {/* Floating: Food Menu card */}
              <div style={{ position: "absolute", top: 30, right: 0, background: "#fff", borderRadius: 16, padding: "12px 14px", width: 160, boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: "1px solid rgba(0,0,0,0.06)", zIndex: 20, animation: "wpl-float2 5.5s ease-in-out infinite 0.3s" }}>
                <div style={{ height: 60, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 10, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍽️</div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: "#0a0a0a", marginBottom: 2 }}>Food Menu Proposal</div>
                <div style={{ fontSize: 9, color: "#16a34a", fontWeight: 700 }}>📎 Order Now</div>
              </div>
              {/* Floating: Send Reminders */}
              <div style={{ position: "absolute", bottom: 60, right: 0, background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)", zIndex: 20, animation: "wpl-float3 6s ease-in-out infinite 1s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>🔔</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>Send Reminders &<br />Updates on</div>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#25d366" }}>WhatsApp</div>
              </div>
              <img
                src="/images/usecase3.webp"
                alt="Restaurant WhatsApp automation"
                style={{ width: "100%", maxWidth: 480, borderRadius: 20, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.14))", display: "block", margin: "0 auto", zIndex: 10, position: "relative" }}
              />
            </div>
            {/* Text */}
            <div style={{ order: isMobile ? 1 : 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: 1.5, color: "#b45309", textTransform: "uppercase", marginBottom: 20 }}>🍽️ Restaurants & Food</div>
              <h3 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, color: "#0a0a0a" }}>Automate orders &<br />delight customers</h3>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, marginBottom: 28 }}>Send order confirmations, delivery updates, and menu promotions directly on WhatsApp. No app needed — your customers already have it.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Instant order confirmation with full details", "Automated delivery tracking updates", "Send daily specials with image + CTA buttons", "Collect feedback automatically after every order"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14.5, color: "rgba(0,0,0,0.65)" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Use Case 3: Workflow Builder Visualization ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 60, alignItems: "center" }}>
            {/* Text */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: 1.5, color: "#2563eb", textTransform: "uppercase", marginBottom: 20 }}>🔀 Visual Flow Builder</div>
              <h3 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, color: "#0a0a0a" }}>Build any conversation<br />flow visually</h3>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, marginBottom: 28 }}>Drag, drop, and connect nodes to design any conversation. Keyword triggers, branching logic, media messages — all in a single canvas with no code.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["Trigger flows with any keyword (hi, hello, help)", "Branch conversations based on user replies", "Send images, PDFs, buttons and list messages", "Go live instantly — zero deployment needed"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14.5, color: "rgba(0,0,0,0.65)" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Workflow Builder Image */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src="/images/usecase1.webp"
                alt="Visual workflow flow builder"
                style={{ width: "100%", maxWidth: 580, borderRadius: 20, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.12))", display: "block", margin: "0 auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ UPGRADED FEATURES (Bento Grid) ══ */}
      <section id="features" style={{padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)",maxWidth:1280,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:70}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#16a34a",textTransform:"uppercase",marginBottom:18}}>Powerful Features</div>
          <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:16,color:"#0a0a0a"}}>Everything to automate<br/>your WhatsApp</h2>
        </div>
        
        <div style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 24
        }}>
          {features.map((f, i) => (
            <div key={i} className="bento-card" style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 28, padding: 32,
              transition: "all 0.3s ease", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
            }}>
              {/* Subtle background blob */}
              <div style={{position:"absolute", top:-40, right:-40, width:150, height:150, background: f.col, opacity: 0.04, borderRadius: "50%", filter:"blur(40px)"}}/>
              
              <div style={{width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 24, background: f.bg, border: `1px solid ${f.col}30`}}>
                {f.icon}
              </div>
              <h3 style={{fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0a0a0a", letterSpacing: "-0.01em"}}>{f.title}</h3>
              <p style={{fontSize: 14.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NEW FEATURES DEEP DIVE ══ */}
      <section style={{padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)",background:"#f8fafc",borderTop:"1px solid rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:70}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#16a34a",textTransform:"uppercase",marginBottom:18}}>New Features</div>
            <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:16,color:"#0a0a0a"}}>Everything you need<br/>to grow on WhatsApp</h2>
            <p style={{fontSize:16,color:"rgba(0,0,0,0.5)",maxWidth:480,margin:"0 auto",lineHeight:1.7}}>From automated replies to bulk campaigns — all included free in the Pro plan.</p>
          </div>

          {/* Feature 1: Bulk Cold Outreach */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))",gap:60,alignItems:"center",marginBottom:100}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:600,letterSpacing:1.5,color:"#16a34a",textTransform:"uppercase",marginBottom:20}}>📤 Bulk Cold Outreach</div>
              <h3 style={{fontSize:"clamp(28px,3vw,40px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16,color:"#0a0a0a"}}>Reach thousands<br/>with one click</h3>
              <p style={{fontSize:16,color:"rgba(0,0,0,0.55)",lineHeight:1.7,marginBottom:28}}>Upload a CSV of phone numbers, pick an approved WhatsApp template, and send at scale. Our system throttles sends to stay within Meta's rate limits — so every message lands.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[
                  {icon:"✅", text:"Only approved templates — 100% Meta compliant"},
                  {icon:"⚡", text:"4 messages/second with smart throttling"},
                  {icon:"📊", text:"Live delivery, read & failed tracking per campaign"},
                  {icon:"💰", text:"Pay only ₹0.90 per message sent — no monthly fee"},
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,fontSize:14.5,color:"rgba(0,0,0,0.65)"}}>
                    <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{f.icon}</span>{f.text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"#0f172a",borderRadius:24,padding:"28px",boxShadow:"0 24px 60px rgba(0,0,0,0.18)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <span style={{fontSize:13,fontWeight:800,color:"#fff",fontFamily:"'DM Mono',monospace"}}>Cold Outreach Campaign</span>
                <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(37,211,102,0.2)",fontSize:10,fontWeight:700,color:"#4ade80",border:"1px solid rgba(37,211,102,0.3)"}}>RUNNING</span>
              </div>
              {[
                {label:"Campaign name",    val:"Summer Sale 2025"},
                {label:"Template",         val:"summer_promo_v2"},
                {label:"Recipients",       val:"2,480 numbers"},
                {label:"Sent",             val:"1,843  (74%)",  color:"#4ade80"},
                {label:"Delivered",        val:"1,712  (69%)",  color:"#60a5fa"},
                {label:"Failed",           val:"131  (5%)",     color:"#f87171"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{fontSize:11.5,color:"rgba(255,255,255,0.45)",fontFamily:"'DM Mono',monospace"}}>{r.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:r.color||"rgba(255,255,255,0.85)",fontFamily:"'DM Mono',monospace"}}>{r.val}</span>
                </div>
              ))}
              <div style={{marginTop:16,height:6,borderRadius:99,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
                <div style={{height:"100%",width:"74%",borderRadius:99,background:"linear-gradient(90deg,#25d366,#4ade80)"}}/>
              </div>
              <div style={{marginTop:8,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace"}}>0</span>
                <span style={{fontSize:10,color:"#4ade80",fontFamily:"'DM Mono',monospace",fontWeight:700}}>74% complete</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace"}}>2,480</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Template Management */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))",gap:60,alignItems:"center"}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:600,letterSpacing:1.5,color:"#7c3aed",textTransform:"uppercase",marginBottom:20}}>📋 Template Management</div>
              <h3 style={{fontSize:"clamp(28px,3vw,40px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16,color:"#0a0a0a"}}>Create & submit<br/>templates in seconds</h3>
              <p style={{fontSize:16,color:"rgba(0,0,0,0.55)",lineHeight:1.7,marginBottom:28}}>Build WhatsApp message templates with headers, body, footers and buttons — then submit directly for Meta approval from within your dashboard. No need to navigate the Meta Business portal.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[
                  {icon:"🖊️", text:"Visual template builder with live preview"},
                  {icon:"🚀", text:"Submit for Meta approval with one click"},
                  {icon:"✅", text:"See approval status — Pending, Approved, Rejected"},
                  {icon:"🔁", text:"Reuse approved templates in workflows & campaigns"},
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,fontSize:14.5,color:"rgba(0,0,0,0.65)"}}>
                    <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{f.icon}</span>{f.text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:24,padding:"28px",boxShadow:"0 24px 60px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#0a0a0a",marginBottom:16}}>Your Templates</div>
              {[
                {name:"welcome_msg",    cat:"MARKETING", status:"APPROVED",  color:"#16a34a", bg:"#dcfce7"},
                {name:"order_confirm",  cat:"UTILITY",   status:"APPROVED",  color:"#16a34a", bg:"#dcfce7"},
                {name:"summer_promo",   cat:"MARKETING", status:"PENDING",   color:"#d97706", bg:"#fef3c7"},
                {name:"cart_reminder",  cat:"MARKETING", status:"REJECTED",  color:"#dc2626", bg:"#fee2e2"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#0a0a0a",fontFamily:"'DM Mono',monospace"}}>{t.name}</div>
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{t.cat}</div>
                  </div>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,color:t.color,background:t.bg}}>{t.status}</span>
                </div>
              ))}
              <button style={{marginTop:16,width:"100%",padding:"11px 0",borderRadius:12,background:"linear-gradient(135deg,#7c3aed,#6d28d9)",border:"none",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>+ Create New Template</button>
            </div>
          </div>

        </div>
      </section>


      {/* ══ REDESIGNED PRICING ══ */}
      <section id="pricing" style={{padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)", background:"#f8fafc", borderTop:"1px solid rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1280, margin:"0 auto"}}>

          {/* Heading */}
          <div style={{textAlign:"center", marginBottom:64}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#16a34a",textTransform:"uppercase",marginBottom:18}}>
              Simple Pricing
            </div>
            <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:16,color:"#0a0a0a"}}>
              Scale without limits
            </h2>
            <p style={{fontSize:16,color:"rgba(0,0,0,0.5)",maxWidth:520,margin:"0 auto 28px",lineHeight:1.7}}>
              No subscription fees. 25% markup on all plans. Pay only per message sent.
            </p>
            {/* Limited time banner */}
            <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,#fef3c7,#fde68a)",border:"1.5px solid #f59e0b",borderRadius:100,padding:"9px 22px",fontSize:12.5,fontWeight:800,color:"#92400e",boxShadow:"0 4px 14px rgba(245,158,11,0.18)"}}>
              🎉 &nbsp;Limited Time — Pro plan is completely <span style={{color:"#b45309",textDecoration:"underline",textUnderlineOffset:3}}>FREE</span> right now
            </div>
          </div>

          {/* Cards */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24, alignItems:"center"}}>
            {plans.map((p, i) => (
              <div key={i} style={{
                position:"relative",
                borderRadius: p.popular ? 32 : 26,
                background: p.popular ? "#0f172a" : "#fff",
                border: p.popular ? "none" : "1px solid rgba(0,0,0,0.08)",
                padding:"40px 32px",
                boxShadow: p.popular ? "0 40px 80px rgba(15,23,42,0.28), 0 0 0 1px rgba(37,211,102,0.12)" : "0 4px 20px rgba(0,0,0,0.04)",
                transform: p.popular ? "scale(1.05)" : "scale(1)",
                zIndex: p.popular ? 10 : 1,
                display:"flex", flexDirection:"column",
                overflow:"hidden",
                transition:"all 0.3s ease"
              }}>
                {/* Glow blob for Pro */}
                {p.popular && (
                  <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",background:"rgba(37,211,102,0.12)",filter:"blur(70px)",pointerEvents:"none"}}/>
                )}

                {/* MOST POPULAR chip */}
                {p.popular && (
                  <div style={{
                    position:"absolute", top:22, right:22,
                    background:"linear-gradient(135deg,#25d366,#16a34a)",
                    color:"#fff", fontSize:9, fontWeight:800,
                    padding:"5px 13px", borderRadius:100, letterSpacing:1.6,
                    textTransform:"uppercase", boxShadow:"0 4px 12px rgba(37,211,102,0.4)"
                  }}>🔥 LIMITED FREE</div>
                )}

                {/* Plan name */}
                <div style={{
                  fontSize:11, letterSpacing:2, textTransform:"uppercase",
                  fontWeight:800, marginBottom:20,
                  color: p.popular ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)"
                }}>{p.name}</div>

                {/* Price */}
                {p.originalPrice ? (
                  <div style={{marginBottom:8}}>
                    {/* Strikethrough original */}
                    <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:6}}>
                      <span style={{
                        fontSize:22, fontWeight:700,
                        color: "rgba(255,255,255,0.25)",
                        textDecoration:"line-through",
                        textDecorationThickness:2,
                        fontFamily:"'DM Mono',monospace",
                        letterSpacing:"-0.02em"
                      }}>{p.originalPrice}/mo</span>
                      <span style={{
                        fontSize:10, fontWeight:800, color:"#25d366",
                        background:"rgba(37,211,102,0.15)",
                        padding:"4px 10px", borderRadius:100,
                        border:"1px solid rgba(37,211,102,0.3)",
                        letterSpacing:1
                      }}>100% OFF</span>
                    </div>
                    {/* Free price big */}
                    <div style={{display:"flex", alignItems:"baseline", gap:8}}>
                      <span style={{
                        fontSize:58, fontWeight:900,
                        letterSpacing:"-0.05em", lineHeight:1,
                        background:"linear-gradient(135deg,#25d366,#4ade80)",
                        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
                      }}>Free</span>
                    </div>
                  </div>
                ) : (
                  <div style={{marginBottom:8, display:"flex", alignItems:"baseline", gap:6}}>
                    <span style={{
                      fontSize:52, fontWeight:900, letterSpacing:"-0.05em", lineHeight:1,
                      color: p.popular ? "#fff" : "#0a0a0a"
                    }}>{p.price}</span>
                    {p.price !== "Free" && p.price !== "Custom" && (
                      <span style={{fontSize:14, color:"rgba(0,0,0,0.4)", fontWeight:500}}>/mo</span>
                    )}
                  </div>
                )}

                <div style={{
                  fontSize:13, marginBottom:20, minHeight:38, lineHeight:1.6,
                  color: p.popular ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)"
                }}>{p.sub}</div>

                {/* ── Key stats pills ── */}
                {p.meta && (
                  <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:22}}>
                    {p.meta.map((m, mi) => (
                      <div key={mi} style={{
                        display:"flex", alignItems:"center", gap:10,
                        background: p.popular ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                        border: p.popular ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.07)",
                        borderRadius:10, padding:"9px 12px",
                      }}>
                        <span style={{fontSize:14, flexShrink:0}}>{m.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12, fontWeight:800, color: p.popular ? "#fff" : "#0a0a0a", lineHeight:1.2}}>{m.label}</div>
                          <div style={{fontSize:10, color: p.popular ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)", marginTop:1}}>{m.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div style={{height:1, background: p.popular ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", marginBottom:20}}/>

                {/* Features */}
                <ul style={{listStyle:"none", display:"flex", flexDirection:"column", gap:11, marginBottom:32, flex:1, padding:0}}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{display:"flex", alignItems:"flex-start", gap:11, fontSize:13, color: p.popular ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)"}}>
                      <CheckIcon dark={p.popular}/>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => p.popular ? window.open("https://wa.me/917499835687?text=Hi!%20I'm%20interested%20in%20the%20WPLeads%20Pro%20plan.%20Can%20we%20talk?", "_blank") : p.price === "Custom" ? navigate("/contact") : navigate("/register")}
                  style={{
                    width:"100%", padding:"16px 0", borderRadius:14,
                    fontSize:14, fontWeight:800, cursor:"pointer", border:"none",
                    transition:"all 0.25s",
                    background: p.popular
                      ? "linear-gradient(135deg,#25d366,#16a34a)"
                      : p.name === "Enterprise"
                        ? "#0f172a"
                        : "rgba(0,0,0,0.06)",
                    color: p.popular || p.name === "Enterprise" ? "#fff" : "#111",
                    boxShadow: p.popular ? "0 10px 28px rgba(37,211,102,0.38)" : "none",
                    letterSpacing:0.3
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.92"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
                >
                  {p.cta} →
                </button>
              </div>
            ))}
          </div>

          <PricingComparisonSection />
        </div>
      </section>

      {/* ══ UPGRADED TESTIMONIALS (WhatsApp Chat Style) ══ */}
      <section id="reviews" style={{
        padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)",
        background:"#efeae2", // WhatsApp web background color
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M50 50v-10h-4v10h-10v4h10v10h4v-10h10v-4H50zM10 10V0H6v10H-4v4h10v10h4V14h10v-4H10z'/%3E%3C/g%3E%3C/svg%3E")`,
        maxWidth:"100%"
      }}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.6)",border:"1px solid rgba(0,0,0,0.1)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#111",textTransform:"uppercase",marginBottom:18}}>Testimonials</div>
            <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,color:"#0a0a0a"}}>Loved by founders</h2>
          </div>
          
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:24}}>
            {testimonials.map((t,i)=>(
              <div key={i} style={{
                background:"#fff", borderRadius:"0 24px 24px 24px", padding: 28, position: "relative",
                boxShadow:"0 8px 24px rgba(0,0,0,0.04)", transition: "transform 0.3s"
              }}
              onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                {/* Chat Tail SVG */}
                <svg style={{position:"absolute", top:0, left:-12}} width="12" height="16" viewBox="0 0 12 16" fill="none"><path d="M0 0H12V16C12 16 12 0 0 0Z" fill="#fff"/></svg>
                
                <div style={{display:"flex",gap:4,marginBottom:16}}>
                  {[1,2,3,4,5].map(s=><span key={s} style={{color:"#00a884",fontSize:16}}>★</span>)}
                </div>
                <p style={{fontSize:16,color:"#111",lineHeight:1.6,marginBottom:24}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:t.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:"#0a0a0a"}}>{t.name}</div>
                    <div style={{fontSize:12,color:"rgba(0,0,0,0.5)", marginTop:2}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPGRADED CTA (Dark Premium Feel) ══ */}
      <section style={{padding:"clamp(60px,8vw,100px) clamp(20px,5vw,60px)",maxWidth:1280,margin:"0 auto"}}>
        <div style={{
          background:"linear-gradient(135deg, #022c22 0%, #065f56 100%)",
          borderRadius: 36, padding: "clamp(60px, 8vw, 100px) 20px", textAlign: "center", position: "relative", overflow: "hidden",
          boxShadow: "0 24px 60px rgba(6, 95, 86, 0.3)"
        }}>
          {/* Decorative giant icon */}
          <div style={{position:"absolute", top:-60, right:-40, opacity:0.05, transform:"rotate(15deg)"}}>
            <WaIcon size={400} color="#fff"/>
          </div>
          
          <div style={{position:"relative",zIndex:1}}>
            <h2 style={{fontSize:"clamp(34px,5vw,56px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:20,color:"#fff"}}>
              Your WhatsApp bot is<br/>
              <span style={{color:"#4ade80"}}>5 minutes away</span>
            </h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",margin:"0 auto 40px",lineHeight:1.7,maxWidth:420}}>
              Pro plan is free forever. No credit card required. Pay only per message sent.
            </p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>navigate("/register")} style={{display:"inline-flex",alignItems:"center",gap:10,background:"#fff",color:"#065f56",border:"none",borderRadius:14,padding:"16px 32px",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 12px 32px rgba(0,0,0,0.2)",transition:"all 0.2s",fontFamily:"inherit"}}
                onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                <WaIcon size={18} color="#065f56"/> Create free account
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}