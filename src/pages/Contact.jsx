import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

const EMPTY = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null); // "success" | "error"
  const [errMsg, setErrMsg]   = useState("");

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${API}/api/contact-form`, form);
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0fdf8 0%,#f8fafc 100%)", fontFamily:"'DM Sans',sans-serif", color:"#111", display:"flex", alignItems:"center", justifyContent:"center", padding:"clamp(100px,12vw,140px) clamp(20px,5vw,40px) 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        .wpl-input{width:100%;padding:13px 16px;border-radius:12px;border:1px solid rgba(0,0,0,0.1);font-size:14px;font-family:'DM Sans',sans-serif;color:#0f172a;background:#fafafa;outline:none;transition:border 0.15s,background 0.15s;}
        .wpl-input:focus{border-color:#25d366;background:#fff;}
        .wpl-input.err{border-color:#ef4444;background:#fff5f5;}
        .wpl-input::placeholder{color:#94a3b8;}
        .wpl-btn{width:100%;padding:14px 24px;border-radius:50px;border:none;cursor:pointer;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;background:#0f172a;color:#fff;transition:background 0.2s,transform 0.2s;}
        .wpl-btn:hover:not(:disabled){background:#1e293b;transform:translateY(-1px);}
        .wpl-btn:disabled{opacity:0.6;cursor:not-allowed;}
      `}</style>

      <div style={{ width:"100%", maxWidth:560 }}>
        <div style={{ marginBottom:40, textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:900, color:"#94a3b8", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>CONTACT US</div>
          <h1 style={{ fontSize:"clamp(28px,4vw,40px)", fontWeight:900, letterSpacing:"-0.03em", color:"#0a0a0a", margin:"0 0 10px" }}>Get in touch</h1>
          <p style={{ fontSize:15, color:"rgba(0,0,0,0.5)", lineHeight:1.6 }}>We'll get back to you within one business day.</p>
        </div>

        {status === "success" ? (
          <div style={{ border:"1px solid rgba(37,211,102,0.25)", borderRadius:24, padding:"48px 40px", background:"#fff", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#f0fdf4", border:"2px solid #25d366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 20px" }}>✓</div>
            <h3 style={{ fontSize:20, fontWeight:900, color:"#0f172a", marginBottom:10 }}>Message sent!</h3>
            <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.6, marginBottom:28 }}>Thanks for reaching out. We'll reply to <strong>{form.email || "you"}</strong> within one business day.</p>
            <button
              onClick={() => setStatus(null)}
              style={{ padding:"12px 28px", borderRadius:50, border:"1px solid rgba(0,0,0,0.1)", background:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"#0f172a" }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ border:"1px solid rgba(0,0,0,0.07)", borderRadius:24, padding:"40px", background:"#fff" }}>

            {/* Name */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#0f172a", letterSpacing:0.4, textTransform:"uppercase", marginBottom:8 }}>
                Full Name <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <input
                className={`wpl-input${errors.name ? " err" : ""}`}
                type="text"
                placeholder="Yash Kolnure"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
              {errors.name && <p style={{ fontSize:12, color:"#ef4444", marginTop:5, fontWeight:600 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#0f172a", letterSpacing:0.4, textTransform:"uppercase", marginBottom:8 }}>
                Email Address <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <input
                className={`wpl-input${errors.email ? " err" : ""}`}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
              />
              {errors.email && <p style={{ fontSize:12, color:"#ef4444", marginTop:5, fontWeight:600 }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#0f172a", letterSpacing:0.4, textTransform:"uppercase", marginBottom:8 }}>
                Contact Number
              </label>
              <input
                className="wpl-input"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#0f172a", letterSpacing:0.4, textTransform:"uppercase", marginBottom:8 }}>
                Message / Query <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <textarea
                className={`wpl-input${errors.message ? " err" : ""}`}
                rows={5}
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={e => set("message", e.target.value)}
                style={{ resize:"vertical", minHeight:120 }}
              />
              {errors.message && <p style={{ fontSize:12, color:"#ef4444", marginTop:5, fontWeight:600 }}>{errors.message}</p>}
            </div>

            {/* Error banner */}
            {status === "error" && (
              <div style={{ background:"#fff5f5", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#dc2626", fontWeight:600 }}>
                {errMsg}
              </div>
            )}

            <button type="submit" className="wpl-btn" disabled={loading}>
              {loading ? "Sending…" : "Send Message →"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
