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
          flexWrap: "nowrap" // Ensures they stay in one lane on desktop
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

          {/* 2. LINK COLUMNS (Mapped) */}
          {sections.map(sec => (
            <div key={sec.title} style={{ flex: "0.8", minWidth: "130px" }}>
              <h4 style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: 8, letterSpacing: "1px" }}>
                <div style={{ width: 2, height: 12, background: "#25d366", borderRadius: 10 }} />
                {sec.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {sec.links.map(link => (
                  <li key={link}><a href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: 500, transition: "0.2s" }} onMouseOver={e => e.target.style.color = "#0f172a"}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. NEURAL LINK CARD (Integrated into the lane) */}
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

      <style>{`
        @keyframes wpl-ping { 0% { transform: scale(1); opacity: 1; } 70% { transform: scale(2); opacity: 0; } 100% { opacity: 0; } }
        @media (max-width: 1100px) {
          footer > div > div:first-child { flex-wrap: wrap !important; }
        }
      `}</style>
    </footer>
  );
}