import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

// ─── API ───────────────────────────────────────────────────────────────────
const WA = axios.create({ baseURL: "/api/whatsapp" });
WA.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const api = {
  getProgress:  ()  => WA.get("/onboarding").then(r => r.data.progress),
  saveProgress: (d) => WA.put("/onboarding", d),
  clearProgress: () => WA.delete("/onboarding"),
  addNumber:    (d)  => WA.post("/numbers/add", d).then(r => r.data),
  requestOTP:   (d)  => WA.post("/numbers/request-otp", d),
  verifyOTP:    (d)  => WA.post("/numbers/verify-otp", d),
  register:     (d)  => WA.post("/numbers/register", d),
};

function extractError(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong.";
}

// ─── COUNTRY DATA ──────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: "India",           code: "91",  flag: "🇮🇳" },
  { name: "United States",   code: "1",   flag: "🇺🇸" },
  { name: "United Kingdom",  code: "44",  flag: "🇬🇧" },
  { name: "Canada",          code: "1",   flag: "🇨🇦" },
  { name: "Australia",       code: "61",  flag: "🇦🇺" },
  { name: "UAE",             code: "971", flag: "🇦🇪" },
  { name: "Saudi Arabia",    code: "966", flag: "🇸🇦" },
  { name: "Pakistan",        code: "92",  flag: "🇵🇰" },
  { name: "Bangladesh",      code: "880", flag: "🇧🇩" },
  { name: "Germany",         code: "49",  flag: "🇩🇪" },
  { name: "France",          code: "33",  flag: "🇫🇷" },
  { name: "Netherlands",     code: "31",  flag: "🇳🇱" },
  { name: "Brazil",          code: "55",  flag: "🇧🇷" },
  { name: "Mexico",          code: "52",  flag: "🇲🇽" },
  { name: "Singapore",       code: "65",  flag: "🇸🇬" },
  { name: "Malaysia",        code: "60",  flag: "🇲🇾" },
  { name: "Indonesia",       code: "62",  flag: "🇮🇩" },
  { name: "Philippines",     code: "63",  flag: "🇵🇭" },
  { name: "Thailand",        code: "66",  flag: "🇹🇭" },
  { name: "Vietnam",         code: "84",  flag: "🇻🇳" },
  { name: "Japan",           code: "81",  flag: "🇯🇵" },
  { name: "South Korea",     code: "82",  flag: "🇰🇷" },
  { name: "China",           code: "86",  flag: "🇨🇳" },
  { name: "Hong Kong",       code: "852", flag: "🇭🇰" },
  { name: "Turkey",          code: "90",  flag: "🇹🇷" },
  { name: "Nigeria",         code: "234", flag: "🇳🇬" },
  { name: "South Africa",    code: "27",  flag: "🇿🇦" },
  { name: "Kenya",           code: "254", flag: "🇰🇪" },
  { name: "Egypt",           code: "20",  flag: "🇪🇬" },
  { name: "Israel",          code: "972", flag: "🇮🇱" },
  { name: "Qatar",           code: "974", flag: "🇶🇦" },
  { name: "Kuwait",          code: "965", flag: "🇰🇼" },
  { name: "Sri Lanka",       code: "94",  flag: "🇱🇰" },
  { name: "Nepal",           code: "977", flag: "🇳🇵" },
  { name: "New Zealand",     code: "64",  flag: "🇳🇿" },
  { name: "Russia",          code: "7",   flag: "🇷🇺" },
  { name: "Poland",          code: "48",  flag: "🇵🇱" },
  { name: "Sweden",          code: "46",  flag: "🇸🇪" },
  { name: "Switzerland",     code: "41",  flag: "🇨🇭" },
  { name: "Argentina",       code: "54",  flag: "🇦🇷" },
  { name: "Colombia",        code: "57",  flag: "🇨🇴" },
  { name: "Chile",           code: "56",  flag: "🇨🇱" },
  { name: "Peru",            code: "51",  flag: "🇵🇪" },
];

