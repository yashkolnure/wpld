import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

// ─── API CONFIG ────────────────────────────────────────────────────────────
const API = axios.create({ baseURL: "http://localhost:5004/api/whatsapp" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const apiAddNumber  = (d) => API.post("/numbers/add", d).then(r => r.data);
const apiRequestOTP = (d) => API.post("/numbers/request-otp", d).then(r => r.data);
const apiVerifyOTP  = (d) => API.post("/numbers/verify-otp", d).then(r => r.data);
const apiRegister   = (d) => API.post("/numbers/register", d).then(r => r.data);

function extractError(err) {
  const data = err?.response?.data;
  return data?.error || err?.message || "An unexpected error occurred.";
}

// ─── COUNTRY DATA ──────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: "India", code: "91", flag: "🇮🇳" },
  { name: "United States", code: "1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "44", flag: "🇬🇧" },
  { name: "Canada", code: "1", flag: "🇨🇦" },
  { name: "Australia", code: "61", flag: "🇦🇺" },
  { name: "Germany", code: "49", flag: "🇩🇪" },
  { name: "France", code: "33", flag: "🇫🇷" },
  { name: "Italy", code: "39", flag: "🇮🇹" },
  { name: "Spain", code: "34", flag: "🇪🇸" },
  { name: "Netherlands", code: "31", flag: "🇳🇱" },
  { name: "Brazil", code: "55", flag: "🇧🇷" },
  { name: "Mexico", code: "52", flag: "🇲🇽" },
  { name: "Argentina", code: "54", flag: "🇦🇷" },
  { name: "Colombia", code: "57", flag: "🇨🇴" },
  { name: "Chile", code: "56", flag: "🇨🇱" },
  { name: "South Africa", code: "27", flag: "🇿🇦" },
  { name: "Nigeria", code: "234", flag: "🇳🇬" },
  { name: "Kenya", code: "254", flag: "🇰🇪" },
  { name: "Egypt", code: "20", flag: "🇪🇬" },
  { name: "Ghana", code: "233", flag: "🇬🇭" },
  { name: "Saudi Arabia", code: "966", flag: "🇸🇦" },
  { name: "UAE", code: "971", flag: "🇦🇪" },
  { name: "Qatar", code: "974", flag: "🇶🇦" },
  { name: "Kuwait", code: "965", flag: "🇰🇼" },
  { name: "Bahrain", code: "973", flag: "🇧🇭" },
  { name: "Pakistan", code: "92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "94", flag: "🇱🇰" },
  { name: "Nepal", code: "977", flag: "🇳🇵" },
  { name: "Singapore", code: "65", flag: "🇸🇬" },
  { name: "Malaysia", code: "60", flag: "🇲🇾" },
  { name: "Indonesia", code: "62", flag: "🇮🇩" },
  { name: "Philippines", code: "63", flag: "🇵🇭" },
  { name: "Thailand", code: "66", flag: "🇹🇭" },
  { name: "Vietnam", code: "84", flag: "🇻🇳" },
  { name: "Japan", code: "81", flag: "🇯🇵" },
  { name: "South Korea", code: "82", flag: "🇰🇷" },
  { name: "China", code: "86", flag: "🇨🇳" },
  { name: "Hong Kong", code: "852", flag: "🇭🇰" },
  { name: "Taiwan", code: "886", flag: "🇹🇼" },
  { name: "New Zealand", code: "64", flag: "🇳🇿" },
  { name: "Russia", code: "7", flag: "🇷🇺" },
  { name: "Turkey", code: "90", flag: "🇹🇷" },
  { name: "Poland", code: "48", flag: "🇵🇱" },
  { name: "Sweden", code: "46", flag: "🇸🇪" },
  { name: "Norway", code: "47", flag: "🇳🇴" },
  { name: "Denmark", code: "45", flag: "🇩🇰" },
  { name: "Finland", code: "358", flag: "🇫🇮" },
  { name: "Switzerland", code: "41", flag: "🇨🇭" },
  { name: "Austria", code: "43", flag: "🇦🇹" },
  { name: "Belgium", code: "32", flag: "🇧🇪" },
  { name: "Portugal", code: "351", flag: "🇵🇹" },
  { name: "Greece", code: "30", flag: "🇬🇷" },
  { name: "Israel", code: "972", flag: "🇮🇱" },
  { name: "Iran", code: "98", flag: "🇮🇷" },
  { name: "Iraq", code: "964", flag: "🇮🇶" },
  { name: "Jordan", code: "962", flag: "🇯🇴" },
  { name: "Lebanon", code: "961", flag: "🇱🇧" },
  { name: "Morocco", code: "212", flag: "🇲🇦" },
  { name: "Algeria", code: "213", flag: "🇩🇿" },
  { name: "Tunisia", code: "216", flag: "🇹🇳" },
  { name: "Tanzania", code: "255", flag: "🇹🇿" },
  { name: "Ethiopia", code: "251", flag: "🇪🇹" },
  { name: "Cameroon", code: "237", flag: "🇨🇲" },
  { name: "Peru", code: "51", flag: "🇵🇪" },
  { name: "Venezuela", code: "58", flag: "🇻🇪" },
  { name: "Ecuador", code: "593", flag: "🇪🇨" },
  { name: "Bolivia", code: "591", flag: "🇧🇴" },
  { name: "Paraguay", code: "595", flag: "🇵🇾" },
  { name: "Uruguay", code: "598", flag: "🇺🇾" },
  { name: "Costa Rica", code: "506", flag: "🇨🇷" },
  { name: "Guatemala", code: "502", flag: "🇬🇹" },
  { name: "Honduras", code: "504", flag: "🇭🇳" },
  { name: "El Salvador", code: "503", flag: "🇸🇻" },
  { name: "Panama", code: "507", flag: "🇵🇦" },
  { name: "Dominican Rep.", code: "1849", flag: "🇩🇴" },
  { name: "Jamaica", code: "1876", flag: "🇯🇲" },
  { name: "Cuba", code: "53", flag: "🇨🇺" },
  { name: "Trinidad & Tobago", code: "1868", flag: "🇹🇹" },
  { name: "Myanmar", code: "95", flag: "🇲🇲" },
  { name: "Cambodia", code: "855", flag: "🇰🇭" },
  { name: "Laos", code: "856", flag: "🇱🇦" },
  { name: "Brunei", code: "673", flag: "🇧🇳" },
  { name: "Mongolia", code: "976", flag: "🇲🇳" },
  { name: "Kazakhstan", code: "7", flag: "🇰🇿" },
  { name: "Uzbekistan", code: "998", flag: "🇺🇿" },
  { name: "Ukraine", code: "380", flag: "🇺🇦" },
  { name: "Czech Republic", code: "420", flag: "🇨🇿" },
  { name: "Hungary", code: "36", flag: "🇭🇺" },
  { name: "Romania", code: "40", flag: "🇷🇴" },
  { name: "Bulgaria", code: "359", flag: "🇧🇬" },
  { name: "Croatia", code: "385", flag: "🇭🇷" },
  { name: "Serbia", code: "381", flag: "🇷🇸" },
  { name: "Slovakia", code: "421", flag: "🇸🇰" },
];

// ─── COUNTRY PICKER ────────────────────────────────────────────────────────
function CountryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "12px 14px", borderRadius: 12,
          background: "#f8fafc", border: "1.5px solid #e2e8f0",
          cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a",
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 18 }}>{selected.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{selected.name}</span>
        <span style={{ color: "#64748b", fontSize: 13 }}>+{selected.code}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
          boxShadow: "0 8px 32px rgba(15,23,42,0.12)", zIndex: 50,
          overflow: "hidden",
        }}>
          <div style={{ padding: "10px 10px 6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", background: "#f1f5f9", borderRadius: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                placeholder="Search country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none",
                  fontSize: 13, width: "100%", color: "#0f172a" }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", padding: "4px 6px 8px" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "16px", fontSize: 13, color: "#94a3b8" }}>
                No countries found
              </div>
            )}
            {filtered.map(c => (
              <button
                key={`${c.name}-${c.code}`}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 8, border: "none",
                  background: c.code === value ? "#f0fdf4" : "transparent",
                  cursor: "pointer", fontSize: 13, color: "#0f172a", transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (c.code !== value) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (c.code !== value) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{c.flag}</span>
                <span style={{ flex: 1, textAlign: "left", fontWeight: c.code === value ? 600 : 400 }}>
                  {c.name}
                </span>
                <span style={{ color: "#64748b", fontWeight: 600 }}>+{c.code}</span>
                {c.code === value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP INDICATOR ────────────────────────────────────────────────────────
const STEPS = [
  { label: "Details", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Method",  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { label: "Verify",  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { label: "Secure",  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                background: done ? "#dcfce7" : active ? "#16a34a" : "#f1f5f9",
                border: done ? "2px solid #16a34a" : active ? "2px solid #16a34a" : "2px solid #e2e8f0",
                transition: "all 0.3s",
              }}>
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={active ? "#fff" : "#94a3b8"} strokeWidth="2">
                    <path d={s.icon} />
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
                color: active ? "#16a34a" : done ? "#16a34a" : "#94a3b8",
                textTransform: "uppercase",
              }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 22, marginLeft: 4, marginRight: 4,
                background: done ? "#16a34a" : "#e2e8f0", transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FORM COMPONENTS ───────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b",
      textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function TextInput({ label, hint, ...props }) {
  return (
    <div style={{ width: "100%" }}>
      {label && <Label>{label}</Label>}
      <input
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "12px 16px", borderRadius: 12,
          background: "#f8fafc", border: "1.5px solid #e2e8f0",
          fontSize: 14, fontWeight: 500, color: "#0f172a",
          outline: "none", transition: "all 0.15s",
        }}
        onFocus={e => {
          e.target.style.background = "#fff";
          e.target.style.borderColor = "#16a34a";
          e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.12)";
        }}
        onBlur={e => {
          e.target.style.background = "#f8fafc";
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
        {...props}
      />
      {hint && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, paddingLeft: 2 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function Btn({ loading, children, variant = "primary", style: extraStyle = {}, ...props }) {
  const styles = {
    primary: { background: "#0f172a", color: "#fff", border: "none",
      boxShadow: "0 2px 12px rgba(15,23,42,0.18)" },
    green:   { background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff",
      border: "none", boxShadow: "0 2px 16px rgba(22,163,74,0.30)" },
    outline: { background: "#fff", color: "#374151",
      border: "1.5px solid #e2e8f0", boxShadow: "none" },
  };
  return (
    <button
      style={{
        width: "100%", padding: "13px 20px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, cursor: props.disabled || loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: props.disabled || loading ? 0.55 : 1,
        transition: "all 0.15s", ...styles[variant], ...extraStyle,
      }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div style={{ width: 16, height: 16, borderRadius: "50%",
          border: "2.5px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
      )}
      {children}
    </button>
  );
}

function Alert({ type, message }) {
  if (!message) return null;
  const isErr = type === "error";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 16px", borderRadius: 12, marginBottom: 24,
      background: isErr ? "#fef2f2" : "#f0fdf4",
      border: `1.5px solid ${isErr ? "#fecaca" : "#bbf7d0"}`,
      fontSize: 13, fontWeight: 600,
      color: isErr ? "#b91c1c" : "#15803d",
    }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{isErr ? "⚠️" : "✅"}</span>
      <span>{message}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function AddNumberPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [otpMethod, setOtpMethod] = useState("SMS");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [form, setForm] = useState({ countryCode: "91", phoneNumber: "", verifiedName: "" });

  const run = useCallback((fn) => async () => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    try { await fn(); }
    catch (err) { setStatus({ type: "error", message: extractError(err) }); }
    finally { setLoading(false); }
  }, []);

  const reset = () => {
    setStep(1);
    setOtp(""); setPin("");
    setForm({ countryCode: "91", phoneNumber: "", verifiedName: "" });
    setStatus({ type: "", message: "" });
  };

  const selectedCountry = COUNTRIES.find(c => c.code === form.countryCode) || COUNTRIES[0];

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#f8fafc",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "40px 16px 60px",
      }}>

        {/* Top brand bar */}
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 10px rgba(22,163,74,0.3)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                WPLeads
              </div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
                WhatsApp Business API
              </div>
            </div>
          </div>
          {step < 5 && (
            <div style={{
              padding: "5px 12px", borderRadius: 99,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "0.05em",
            }}>
              STEP {step} / 4
            </div>
          )}
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 520,
          background: "#fff", borderRadius: 24,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 4px 40px rgba(15,23,42,0.07)",
          padding: "32px 32px",
          animation: "fadeSlide 0.3s ease",
        }}>

          {step < 5 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a",
                  letterSpacing: "-0.03em", lineHeight: 1.25 }}>
                  Create FREE WhatsApp API
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 5, fontWeight: 500 }}>
                  {step === 1 && "Enter your business number & display name."}
                  {step === 2 && "Choose how Meta will send your verification code."}
                  {step === 3 && "Enter the code sent to your phone."}
                  {step === 4 && "Create a PIN to secure your WhatsApp account."}
                </p>
              </div>

              <StepIndicator step={step} />
            </>
          )}

          <Alert type={status.type} message={status.message} />

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeSlide 0.25s ease" }}>
              <div style={{
                padding: "12px 16px", borderRadius: 12,
                background: "#fffbeb", border: "1.5px solid #fde68a",
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚡</span>
                <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600, lineHeight: 1.5 }}>
                  This number must <strong>not</strong> be active on any personal WhatsApp or WhatsApp Business.
                </p>
              </div>

              <div>
                <Label>Country</Label>
                <CountryPicker
                  value={form.countryCode}
                  onChange={code => setForm({ ...form, countryCode: code })}
                />
              </div>

              <div style={{ display: "flex", alignContent: "center", alignItems: "center", gap: 12, alignSelf: "stretch" }}>
                <div style={{
                  display: "none", alignItems: "center", 
                  padding: "12px 14px", borderRadius: 12,
                  background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                  fontSize: 14, fontWeight: 700, color: "#15803d",
                  whiteSpace: "nowrap", height: "fit-content",
                  alignSelf: "center",
                }}>
                  <span style={{ fontSize: 16 }}>{selectedCountry.flag}</span>
                  +{form.countryCode}
                </div>
                <TextInput
                  label="Phone Number"
                  placeholder="7498869327"
                  value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "") })}
                  hint="Enter local number without country code"
                  
                />
              </div>

              <TextInput
                label="WhatsApp Display Name"
                placeholder="MyBusiness Support"
                value={form.verifiedName}
                onChange={e => setForm({ ...form, verifiedName: e.target.value })}
                hint="This name is visible to your customers on WhatsApp."
              />

              <Btn loading={loading} variant="green" onClick={run(async () => {
                if (!form.phoneNumber || !form.verifiedName) throw new Error("Please fill in all fields.");
                const data = await apiAddNumber(form);
                setPhoneNumberId(data.phoneNumberId);
                setStep(2);
              })}>
                Continue to Verification
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Btn>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeSlide 0.25s ease" }}>
              <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
                  background: "#f0fdf4", border: "2px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                  Meta will send a <strong style={{ color: "#0f172a" }}>6-digit code</strong> to<br/>
                  <strong style={{ color: "#16a34a" }}>+{form.countryCode} {form.phoneNumber}</strong>
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["SMS", "📱", "Text Message (SMS)", "Receive code via text"],
                  ["VOICE", "📞", "Voice Call", "Receive code via automated call"]
                ].map(([val, icon, title, sub]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOtpMethod(val)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 14,
                      border: `2px solid ${otpMethod === val ? "#16a34a" : "#e2e8f0"}`,
                      background: otpMethod === val ? "#f0fdf4" : "#fff",
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${otpMethod === val ? "#16a34a" : "#cbd5e1"}`,
                      background: otpMethod === val ? "#16a34a" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {otpMethod === val && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="outline" onClick={() => setStep(1)} disabled={loading}
                  style={{ flexShrink: 0, width: "auto", padding: "13px 20px" }}>
                  ← Back
                </Btn>
                <Btn loading={loading} variant="green" onClick={run(async () => {
                  await apiRequestOTP({ phoneNumberId, method: otpMethod });
                  setStep(3);
                })}>
                  Send Code
                </Btn>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeSlide 0.25s ease" }}>
              <div style={{
                padding: "16px", borderRadius: 14, textAlign: "center",
                background: "#f8fafc", border: "1.5px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                  Code sent to {otpMethod === "SMS" ? "📱" : "📞"}{" "}
                  <strong style={{ color: "#0f172a" }}>+{form.countryCode} {form.phoneNumber}</strong>
                </div>
              </div>

              <div>
                <Label>6-digit Verification Code</Label>
                <input
                  type="tel"
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  style={{
                    width: "100%", padding: "16px", textAlign: "center",
                    borderRadius: 14, border: "1.5px solid #e2e8f0",
                    fontSize: 28, fontWeight: 800, letterSpacing: "0.4em",
                    color: "#0f172a", background: "#f8fafc", outline: "none",
                    transition: "all 0.15s",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#16a34a";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#f8fafc";
                  }}
                />
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, textAlign: "center" }}>
                  Check your {otpMethod === "SMS" ? "messages" : "incoming calls"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="outline" onClick={() => setStep(2)} disabled={loading}
                  style={{ flexShrink: 0, width: "auto", padding: "13px 20px" }}>
                  ← Back
                </Btn>
                <Btn loading={loading} variant="green" onClick={run(async () => {
                  if (otp.length !== 6) throw new Error("Enter the complete 6-digit code.");
                  await apiVerifyOTP({ phoneNumberId, code: otp });
                  setStep(4);
                })}>
                  Verify & Continue
                </Btn>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeSlide 0.25s ease" }}>
              <div style={{
                padding: "14px 16px", borderRadius: 12,
                background: "#eff6ff", border: "1.5px solid #bfdbfe",
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔐</span>
                <p style={{ fontSize: 12, color: "#1e40af", fontWeight: 600, lineHeight: 1.5 }}>
                  This PIN protects your account from unauthorized access.
                  Store it safely — you'll need it to re-register this number.
                </p>
              </div>

              <div>
                <Label>Create 6-digit PIN</Label>
                <input
                  type="password"
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                  style={{
                    width: "100%", padding: "16px", textAlign: "center",
                    borderRadius: 14, border: "1.5px solid #e2e8f0",
                    fontSize: 28, fontWeight: 800, letterSpacing: "0.4em",
                    color: "#0f172a", background: "#f8fafc", outline: "none",
                    transition: "all 0.15s",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#16a34a";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#f8fafc";
                  }}
                />
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 99,
                      background: pin.length >= i ? "#16a34a" : "#e2e8f0",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, textAlign: "center" }}>
                  {pin.length}/6 digits entered
                </div>
              </div>

              <Btn loading={loading} variant="green" onClick={run(async () => {
                if (pin.length !== 6) throw new Error("PIN must be exactly 6 digits.");
                await apiRegister({ phoneNumberId, pin });
                setStep(5);
              })}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Activate WhatsApp Number
              </Btn>
            </div>
          )}

          {/* ── STEP 5: SUCCESS ── */}
          {step === 5 && (
            <div style={{ padding: "20px 0", textAlign: "center", animation: "popIn 0.35s ease" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a",
                letterSpacing: "-0.03em", marginBottom: 8 }}>
                Number Activated!
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500, lineHeight: 1.6, marginBottom: 8 }}>
                <strong style={{ color: "#16a34a" }}>
                  +{form.countryCode} {form.phoneNumber}
                </strong>
                {" "}is now live on WhatsApp Business API<br />and ready to send & receive messages.
              </p>

              <div style={{
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                padding: "10px 16px", borderRadius: 99, margin: "16px auto",
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                width: "fit-content",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>CONNECTED</span>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <Btn variant="outline" onClick={reset}>Add Another Number</Btn>
                <Btn variant="green">Go to Dashboard →</Btn>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24, display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Secured via Meta Cloud API
        </div>
      </div>
    </>
  );
}