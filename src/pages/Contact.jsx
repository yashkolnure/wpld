import { useState } from "react";
import axios from "axios";
import { WaIcon } from "../components/Icons";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

const EMPTY = { name: "", email: "", phone: "", message: "" };

const contactPoints = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+91 74998 35687",
    href: "https://wa.me/917499835687",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    label: "Email",
    value: "admin@avenirya.com",
    href: "mailto:admin@avenirya.com",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: "Phone",
    value: "+91 87676 40530",
    href: "tel:+918767640530",
  },
];

export default function Contact() {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
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
    <div className="min-h-screen bg-[#fcfcfd] flex justify-center items-start pt-32 md:pt-40 pb-20 px-4 relative overflow-hidden font-sans">

      {/* Background radial gradient — same as Register/Login */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(at_0%_0%,_rgba(37,211,102,0.06)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(99,102,241,0.06)_0px,_transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-[32px] flex overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 z-10 min-h-[620px]">

        {/* ── LEFT PANEL ── */}
        <div className="hidden md:flex flex-1 bg-[#0f172a] p-14 flex-col justify-between relative overflow-hidden">
          {/* subtle radial glow */}
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,_rgba(37,211,102,0.12)_0%,_transparent_70%)] pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-10 border border-white/10">
              <WaIcon size={20} color="#25d366" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-[#25d366] uppercase mb-5">
              Contact Us
            </span>

            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              We'd love to <span className="text-[#25d366]">hear from you.</span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-10">
              Have a question, partnership idea, or just want to say hello? Send us a message and we'll get back to you.
            </p>

            {/* Contact points */}
            <div className="space-y-4">
              {contactPoints.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-8 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#25d366]" />
            <span className="text-xs text-slate-400 font-medium">Replies within 1 business day · Made in India 🇮🇳</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-[1.2] p-8 md:p-14 flex flex-col justify-center">

          {status === "success" ? (
            <div className="text-center space-y-5 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-2">Message sent!</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Thanks for reaching out. We'll reply within one business day.
                </p>
              </div>
              <button
                onClick={() => setStatus(null)}
                className="mt-2 px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-[#0f172a] hover:bg-slate-50 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <WaIcon size={20} color="#fff" />
                </div>
                <h1 className="text-3xl font-black text-[#0f172a] mb-2">Get in touch</h1>
                <p className="text-slate-500">Fill in the form and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Yash Kolnure"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    className={`w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 border outline-none transition-all duration-200 text-slate-900 font-medium ${
                      errors.name
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    className={`w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 border outline-none transition-all duration-200 text-slate-900 font-medium ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-semibold mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    className="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 text-slate-900 font-medium"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message / Query <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    className={`w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 border outline-none transition-all duration-200 text-slate-900 font-medium resize-none ${
                      errors.message
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-500 font-semibold mt-1">{errors.message}</p>}
                </div>

                {/* Error banner */}
                {status === "error" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    <p className="text-sm text-red-600 font-semibold">{errMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#0f172a] text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send Message →"}
                </button>

              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