// ─── COUNTRY PICKER ────────────────────────────────────────────────────────
function CountryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);
  const sel = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];
  const list = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.code.includes(q)
  );

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        height: 48, padding: "0 14px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", background: "#f8fafc",
        display: "flex", alignItems: "center", gap: 8,
        cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap",
      }}>
        <span style={{ fontSize: 18 }}>{sel.flag}</span>
        <span>+{sel.code}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
          boxShadow: "0 16px 48px rgba(15,23,42,0.15)", width: 240, overflow: "hidden",
        }}>
          <div style={{ padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f1f5f9", borderRadius: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input ref={inputRef} placeholder="Search country…" value={q} onChange={e => setQ(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", width: "100%" }} />
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", padding: "0 6px 8px" }}>
            {list.map(c => (
              <button key={`${c.name}-${c.code}`} type="button"
                onClick={() => { onChange(c.code); setOpen(false); setQ(""); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 8, border: "none",
                  background: c.code === value ? "#f0fdf4" : "transparent",
                  cursor: "pointer", fontSize: 13, color: "#0f172a",
                }}>
                <span style={{ fontSize: 16 }}>{c.flag}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{c.name}</span>
                <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>+{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP CONFIG ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Number",  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  { id: 2, label: "Method",  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { id: 3, label: "Verify",  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: 4, label: "PIN",     icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

// ─── SHARED UI ─────────────────────────────────────────────────────────────
function Label({ children, hint }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{children}</div>
      {hint && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function TextInput({ style: s = {}, ...props }) {
  return (
    <input style={{
      width: "100%", boxSizing: "border-box", height: 48,
      padding: "0 14px", borderRadius: 12,
      border: "1.5px solid #e2e8f0", background: "#f8fafc",
      fontSize: 14, color: "#0f172a", outline: "none",
      transition: "all 0.15s", ...s,
    }}
    onFocus={e => { e.target.style.borderColor = "#16a34a"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
    {...props} />
  );
}

function GreenBtn({ loading, children, ...props }) {
  return (
    <button style={{
      width: "100%", height: 50, borderRadius: 14, border: "none",
      background: loading || props.disabled ? "#d1fae5" : "linear-gradient(135deg,#16a34a,#15803d)",
      color: loading || props.disabled ? "#6ee7b7" : "#fff",
      fontSize: 14, fontWeight: 800, cursor: loading || props.disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: loading || props.disabled ? "none" : "0 4px 20px rgba(22,163,74,0.3)",
      transition: "all 0.15s", fontFamily: "inherit",
    }} disabled={loading || props.disabled} {...props}>
      {loading && <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "wamgr-spin 0.7s linear infinite", display: "inline-block" }} />}
      {children}
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      height: 50, padding: "0 20px", borderRadius: 14, flexShrink: 0,
      border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b",
      fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex",
      alignItems: "center", gap: 6, fontFamily: "inherit",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back
    </button>
  );
}

function ErrorAlert({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      display: "flex", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 20,
      background: "#fef2f2", border: "1.5px solid #fecaca",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{ fontSize: 13, color: "#b91c1c", fontWeight: 600, lineHeight: 1.5 }}>{msg}</span>
    </div>
  );
}

// ─── STEP INDICATOR ────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done   = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "#f0fdf4" : active ? "#16a34a" : "#f1f5f9",
                border: done || active ? "2px solid #16a34a" : "2px solid #e2e8f0",
                transition: "all 0.3s",
              }}>
                {done
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#94a3b8"} strokeWidth="1.8"><path d={s.icon}/></svg>
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: active ? "#16a34a" : done ? "#16a34a" : "#94a3b8" }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, marginBottom: 22, marginLeft: 6, marginRight: 6, background: done ? "#16a34a" : "#e2e8f0", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── RESUME BANNER ─────────────────────────────────────────────────────────
function ResumeBanner({ phone, step, onResume, onRestart }) {
  const stepLabels = ["", "number details", "OTP method", "verification code", "PIN setup"];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
      borderRadius: 14, background: "#fffbeb", border: "1.5px solid #fde68a", marginBottom: 24,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#92400e" }}>Resume where you left off</div>
        <div style={{ fontSize: 12, color: "#a16207", marginTop: 2 }}>
          {phone && <><strong>+{phone}</strong> · </>}Paused at <strong>{stepLabels[step]}</strong>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button type="button" onClick={onRestart} style={{ height: 34, padding: "0 12px", borderRadius: 10, border: "1px solid #fde68a", background: "#fff", color: "#a16207", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Start over
        </button>
        <button type="button" onClick={onResume} style={{ height: 34, padding: "0 16px", borderRadius: 10, border: "none", background: "#d97706", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          Resume →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN MODAL COMPONENT ─────────────────────────────────────────────────
export default function WhatsAppManager({ open, onClose, onSuccess }) {
  const [step,          setStep]          = useState(1);
  const [loading,       setLoading]       = useState(false);
  const [initLoading,   setInitLoading]   = useState(true);
  const [error,         setError]         = useState("");
  const [savedProgress, setSavedProgress] = useState(null);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [otpMethod,     setOtpMethod]     = useState("SMS");
  const [otp,           setOtp]           = useState("");
  const [pin,           setPin]           = useState("");
  const [form, setForm] = useState({ countryCode: "91", phoneNumber: "", verifiedName: "" });

  // ── Load saved progress on open ──────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setInitLoading(true);
    api.getProgress()
      .then(progress => {
        if (progress && progress.status === "in_progress" && progress.step > 1) {
          setSavedProgress(progress);
        }
      })
      .catch(() => {})
      .finally(() => setInitLoading(false));
  }, [open]);

  // ── Save progress to DB after each step ──────────────────────────────────
  const persistProgress = useCallback(async (newStep, extras = {}) => {
    try {
      await api.saveProgress({
        step: newStep,
        phoneNumberId: extras.phoneNumberId ?? phoneNumberId,
        countryCode:   form.countryCode,
        phoneNumber:   form.phoneNumber,
        verifiedName:  form.verifiedName,
        otpMethod:     extras.otpMethod ?? otpMethod,
      });
    } catch (_) {}
  }, [form, phoneNumberId, otpMethod]);

  const run = useCallback((fn) => async () => {
    setLoading(true);
    setError("");
    try { await fn(); }
    catch (err) { setError(extractError(err)); }
    finally { setLoading(false); }
  }, []);

  const handleResume = () => {
    const p = savedProgress;
    setForm({
      countryCode:  p.countryCode  || "91",
      phoneNumber:  p.phoneNumber  || "",
      verifiedName: p.verifiedName || "",
    });
    setPhoneNumberId(p.phoneNumberId || "");
    setOtpMethod(p.otpMethod || "SMS");
    setStep(p.step);
    setSavedProgress(null);
  };

  const handleRestart = async () => {
    setSavedProgress(null);
    setStep(1);
    setOtp(""); setPin(""); setError("");
    setForm({ countryCode: "91", phoneNumber: "", verifiedName: "" });
    try { await api.saveProgress({ step: 1, countryCode: "91", phoneNumber: "", verifiedName: "", otpMethod: "SMS" }); } catch (_) {}
  };

  const handleClose = () => {
    onClose();
  };

  if (!open) return null;

  const stepTitles = {
    1: { title: "Add your phone number",       sub: "Enter the number you want to activate on WhatsApp Business API." },
    2: { title: "Choose verification method",  sub: "Meta will send a 6-digit code to confirm you own this number." },
    3: { title: "Enter verification code",     sub: "Check your phone and enter the code Meta sent you." },
    4: { title: "Create a security PIN",       sub: "Your PIN protects this number from unauthorised re-registration." },
  };

  return createPortal(
    <>
      <style>{`
        @keyframes wamgr-spin    { to { transform: rotate(360deg); } }
        @keyframes wamgr-overlay { from { opacity:0; } to { opacity:1; } }
        @keyframes wamgr-card    { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes wamgr-step    { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Overlay */}
      <div onClick={handleClose} style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
        animation: "wamgr-overlay 0.2s ease",
      }} />

      {/* Modal card */}
      <div style={{
        position: "fixed", zIndex: 1001,
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "100%", maxWidth: 500,
        maxHeight: "92vh", overflowY: "auto",
        background: "#fff", borderRadius: 24,
        boxShadow: "0 32px 80px rgba(15,23,42,0.25)",
        border: "1px solid rgba(0,0,0,0.07)",
        animation: "wamgr-card 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* ── Modal header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                Platform Number Setup
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
                Managed WABA · No Meta account needed
              </div>
            </div>
          </div>

          <button onClick={handleClose} style={{
            width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e2e8f0",
            background: "#f8fafc", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#64748b",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "24px 24px 28px" }}>

          {/* Loading saved progress */}
          {initLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "40px 0", color: "#94a3b8" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid #e2e8f0", borderTopColor: "#16a34a", animation: "wamgr-spin 0.7s linear infinite", display: "inline-block" }} />
              <span style={{ fontSize: 13 }}>Checking saved progress…</span>
            </div>
          )}

          {!initLoading && (
            <>
              {/* Resume banner */}
              {savedProgress && step === 1 && (
                <ResumeBanner
                  phone={savedProgress.countryCode && savedProgress.phoneNumber ? `${savedProgress.countryCode} ${savedProgress.phoneNumber}` : null}
                  step={savedProgress.step}
                  onResume={handleResume}
                  onRestart={handleRestart}
                />
              )}

              {/* Step indicator (hide on success) */}
              {step <= 4 && <StepIndicator step={step} />}

              {/* Step title */}
              {step <= 4 && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 4 }}>
                    {stepTitles[step]?.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, lineHeight: 1.55 }}>
                    {stepTitles[step]?.sub}
                  </p>
                </div>
              )}

              <ErrorAlert msg={error} />

              {/* ── STEP 1: Number details ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "wamgr-step 0.25s ease" }}>
                  {/* Warning */}
                  <div style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#fffbeb", border: "1.5px solid #fde68a" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600, lineHeight: 1.6 }}>
                      This number must <strong>not</strong> be registered on personal WhatsApp or the WhatsApp Business app. Using an active number will fail verification.
                    </p>
                  </div>

                  {/* Country */}
                  <div>
                    <Label>Country</Label>
                    <CountryPicker value={form.countryCode} onChange={code => setForm(f => ({ ...f, countryCode: code }))} />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label hint="Enter local number without country code">Phone number</Label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ height: 48, padding: "0 14px", borderRadius: 12, border: "1.5px solid #dcfce7", background: "#f0fdf4", display: "flex", alignItems: "center", fontSize: 14, fontWeight: 700, color: "#15803d", whiteSpace: "nowrap", flexShrink: 0 }}>
                        +{form.countryCode}
                      </div>
                      <TextInput
                        placeholder="74988 35687"
                        value={form.phoneNumber}
                        onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value.replace(/\D/g, "") }))}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Display name */}
                  <div>
                    <Label hint="This name appears in your customers' contact list on WhatsApp">WhatsApp display name</Label>
                    <TextInput
                      placeholder="e.g. Acme Support"
                      value={form.verifiedName}
                      onChange={e => setForm(f => ({ ...f, verifiedName: e.target.value }))}
                    />
                  </div>

                  <GreenBtn loading={loading} onClick={run(async () => {
                    if (!form.phoneNumber.trim())  throw new Error("Please enter your phone number.");
                    if (!form.verifiedName.trim()) throw new Error("Please enter a display name for your business.");
                    const data = await api.addNumber(form);
                    setPhoneNumberId(data.phoneNumberId);
                    await persistProgress(2, { phoneNumberId: data.phoneNumberId });
                    setStep(2);
                  })}>
                    Continue to verification
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </GreenBtn>
                </div>
              )}

              {/* ── STEP 2: OTP method ── */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "wamgr-step 0.25s ease" }}>
                  {/* Number recap */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#f0fdf4", border: "1.5px solid #dcfce7" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.2 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sending code to</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>+{form.countryCode} {form.phoneNumber}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>How should Meta send your verification code?</p>

                  {[
                    { val: "SMS",   emoji: "💬", title: "Text message (SMS)", sub: "Receive a 6-digit code via SMS. Works on most phones." },
                    { val: "VOICE", emoji: "📞", title: "Voice call",          sub: "An automated call will read out your code. Use this if SMS fails." },
                  ].map(({ val, emoji, title, sub }) => (
                    <button key={val} type="button" onClick={() => setOtpMethod(val)} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 14,
                      border: `2px solid ${otpMethod === val ? "#16a34a" : "#e2e8f0"}`,
                      background: otpMethod === val ? "#f0fdf4" : "#fff",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
                    }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        border: `2.5px solid ${otpMethod === val ? "#16a34a" : "#d1d5db"}`,
                        background: otpMethod === val ? "#16a34a" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {otpMethod === val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                    </button>
                  ))}

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <BackBtn onClick={() => setStep(1)} />
                    <GreenBtn loading={loading} onClick={run(async () => {
                      await api.requestOTP({ phoneNumberId, method: otpMethod });
                      await persistProgress(3, { otpMethod });
                      setStep(3);
                    })}>
                      Send {otpMethod === "SMS" ? "text message" : "voice call"}
                    </GreenBtn>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Enter OTP ── */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "wamgr-step 0.25s ease" }}>
                  {/* Sent to recap */}
                  <div style={{ display: "flex", gap: 12, padding: "14px 18px", borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{otpMethod === "SMS" ? "💬" : "📞"}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Code {otpMethod === "SMS" ? "sent via SMS" : "sent via voice call"} to
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                        +{form.countryCode} {form.phoneNumber}
                      </div>
                    </div>
                  </div>

                  {/* OTP input */}
                  <div>
                    <Label>6-digit verification code</Label>
                    <input
                      type="tel" maxLength={6} value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="— — — — — —"
                      style={{
                        width: "100%", height: 72, textAlign: "center",
                        borderRadius: 16, fontSize: 36, fontWeight: 900,
                        letterSpacing: "0.3em", color: "#0f172a", outline: "none",
                        border: `2px solid ${otp.length === 6 ? "#16a34a" : "#e2e8f0"}`,
                        background: otp.length === 6 ? "#f0fdf4" : "#f8fafc",
                        transition: "all 0.2s", fontFamily: "inherit",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#16a34a"; e.target.style.boxShadow = "0 0 0 4px rgba(22,163,74,0.1)"; }}
                      onBlur={e => { e.target.style.boxShadow = "none"; }}
                    />
                    {/* Progress dots */}
                    <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: otp.length >= i ? "#16a34a" : "#e2e8f0", transition: "background 0.15s" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Didn't receive the code?
                      <button type="button" onClick={run(async () => {
                        await api.requestOTP({ phoneNumberId, method: otpMethod });
                      })} style={{ border: "none", background: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer", fontSize: 12, padding: 0, fontFamily: "inherit" }}>
                        Resend
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <BackBtn onClick={() => setStep(2)} />
                    <GreenBtn loading={loading} disabled={otp.length !== 6} onClick={run(async () => {
                      if (otp.length !== 6) throw new Error("Please enter the complete 6-digit code.");
                      await api.verifyOTP({ phoneNumberId, code: otp });
                      await persistProgress(4);
                      setStep(4);
                    })}>
                      Verify code
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </GreenBtn>
                  </div>
                </div>
              )}

              {/* ── STEP 4: PIN ── */}
              {step === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "wamgr-step 0.25s ease" }}>
                  {/* Info */}
                  <div style={{ display: "flex", gap: 12, padding: "14px 18px", borderRadius: 12, background: "#eff6ff", border: "1.5px solid #bfdbfe" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 3 }}>Why do you need a PIN?</div>
                      <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
                        Meta requires a 6-digit PIN to protect your WhatsApp Business number. You'll need it if you ever need to re-register this number. <strong>Save it somewhere safe.</strong>
                      </p>
                    </div>
                  </div>

                  {/* PIN input */}
                  <div>
                    <Label>Create your 6-digit PIN</Label>
                    <input
                      type="password" maxLength={6} value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="· · · · · ·"
                      style={{
                        width: "100%", height: 72, textAlign: "center",
                        borderRadius: 16, fontSize: 36, fontWeight: 900,
                        letterSpacing: "0.3em", color: "#0f172a", outline: "none",
                        border: `2px solid ${pin.length === 6 ? "#16a34a" : "#e2e8f0"}`,
                        background: pin.length === 6 ? "#f0fdf4" : "#f8fafc",
                        transition: "all 0.2s", fontFamily: "inherit",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#16a34a"; e.target.style.boxShadow = "0 0 0 4px rgba(22,163,74,0.1)"; }}
                      onBlur={e => { e.target.style.boxShadow = "none"; }}
                    />
                    <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: pin.length >= i ? "#16a34a" : "#e2e8f0", transition: "background 0.15s" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, textAlign: "center" }}>
                      {pin.length}/6 digits entered
                    </div>
                  </div>

                  <GreenBtn loading={loading} disabled={pin.length !== 6} onClick={run(async () => {
                    if (pin.length !== 6) throw new Error("PIN must be exactly 6 digits.");
                    await api.register({ phoneNumberId, pin });
                    await api.clearProgress();
                    setStep(5);
                    if (onSuccess) setTimeout(onSuccess, 2400);
                  })}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Activate WhatsApp number
                  </GreenBtn>
                </div>
              )}

              {/* ── SUCCESS ── */}
              {step === 5 && (
                <div style={{ textAlign: "center", padding: "8px 0 4px", animation: "wamgr-step 0.4s ease" }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
                    background: "linear-gradient(135deg,#16a34a,#15803d)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 12px 40px rgba(22,163,74,0.4)",
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 8 }}>
                    Number Activated! 🎉
                  </h2>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 6 }}>
                    <strong style={{ color: "#16a34a" }}>+{form.countryCode} {form.phoneNumber}</strong> is now live on
                    WhatsApp Business API and ready to send &amp; receive messages.
                  </p>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 18px", borderRadius: 99, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 28 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>CONNECTED & ACTIVE</span>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => {
                      setStep(1); setOtp(""); setPin(""); setError("");
                      setForm({ countryCode: "91", phoneNumber: "", verifiedName: "" });
                    }} style={{
                      flex: 1, height: 48, borderRadius: 12, border: "1.5px solid #e2e8f0",
                      background: "#f8fafc", color: "#374151", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      Add another number
                    </button>
                    <button type="button" onClick={onClose} style={{
                      flex: 1, height: 48, borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff",
                      fontSize: 13, fontWeight: 800, cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(22,163,74,0.3)", fontFamily: "inherit",
                    }}>
                      Go to dashboard →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
