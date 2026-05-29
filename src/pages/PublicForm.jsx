import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, AlertCircle, Loader2, MessageCircle, Home } from "lucide-react";

const API = "";

export default function PublicForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("loading"); // loading, idle, submitting, success, error

  useEffect(() => {
    axios.get(`${API}/api/leads/public/slug/${slug}`)
      .then(res => { 
        if (res.data) {
          setConfig(res.data); 
          setStatus("idle"); 
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  // Handle Redirect logic when error occurs
  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await axios.post(`${API}/api/leads/submit/${config.userId}`, formData);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const Branding = () => (
    <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.8 }}>
      <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', letterSpacing: '0.02em' }}>
        Powered by <strong style={{ color: '#16a34a' }}>WPleads.in</strong>
      </p>
      <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
        Avenirya Solutions OPC Pvt Ltd
      </p>
    </div>
  );

  if (status === "loading") return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" color="#16a34a" /></div>;

  // 404 / Not Found State
  if (status === "error") return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', background: '#fff' }}>
      <AlertCircle size={60} color="#ef4444" />
      <h2 style={{ marginTop: '20px', fontWeight: 800, color: '#0f172a' }}>Form Not Found</h2>
      <p style={{ color: '#64748b', marginTop: '8px' }}>The link you followed is invalid or has been removed.</p>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
        <Loader2 size={14} className="animate-spin" />
        Redirecting you to home in 3 seconds...
      </div>
      <button 
        onClick={() => navigate("/")}
        style={{ marginTop: '30px', background: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Home size={16} /> Go Home Now
      </button>
    </div>
  );
  
  if (status === "success") return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
        <CheckCircle2 size={60} color="#16a34a" style={{ margin: '0 auto' }} />
        <h2 style={{ marginTop: '20px', fontWeight: 800, color: '#0f172a' }}>Thank You!</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Your details have been submitted successfully.</p>
        <Branding />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{config?.formTitle || "Lead Form"}</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Secure form</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
            {config?.fields.map(f => (
              <div key={f.id} style={{ width: f.width === "half" ? "calc(50% - 9px)" : "100%" }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                
                {f.type === "textarea" ? (
                  <textarea 
                    required={f.required}
                    placeholder={f.placeholder}
                    onChange={e => setFormData({ ...formData, [f.label]: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', minHeight: '100px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                ) : (
                  <input 
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    onChange={e => setFormData({ ...formData, [f.label]: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                )}
              </div>
            ))}

            <button 
              type="submit" 
              disabled={status === "submitting"}
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'linear-gradient(135deg,#16a34a,#15803d)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: 800, 
                fontSize: '15px',
                cursor: 'pointer', 
                marginTop: '10px',
                boxShadow: '0 4px 12px rgba(22,163,74,0.2)'
              }}
            >
              {status === "submitting" ? "Processing..." : (config?.btnLabel || "Submit Details")}
            </button>
          </form>
        </div>
        <Branding />
      </div>
    </div>
  );
}