import React, { useState, useEffect } from "react";
import { WaIcon } from "./Icons";

export default function Footer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sections = [
    { title: "PRODUCT", links: ["Features", "How it Works", "Pricing", "Use Cases"] },
    { title: "COMPANY", links: ["About Us", "Privacy", "Terms", "FAQ"] },
    { title: "SUPPORT", links: ["Help Center", "Contact", "API Docs"] },
  ];

  return (
    <>
      <footer style={{ background: "#ffffff", paddingTop: "80px", borderTop: "1px solid #f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
          
          {/* MAIN TOP LANE */}
          <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "flex-start", 
            gap: "30px", 
            marginBottom: "80px",
            flexWrap: "nowrap" 
          }}>
            
            {/* 1. BRAND SECTION */}
            <div style={{ flex: "1.2", minWidth: "240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "20px" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <WaIcon size={16} color="#25d366" />
                </div>
                <span style={{ fontWeight: 900, fontSize: 20, color: "#0f172a", letterSpacing: "-0.5px" }}>WPLeads</span>
              </div>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                The smartest AI engine for lead capture. Turn every conversation into real growth.
                Create WhatsApp Flows like never before with our intuitive builder.      </p>
            </div>

            {/* 2. LINK COLUMNS */}
            {sections.map(sec => (
              <div key={sec.title} style={{ flex: "0.8", minWidth: "130px" }}>
                <h4 style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: 8, letterSpacing: "1px" }}>
                  <div style={{ width: 2, height: 12, background: "#25d366", borderRadius: 10 }} />
                  {sec.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {sec.links.map(link => (
                    <li key={link}>
                      <a href="#" 
                         style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: 500, transition: "0.2s" }} 
                         onMouseOver={e => e.target.style.color = "#0f172a"}
                         onMouseOut={e => e.target.style.color = "#64748b"}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 3. NEURAL LINK CARD */}
            <div style={{ flex: "1.5", minWidth: "320px" }}>
              <div style={{ 
                background: "rgba(15, 23, 42, 0.01)", 
                border: "1.2px solid #0f172a", 
                borderRadius: "18px", 
                padding: "20px",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25d366", boxShadow: "0 0 8px #25d366", animation: "wpl-ping 2s infinite" }} />
                    <span style={{ fontSize: "10px", fontWeight: 900, color: "#0f172a", letterSpacing: "0.5px" }}>NEURAL LINK ACTIVE</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a" }}>{time}</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", background: "#fff" }}>💾</div>
                    <div>
                      <div style={{ fontSize: "8px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Active Node</div>
                      <div style={{ fontSize: "10px", fontWeight: 700 }}>WPL-EDGE — <span style={{ color: "#64748b" }}>Cluster 01</span></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", background: "#fff" }}>📍</div>
                    <div>
                      <div style={{ fontSize: "8px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Location</div>
                      <div style={{ fontSize: "10px", fontWeight: 700 }}>Mumbai, IN</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "9px", fontWeight: 800, color: "#0f172a" }}>⚡ LATENCY: <span style={{color: "#25d366"}}>24MS</span></div>
                  <div style={{ fontSize: "9px", fontWeight: 800, color: "#6366f1", cursor: "pointer" }}>DETAILS</div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
              © 2026 WPLEADS SYSTEMS · AVENIRYA SOLUTIONS · YASH KOLNURE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10px", fontWeight: 800, color: "#64748b" }}>🛡️ AES-256</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10px", fontWeight: 800, color: "#64748b" }}>💎 META PARTNER</div>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>V2.0.45</div>
            </div>
          </div>
        </div>
{/* ------------------- WHATSAPP FLOATING WIDGET WITH WAVING BOT ------------------- */}
<div style={{ position: "fixed", bottom: "15px", right: "30px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
    
    {/* Animated Bot & Message Container */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px", position: "relative" }}>
        
        {/* The Waving Bot SVG */}
        <svg width="60" height="60" viewBox="0 0 100 100" style={{ marginBottom: "-10px", filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.1))" }}>
            {/* Bot Body */}
            <rect x="25" y="40" width="50" height="40" rx="15" fill="#0f172a" />
            <rect x="35" y="50" width="30" height="20" rx="5" fill="#1e293b" />
            {/* Eyes */}
            <circle cx="42" cy="60" r="3" fill="#25d366">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="60" r="3" fill="#25d366">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Waving Arm */}
            <g className="bot-arm" style={{ transformOrigin: "25px 55px", animation: "wa-wave 2s ease-in-out infinite" }}>
                <path d="M25 55 L10 40" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
                <circle cx="10" cy="40" r="5" fill="#25d366" />
            </g>
            {/* Static Arm */}
            <path d="M75 55 L90 70" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        </svg>

        {/* Popup Message */}
        <div style={{ 
            background: "#fff", 
            padding: "10px 18px", 
            borderRadius: "16px", 
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
            fontSize: "12px",
            fontWeight: 800,
            color: "#0f172a",
            border: "1.2px solid #0f172a",
            textAlign: "center",
            position: "relative",
            whiteSpace: "nowrap"
        }}>
            Chat with Our BOT on WhatsApp
            {/* Bubble Tip */}
            <div style={{ position: "absolute", bottom: "-7px", right: "25px", width: "12px", height: "12px", background: "#fff", transform: "rotate(45deg)", borderRight: "1.2px solid #0f172a", borderBottom: "1.2px solid #0f172a" }} />
        </div>
    </div>
    
    {/* Main WhatsApp Button */}
    <a 
        href="https://wa.me/917499835687?text=Hello!%20I'm%20interested%20in%20WhatsApp%20Automation." 
        target="_blank" 
        rel="noreferrer"
        style={{ 
            width: "65px", 
            height: "65px", 
            borderRadius: "50%", 
            background: "#25d366", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            cursor: "pointer",
            border: "3px solid #fff"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1.0) rotate(0deg)"}
    >
        <WaIcon size={35} color="#ffffff" />
    </a>

    <style>{`
      @keyframes wa-wave {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-30deg); }
      }
      @keyframes wa-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      /* Apply floating animation to the whole bot container */
      .wa-widget-container {
          animation: wa-float 4s ease-in-out infinite;
      }
    `}</style>
</div>

        <style>{`
          @keyframes wpl-ping { 0% { transform: scale(1); opacity: 1; } 70% { transform: scale(2); opacity: 0; } 100% { opacity: 0; } }
          @keyframes wa-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          @media (max-width: 1100px) {
            footer > div > div:first-child { flex-wrap: wrap !important; }
          }
        `}</style>
      </footer>
    </>
  );
}