import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { WaIcon } from "../components/Icons";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex justify-center items-start pt-32 md:pt-40 pb-20 px-4 relative overflow-hidden font-sans">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(at_0%_0%,_rgba(37,211,102,0.06)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(99,102,241,0.06)_0px,_transparent_50%)] z-0 pointer-events-none" />

      <div className="w-full max-w-6xl bg-white rounded-[32px] flex overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 z-10 min-h-[600px]">
        
        {/* Left Side: Brand Visuals (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 bg-[#0f172a] p-16 flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-[#25d366] uppercase mb-6">
              Next-Gen Automation
            </span>
            <h2 className="text-4xl font-black text-white leading-tight mb-6 tracking-tight">
              Connect with your customers <span className="text-[#25d366]">instantly.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              Access the world's most intuitive visual builder for WhatsApp Business.
            </p>

            <div className="flex items-center gap-8 border-t border-white/10 pt-10">
              <div>
                <div className="text-xl font-bold text-white">99.9%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Uptime</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <div className="text-xl font-bold text-white">24ms</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Latency</div>
              </div>
            </div>
          </div>
          {/* Decorative Inner Glow */}
          <div className="absolute -bottom-20 -right-20 w-full h-full bg-[radial-gradient(circle,_rgba(37,211,102,0.15)_0%,_transparent_70%)] pointer-events-none" />
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.2] p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <WaIcon size={20} color="#fff" />
            </div>
            <h1 className="text-3xl font-black text-[#0f172a] mb-2 tracking-tight">Sign in</h1>
            <p className="text-slate-500 font-medium">Welcome back to your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 text-slate-900 font-medium"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Security Key</label>
                <Link to="/forgot" className="text-xs font-bold text-[#25d366] hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 text-slate-900 font-medium"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#0f172a] text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] active:scale-[0.98]"
            >
              {loading ? "Authenticating..." : "Access Dashboard →"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Need an account? <Link to="/register" className="text-[#0f172a] font-bold hover:text-[#25d366] transition-colors">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}