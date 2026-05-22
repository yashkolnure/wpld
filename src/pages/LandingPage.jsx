import { useState, useEffect, useRef } from "react";
import WorkflowBuilderPreview from "../components/WorkflowBuilderPreview";

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
   HERO ILLUSTRATION (Unchanged)
───────────────────────────── */
const CHAT = [
  { type:"bot",  text:"Hi! 👋 Welcome to WPLeads.\nHow can I help you today?", btns:["Browse Plans","See Features","Talk to Sales"] },
  { type:"user", text:"Browse Plans" },
  { type:"bot",  text:"Great! 🎉 Plans start from ₹0/month.\nStarter is free forever!" },
  { type:"user", text:"Wow, free forever? That's amazing!" },
];

function HeroIllustration() {
  const [msgs, setMsgs]     = useState([]);
  const [typing, setTyping] = useState(false);
  const chatRef             = useRef(null);

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  },[msgs,typing]);

  useEffect(()=>{
    let t;
    const run=(i)=>{
      if(i>=CHAT.length){ t=setTimeout(()=>{ setMsgs([]); setTyping(false); t=setTimeout(()=>run(0),700); },4500); return; }
      const s=CHAT[i];
      if(s.type==="bot"){ setTyping(true); t=setTimeout(()=>{ setTyping(false); setMsgs(p=>[...p,s]); t=setTimeout(()=>run(i+1),1500); },1300); }
      else { t=setTimeout(()=>{ setMsgs(p=>[...p,s]); t=setTimeout(()=>run(i+1),900); },500); }
    };
    t=setTimeout(()=>run(0),600);
    return ()=>clearTimeout(t);
  },[]);

  const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});

  return (
    <div style={{position:"relative",width:"100%",height:600,overflow:"visible"}}>
      <div style={{position:"absolute",top:-80,right:-60,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,211,102,0.13) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-40,left:-20,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>

      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%) perspective(1200px) rotateY(-10deg) rotateX(3deg)",
        transformStyle:"preserve-3d", animation:"wpl-float 6s ease-in-out infinite",
        filter:"drop-shadow(0 40px 60px rgba(0,0,0,0.22)) drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
        zIndex:10, width:230,
      }}>
        <div style={{background:"linear-gradient(170deg,#1c1c2e 0%,#12122a 100%)",borderRadius:38,padding:"10px 8px",border:"1.5px solid rgba(255,255,255,0.1)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08)"}}>
          <div style={{background:"#0c0c1c",borderRadius:30,overflow:"hidden"}}>
            <div style={{height:26,background:"#0c0c1c",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:56,height:5,background:"rgba(255,255,255,0.12)",borderRadius:10}}/>
            </div>
            <div style={{background:"linear-gradient(90deg,#065f56,#0d9488)",padding:"10px 12px",display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,boxShadow:"0 2px 8px rgba(37,211,102,0.4)"}}>🤖</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontSize:10.5,fontWeight:700,fontFamily:"system-ui"}}>WPLeads Bot</div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:"#4ade80",animation:"wpl-ping 1.8s ease-in-out infinite"}}/>
                  <span style={{color:"rgba(255,255,255,0.55)",fontSize:8,fontFamily:"system-ui"}}>online</span>
                </div>
              </div>
            </div>
            <div ref={chatRef} style={{
              height:320,padding:"10px 9px",display:"flex",flexDirection:"column",gap:7,
              overflowY:"auto",background:"#ece5dd",scrollBehavior:"smooth",
              backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M50 50v-10h-4v10h-10v4h10v10h4v-10h10v-4H50zM10 10V0H6v10H-4v4h10v10h4V14h10v-4H10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}>
              <div style={{textAlign:"center",fontSize:8,color:"#8a9ba8",background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"2px 10px",alignSelf:"center",fontFamily:"system-ui",fontWeight:600}}>TODAY</div>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",maxWidth:"84%",alignSelf:m.type==="user"?"flex-end":"flex-start",animation:"wpl-fadeup 0.3s ease both"}}>
                  <div style={{
                    borderRadius:m.type==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                    padding:"8px 10px", background:m.type==="user"?"#d9fdd3":"#fff",
                    fontSize:9.5,lineHeight:1.55,color:"#111", boxShadow:"0 1px 3px rgba(0,0,0,0.08)",fontFamily:"system-ui",
                  }}>
                    {m.type==="bot"&&<div style={{fontSize:7.5,fontWeight:700,color:"#065f56",marginBottom:3,fontFamily:"monospace",letterSpacing:0.8,textTransform:"uppercase"}}>WPLeads Bot</div>}
                    <span style={{whiteSpace:"pre-line"}}>{m.text}</span>
                    {m.btns&&(
                      <div style={{marginTop:6,paddingTop:6,borderTop:"1px solid #e9ecef",display:"flex",flexDirection:"column",gap:3}}>
                        {m.btns.map(b=>(
                          <div key={b} style={{textAlign:"center",fontSize:8.5,color:"#065f56",fontWeight:700,border:"1px solid rgba(37,211,102,0.3)",borderRadius:7,padding:"3px 6px",background:"rgba(37,211,102,0.05)"}}>{b}</div>
                        ))}
                      </div>
                    )}
                    <div style={{fontSize:7,color:"#94a3b8",textAlign:"right",marginTop:3,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:2,fontFamily:"system-ui"}}>
                      {now}
                      {m.type==="user"&&<svg width="11" height="7" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L5 9.5L10 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L10 9.5L15 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                </div>
              ))}
              {typing&&(
                <div style={{alignSelf:"flex-start",background:"#fff",borderRadius:"16px 16px 16px 4px",padding:"10px 14px",display:"flex",gap:5,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
                  {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#b0bec5",display:"block",animation:`wpl-bounce 1.1s ease-in-out ${i*0.18}s infinite`}}/>)}
                </div>
              )}
            </div>
            <div style={{background:"#f0f0f0",padding:"7px 10px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,background:"#fff",borderRadius:22,padding:"5px 12px",fontSize:8.5,color:"#adb5bd",fontFamily:"system-ui"}}>Type a message…</div>
              <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(37,211,102,0.35)"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              </div>
            </div>
            <div style={{height:18,background:"#0c0c1c",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:40,height:3,background:"rgba(255,255,255,0.2)",borderRadius:10}}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{position:"absolute",top:30,left:"-5%",zIndex:20,animation:"wpl-float2 5s ease-in-out infinite",filter:"drop-shadow(0 10px 28px rgba(0,0,0,0.12))"}}>
        <div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"13px 16px",maxWidth:210,boxShadow:"0 4px 24px rgba(0,0,0,0.09)",border:"1px solid rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:8,fontWeight:700,color:"#065f56",marginBottom:5,fontFamily:"system-ui",letterSpacing:0.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#25d366",animation:"wpl-ping 1.5s ease-in-out infinite"}}/>
            WPLeads Bot
          </div>
          <div style={{fontSize:12,color:"#111",fontFamily:"system-ui",lineHeight:1.55}}>⚡ Keyword <strong style={{color:"#065f56"}}>"hi"</strong> detected</div>
          <div style={{fontSize:11,color:"#6b7280",fontFamily:"system-ui",lineHeight:1.5,marginTop:2}}>Workflow triggered in <strong style={{color:"#25d366"}}>0ms</strong></div>
          <div style={{fontSize:9,color:"#adb5bd",textAlign:"right",marginTop:6,fontFamily:"system-ui"}}>11:42</div>
        </div>
      </div>

      <div style={{position:"absolute",bottom:55,right:"-8%",zIndex:20,animation:"wpl-float3 5.5s ease-in-out infinite 0.5s",filter:"drop-shadow(0 8px 22px rgba(0,0,0,0.10))"}}>
        <div style={{background:"#d9fdd3",borderRadius:"18px 18px 4px 18px",padding:"12px 15px",maxWidth:200,boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid rgba(37,211,102,0.15)"}}>
          <div style={{fontSize:12,color:"#111",fontFamily:"system-ui",lineHeight:1.55}}>Wow, free forever?<br/>That's amazing! 🤩</div>
          <div style={{fontSize:9,color:"#94a3b8",textAlign:"right",marginTop:6,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3,fontFamily:"system-ui"}}>
            11:43
            <svg width="13" height="8" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L5 9.5L10 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L10 9.5L15 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      <div style={{position:"absolute",bottom:20,left:"-8%",zIndex:20,animation:"wpl-float2 7s ease-in-out infinite 1s",filter:"drop-shadow(0 14px 32px rgba(0,0,0,0.13))"}}>
        <div style={{background:"#fff",borderRadius:20,padding:"16px 18px",width:200,boxShadow:"0 4px 28px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:8.5,fontWeight:700,color:"rgba(0,0,0,0.3)",fontFamily:"system-ui",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>Active Workflow</div>
          {[
            {icon:"⚡",label:'Keyword: "hi"',   color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0"},
            {icon:"💬",label:"Send welcome msg", color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe"},
            {icon:"🔀",label:"Branch on reply",  color:"#b45309", bg:"#fffbeb", border:"#fde68a"},
          ].map((n,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:10,background:n.bg,border:`1px solid ${n.border}`}}>
                <span style={{fontSize:12}}>{n.icon}</span>
                <span style={{fontSize:10.5,fontWeight:600,color:"#1a1a1a",fontFamily:"system-ui"}}>{n.label}</span>
              </div>
              {i<2&&<div style={{width:2,height:8,background:"rgba(0,0,0,0.07)",borderRadius:1}}/>}
            </div>
          ))}
          <div style={{marginTop:10,padding:"7px 9px",background:"rgba(37,211,102,0.07)",borderRadius:10,display:"flex",alignItems:"center",gap:7,border:"1px solid rgba(37,211,102,0.18)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#25d366",flexShrink:0,animation:"wpl-ping 1.5s ease-in-out infinite"}}/>
            <span style={{fontSize:10,fontWeight:700,color:"#15803d",fontFamily:"system-ui"}}>Live · 0ms response</span>
          </div>
        </div>
      </div>

      <div style={{position:"absolute",top:50,right:"-5%",zIndex:20,animation:"wpl-float3 6s ease-in-out infinite 0.8s",filter:"drop-shadow(0 6px 18px rgba(0,0,0,0.10))"}}>
        <div style={{background:"#fff",borderRadius:50,padding:"11px 18px",display:"flex",alignItems:"center",gap:11,boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.05)"}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(37,211,102,0.35)"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:"#111",fontFamily:"system-ui",letterSpacing:"-0.04em",lineHeight:1}}>98M+</div>
            <div style={{fontSize:9.5,color:"#6b7280",fontFamily:"system-ui",marginTop:2}}>messages sent</div>
          </div>
        </div>
      </div>

      <div style={{position:"absolute",top:"42%",right:"-3%",zIndex:15,animation:"wpl-float2 8s ease-in-out infinite 2s",filter:"drop-shadow(0 6px 20px rgba(37,211,102,0.28))"}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.35)"}}>
          <WaIcon size={26} color="#fff"/>
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
    features: [
      "1 Active Workflow",
      "Basic Message Types",
      "1 WhatsApp Number",
      "Community Support",
      "Pay-per-message wallet"
    ]
  },
  {
    name: "Pro",
    price: "Free",
    sub: "All features included — no card needed",
    cta: "Start for free",
    popular: true,
    features: [
      "Unlimited Workflows",
      "Bulk Cold Outreach",
      "Broadcast Campaigns",
      "Template Management",
      "All Interactive Message Types",
      "Built-in CRM & Contact Tags",
      "Wallet & Pay-per-message",
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
   PHONE MOCKUP COMPONENT
───────────────────────────── */
function WaPhone({ messages, brandName, brandEmoji = "🤖", headerBg = "linear-gradient(90deg,#065f56,#0d9488)" }) {
  return (
    <div style={{
      width: 260, margin: "0 auto",
      filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.18)) drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
    }}>
      {/* Phone shell */}
      <div style={{ background: "linear-gradient(170deg,#1c1c2e,#12122a)", borderRadius: 40, padding: "10px 8px", border: "1.5px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        <div style={{ background: "#0c0c1c", borderRadius: 33, overflow: "hidden" }}>
          {/* Notch */}
          <div style={{ height: 26, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 56, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 10 }} />
          </div>
          {/* WA Header */}
          <div style={{ background: headerBg, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#25d366,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, boxShadow: "0 2px 8px rgba(37,211,102,0.4)" }}>{brandEmoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "system-ui" }}>{brandName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "wpl-ping 1.8s ease-in-out infinite" }} />
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 8, fontFamily: "system-ui" }}>online</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.75a16 16 0 006.13 6.13l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
          </div>
          {/* Chat area */}
          <div style={{ minHeight: 320, padding: "10px 9px", display: "flex", flexDirection: "column", gap: 7, background: "#ece5dd", backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M50 50v-10h-4v10h-10v4h10v10h4v-10h10v-4H50z'/%3E%3C/g%3E%3C/svg%3E")` }}>
            <div style={{ textAlign: "center", fontSize: 8, color: "#8a9ba8", background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "2px 10px", alignSelf: "center", fontFamily: "system-ui", fontWeight: 600 }}>TODAY</div>
            {messages.map((m, i) => (
              <div key={i}>
                {m.type === "image" && (
                  <div style={{ borderRadius: "12px 12px 12px 4px", overflow: "hidden", maxWidth: "84%", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
                    <div style={{ background: m.bg || "linear-gradient(135deg,#0d9488,#065f56)", height: 90, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 22 }}>{m.emoji || "🖼️"}</span>
                      <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "system-ui" }}>{m.label}</span>
                    </div>
                  </div>
                )}
                {m.type === "bot" && (
                  <div style={{ maxWidth: "84%", alignSelf: "flex-start", animation: "wpl-fadeup 0.3s ease both" }}>
                    <div style={{ borderRadius: "12px 12px 12px 4px", padding: "8px 10px", background: "#fff", fontSize: 9.5, lineHeight: 1.55, color: "#111", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", fontFamily: "system-ui" }}>
                      <div style={{ fontSize: 7.5, fontWeight: 700, color: "#065f56", marginBottom: 3, letterSpacing: 0.8, textTransform: "uppercase" }}>{brandName}</div>
                      <span style={{ whiteSpace: "pre-line" }}>{m.text}</span>
                      <div style={{ fontSize: 7, color: "#94a3b8", textAlign: "right", marginTop: 3 }}>10:14 am</div>
                    </div>
                  </div>
                )}
                {m.type === "buttons" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: "84%" }}>
                    {m.btns.map(b => (
                      <div key={b} style={{ textAlign: "center", fontSize: 9, color: "#065f56", fontWeight: 700, border: "1px solid rgba(37,211,102,0.35)", borderRadius: 8, padding: "5px 8px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "system-ui" }}>{b}</div>
                    ))}
                  </div>
                )}
                {m.type === "user" && (
                  <div style={{ maxWidth: "84%", alignSelf: "flex-end", marginLeft: "auto" }}>
                    <div style={{ borderRadius: "12px 12px 4px 12px", padding: "8px 10px", background: "#d9fdd3", fontSize: 9.5, lineHeight: 1.55, color: "#111", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", fontFamily: "system-ui" }}>
                      {m.text}
                      <div style={{ fontSize: 7, color: "#94a3b8", textAlign: "right", marginTop: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        10:14 am
                        <svg width="11" height="7" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L5 9.5L10 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 5.5L10 9.5L15 2" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Input bar */}
          <div style={{ background: "#f0f0f0", padding: "7px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 22, padding: "5px 12px", fontSize: 8.5, color: "#adb5bd", fontFamily: "system-ui" }}>Message</div>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#25d366,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V13H7v-2h6V6.07l6 5.43-6 5.43z" /></svg>
            </div>
          </div>
          {/* Bottom bar */}
          <div style={{ height: 18, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled,   setScrolled]   = useState(false);
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
        @keyframes wpl-float   {0%,100%{transform:translate(-50%,-50%) perspective(1200px) rotateY(-10deg) rotateX(3deg) translateY(0px)} 50%{transform:translate(-50%,-50%) perspective(1200px) rotateY(-10deg) rotateX(3deg) translateY(-12px)}}
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
<WorkflowBuilderPreview />
      {/* ══ USE CASES — PHONE MOCKUPS ══ */}
      <section style={{ padding: "clamp(80px,8vw,120px) clamp(20px,5vw,60px)", background: "#f8fafc", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 500, letterSpacing: 2, color: "#16a34a", textTransform: "uppercase", marginBottom: 18 }}>Real Use Cases</div>
            <h2 style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 16, color: "#0a0a0a" }}>See WPLeads in action</h2>
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
              <div style={{ animation: "wpl-float2 6s ease-in-out infinite", zIndex: 10 }}>
                <WaPhone
                  brandName="ABC Store ✓"
                  brandEmoji="🛒"
                  messages={[
                    { type: "image", emoji: "🛍️", label: "Online Store", bg: "linear-gradient(135deg,#0d9488,#065f56)" },
                    { type: "bot", text: "Hi Amit,\n\nWelcome to ABC Store on WhatsApp! 🏪\nHow can we assist you today?" },
                    { type: "buttons", btns: ["Get Exclusive Offers", "Track My Order", "Get Help from Support"] },
                    { type: "user", text: "Get Exclusive Offers" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* ── Use Case 2: Restaurants / Food ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 60, alignItems: "center", marginBottom: 110 }}>
            {/* Phone + floating elements */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 520, order: isMobile ? 1 : 0 }}>
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
              <div style={{ animation: "wpl-float3 7s ease-in-out infinite", zIndex: 10 }}>
                <WaPhone
                  brandName="Spice Restaurant ✓"
                  brandEmoji="🍛"
                  headerBg="linear-gradient(90deg,#b45309,#d97706)"
                  messages={[
                    { type: "image", emoji: "🍛", label: "Today's Special", bg: "linear-gradient(135deg,#d97706,#b45309)" },
                    { type: "bot", text: "Hello Riya,\nYour order at Spice Restaurant is confirmed. 🎉\n\n📋 Order ID: #SG7845\n🍽️ Paneer Masala, Naan (2)\n💰 ₹1,150 | Paid via UPI\n📍 45 MG Road, Bengaluru" },
                    { type: "buttons", btns: ["Track Order", "Contact Support"] },
                  ]}
                />
              </div>
            </div>
            {/* Text */}
            <div style={{ order: isMobile ? 0 : 1 }}>
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
            {/* Phone + Workflow nodes visual */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 540 }}>
              {/* Left: Flow Start Node */}
              <div style={{ position: "absolute", left: 0, top: "20%", background: "#fff", borderRadius: 14, padding: "14px 16px", width: 155, boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: "2px solid #16a34a", zIndex: 20, animation: "wpl-float2 5s ease-in-out infinite" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 20, background: "#16a34a", borderRadius: 3 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#16a34a" }}>⚡ Flow Start</span>
                </div>
                {["hi", "hello", "start"].map(k => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "4px 8px", marginBottom: 4, fontSize: 10.5, color: "#0a0a0a", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>
                    {k} <span style={{ color: "#94a3b8", fontSize: 10 }}>×</span>
                  </div>
                ))}
                {/* Arrow */}
                <svg style={{ position: "absolute", right: -26, top: "55%", transform: "translateY(-50%)" }} width="26" height="12" viewBox="0 0 26 12">
                  <path d="M0 6h22M16 1l6 5-6 5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 2" fill="none" />
                </svg>
              </div>
              {/* Left bottom: Message Node */}
              <div style={{ position: "absolute", left: 0, bottom: "15%", background: "#fff", borderRadius: 14, padding: "14px 16px", width: 155, boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: "2px solid #2563eb", zIndex: 20, animation: "wpl-float3 6s ease-in-out infinite 0.8s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 20, background: "#2563eb", borderRadius: 3 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#2563eb" }}>💬 Message</span>
                </div>
                <div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.5, background: "#f8fafc", borderRadius: 8, padding: "8px 10px", border: "1px solid #e2e8f0" }}>
                  Hello {"{name}"}!<br />How can we assist<br />you today?
                </div>
                <svg style={{ position: "absolute", right: -26, top: "50%", transform: "translateY(-50%)" }} width="26" height="12" viewBox="0 0 26 12">
                  <path d="M0 6h22M16 1l6 5-6 5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 2" fill="none" />
                </svg>
              </div>
              {/* Phone center */}
              <div style={{ animation: "wpl-float2 7s ease-in-out infinite", zIndex: 10 }}>
                <WaPhone
                  brandName="ADNEC Group ✓"
                  brandEmoji="🏢"
                  headerBg="linear-gradient(90deg,#1d4ed8,#2563eb)"
                  messages={[
                    { type: "user", text: "Hello" },
                    { type: "bot", text: "Hello Saurabh!\nHow can we assist you today?" },
                    { type: "buttons", btns: ["Upcoming Events", "Explore other options"] },
                  ]}
                />
              </div>
              {/* Right: Media + Buttons card */}
              <div style={{ position: "absolute", right: 0, top: "10%", background: "#fff", borderRadius: 14, padding: "14px 16px", width: 155, boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: "2px solid #8b5cf6", zIndex: 20, animation: "wpl-float3 5.5s ease-in-out infinite 0.4s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 20, background: "#8b5cf6", borderRadius: 3 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#8b5cf6" }}>🖼️ Media + Buttons</span>
                </div>
                <div style={{ height: 60, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", borderRadius: 8, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎪</div>
                <div style={{ fontSize: 9, color: "#374151", lineHeight: 1.4, marginBottom: 6 }}>The summit event details...</div>
                <div style={{ textAlign: "center", fontSize: 9.5, color: "#8b5cf6", fontWeight: 700, border: "1px solid rgba(139,92,246,0.3)", borderRadius: 6, padding: "3px 0" }}>× Register</div>
              </div>
              {/* Right bottom: Message node */}
              <div style={{ position: "absolute", right: 0, bottom: "12%", background: "#fff", borderRadius: 14, padding: "12px 14px", width: 155, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "2px solid #0d9488", zIndex: 20, animation: "wpl-float2 6s ease-in-out infinite 1.5s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 20, background: "#0d9488", borderRadius: 3 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#0d9488" }}>💬 Message</span>
                </div>
                <div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.4 }}>You can find upcoming events on our website.</div>
              </div>
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

          {/* Feature 2: Broadcast Campaigns */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))",gap:60,alignItems:"center",marginBottom:100}}>
            <div style={{order:isMobile?0:1}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:600,letterSpacing:1.5,color:"#2563eb",textTransform:"uppercase",marginBottom:20}}>📢 Broadcast Campaigns</div>
              <h3 style={{fontSize:"clamp(28px,3vw,40px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16,color:"#0a0a0a"}}>Target your contacts<br/>by tag or activity</h3>
              <p style={{fontSize:16,color:"rgba(0,0,0,0.55)",lineHeight:1.7,marginBottom:28}}>Send broadcast messages to your saved contacts. Filter by tag (e.g. "leads", "customers") or only target people who messaged in the last 24 hours — and pay the cheaper service rate.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[
                  {icon:"🏷️", text:"Filter by contact tags for laser-targeted sends"},
                  {icon:"⏱️", text:"24-hour active filter saves up to 78% on message costs"},
                  {icon:"📩", text:"Support for text, buttons, lists, images & templates"},
                  {icon:"📈", text:"Real-time delivery and read receipt tracking"},
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,fontSize:14.5,color:"rgba(0,0,0,0.65)"}}>
                    <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{f.icon}</span>{f.text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{order:isMobile?1:0,background:"#fff",borderRadius:24,padding:"28px",boxShadow:"0 24px 60px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#0a0a0a",marginBottom:20}}>Create Broadcast</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"12px 16px",borderRadius:12,background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:10,color:"#94a3b8",marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Filter by tag</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["leads","customers","vip","follow-up"].map((t,i)=>(
                      <span key={t} style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:i<2?"#dcfce7":"#f1f5f9",color:i<2?"#16a34a":"#64748b",border:i<2?"1px solid #bbf7d0":"1px solid #e2e8f0"}}>{t} {i<2?"✓":""}</span>
                    ))}
                  </div>
                </div>
                <div style={{padding:"12px 16px",borderRadius:12,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Active in last 24h only</div>
                    <div style={{fontSize:12,color:"#0a0a0a",fontWeight:700}}>348 contacts · ₹0.20/msg</div>
                  </div>
                  <div style={{width:36,height:20,borderRadius:10,background:"#25d366",display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 4px"}}>
                    <div style={{width:14,height:14,borderRadius:"50%",background:"#fff"}}/>
                  </div>
                </div>
                <div style={{padding:"14px 16px",borderRadius:12,background:"linear-gradient(135deg,#25d366,#16a34a)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:800,color:"#fff"}}>Estimated cost</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>348 contacts × ₹0.20</div>
                  </div>
                  <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>₹69.60</div>
                </div>
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

      {/* ══ UPGRADED HOW IT WORKS ══ */}
      <section id="how-it-works" style={{padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)",background:"#f8fafc",maxWidth:"100%", borderTop:"1px solid rgba(0,0,0,0.04)", borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:40,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:2,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#16a34a",textTransform:"uppercase",marginBottom:18}}>Fast Setup</div>
            <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:16,color:"#0a0a0a"}}>Live in under<br/>5 minutes</h2>
            <p style={{fontSize:16,color:"rgba(0,0,0,0.5)",lineHeight:1.7,marginBottom:44}}>No developer needed. No complex setup. Connect your account, build your flow, and go live.</p>
            
            <div style={{display:"flex",flexDirection:"column", gap:0}}>
              {steps.map((s,i)=>(
                <div key={i} onClick={()=>setActiveStep(i)} style={{
                  display:"flex", gap:20, padding: 20, borderRadius: 20, cursor:"pointer", transition: "all 0.3s ease",
                  background: activeStep === i ? "#fff" : "transparent",
                  border: activeStep === i ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
                  boxShadow: activeStep === i ? "0 12px 24px rgba(0,0,0,0.03)" : "none"
                }}>
                  <div style={{
                    width:48, height:48, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, fontWeight:900, fontFamily:"'DM Mono',monospace", transition:"all 0.3s",
                    background: activeStep===i ? "linear-gradient(135deg,#25d366,#16a34a)" : "rgba(0,0,0,0.04)",
                    color: activeStep===i ? "#fff" : "rgba(0,0,0,0.3)",
                    boxShadow: activeStep===i ? "0 8px 20px rgba(37,211,102,0.25)" : "none"
                  }}>{s.n}</div>
                  <div style={{flex:1, paddingTop:2}}>
                    <div style={{fontSize:16, fontWeight:800, marginBottom:6, color:activeStep===i?"#111":"rgba(0,0,0,0.5)", transition:"color 0.3s"}}>{s.title}</div>
                    <div style={{fontSize:14, color:"rgba(0,0,0,0.5)", lineHeight:1.6, height: activeStep===i ? "auto" : 0, overflow:"hidden", opacity: activeStep===i ? 1 : 0, transition:"opacity 0.3s"}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgraded Dynamic Terminal */}
          <div style={{background:"#0f172a",borderRadius:28, minHeight: 500,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{background:"#1e293b",padding:"16px 20px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",gap:6}}>{["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:12,height:12,borderRadius:"50%",background:c}}/>)}</div>
              <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"rgba(255,255,255,0.4)",letterSpacing:2,marginLeft:10}}>DEPLOYMENT LOG</span>
            </div>
            <div style={{padding:"32px", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.8}}>
              {[
                {step: 0, text: "> Auth check: Verifying Meta credentials..."},
                {step: 0, text: "> Status: 200 OK (Authenticated)", color: "#4ade80"},
                {step: 1, text: "> Registering Webhook URL endpoint..."},
                {step: 1, text: "> Callback attached successfully.", color: "#4ade80"},
                {step: 2, text: "> Compiling visual nodes to JSON payload..."},
                {step: 2, text: "> Nodes valid. Branching logic mapped.", color: "#4ade80"},
                {step: 3, text: "> Deploying workflow to edge network..."},
                {step: 3, text: "> SYSTEM LIVE. 0ms Latency.", color: "#4ade80", highlight: true},
              ].map((line, idx) => (
                <div key={idx} style={{
                  opacity: activeStep >= line.step ? 1 : 0.2, 
                  color: line.color || "rgba(255,255,255,0.7)",
                  background: (line.highlight && activeStep >= 3) ? "rgba(74, 222, 128, 0.15)" : "transparent",
                  padding: line.highlight ? "4px 8px" : "2px 0",
                  borderRadius: 6,
                  transition: "opacity 0.4s ease",
                  marginBottom: 8
                }}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ UPGRADED PRICING ══ */}
      <section id="pricing" style={{padding:"clamp(80px,8vw,120px) clamp(20px,5vw,60px)",maxWidth:1280,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:70}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:100,padding:"5px 14px",fontSize:10.5,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:2,color:"#16a34a",textTransform:"uppercase",marginBottom:18}}>Simple Pricing</div>
          <h2 style={{fontSize:"clamp(34px,4vw,52px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:16,color:"#0a0a0a"}}>Scale without limits</h2>
          <p style={{fontSize:16,color:"rgba(0,0,0,0.5)",maxWidth:460,margin:"0 auto",lineHeight:1.7}}>No subscription fees. Pay only per message sent — starting at ₹0.20/msg.</p>
        </div>
        
        
<div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24, maxWidth:1100, margin:"0 auto", alignItems:"stretch"}}>
  {plans.map((p, i) => (
    <div key={i} style={{
      borderRadius: p.popular ? 32 : 28, 
      padding: p.popular ? 3 : 1, // Subtle gradient border
      background: p.popular ? "linear-gradient(135deg, #25d366, #16a34a)" : "rgba(0,0,0,0.1)",
      transform: p.popular ? "scale(1.02)" : "scale(1)",
      boxShadow: p.popular ? "0 32px 64px rgba(37,211,102,0.18)" : "0 4px 12px rgba(0,0,0,0.03)",
      position: "relative", 
      zIndex: p.popular ? 10 : 1,
      transition: "all 0.3s ease"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: p.popular ? 29 : 27,
        padding: "40px 32px", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column"
      }}>
        {p.popular && (
          <div style={{position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#16a34a", color:"#fff", fontSize:10, fontWeight:800, fontFamily:"monospace", letterSpacing:1.5, padding:"6px 16px", borderRadius:100}}>
            MOST POPULAR
          </div>
        )}
        
        <div style={{fontSize:11, color:"rgba(0,0,0,0.4)", letterSpacing:2, textTransform:"uppercase", marginBottom:12, fontWeight: 700}}>{p.name}</div>
        
        <div style={{marginBottom:6, display: "flex", alignItems: "baseline", gap: 8}}>
          <span style={{fontSize:40, fontWeight:900, letterSpacing:"-0.04em", color:"#0a0a0a"}}>{p.price}</span>
          {p.originalPrice && (
            <span style={{fontSize:18, color:"rgba(0,0,0,0.3)", textDecoration:"line-through", fontWeight:500}}>{p.originalPrice}</span>
          )}
          {/* Only show /mo if price is numeric */}
          {(p.price !== "Free" && p.price !== "Custom") && (
            <span style={{fontSize:14, color:"rgba(0,0,0,0.4)", fontWeight:500}}>/mo</span>
          )}
        </div>
        
        <div style={{fontSize:13, color:"rgba(0,0,0,0.5)", marginBottom:32, minHeight: "40px"}}>{p.sub}</div>
        
        <ul style={{listStyle:"none", display:"flex", flexDirection:"column", gap:14, marginBottom:40, flex: 1, padding:0}}>
          {p.features.map((f, j) => (
            <li key={j} style={{
                display:"flex", 
                alignItems:"flex-start", 
                gap:12, 
                fontSize:14, 
                color: f.includes("WhatsApp API") ? "#16a34a" : "rgba(0,0,0,0.65)", // Highlight specific feature
                fontWeight: f.includes("WhatsApp API") ? "600" : "400"
              }}>
              <CheckIcon dark={p.popular} color={f.includes("WhatsApp API") ? "#16a34a" : undefined} /> 
              {f}
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => navigate(p.price === "Custom" ? "/contact" : "/register")} 
          style={{
            width:"100%", padding:"16px 0", borderRadius:14, fontSize:14, fontWeight:800, cursor:"pointer", border:"none", transition:"all 0.2s",
            background: p.popular ? "linear-gradient(135deg,#25d366,#16a34a)" : "rgba(0,0,0,0.06)",
            color: p.popular ? "#fff" : "#111",
          }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          {p.cta}
        </button>
      </div>
    </div>
  ))}
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