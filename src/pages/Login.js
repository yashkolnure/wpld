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
      const res = await axios.post("https://wpleads.in/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google Auth URL
    window.location.href = 'https://wpleads.in/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex justify-center items-start pt-32 md:pt-40 pb-20 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(at_0%_0%,_rgba(37,211,102,0.06)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(99,102,241,0.06)_0px,_transparent_50%)] z-0 pointer-events-none" />

      <div className="w-full max-w-6xl bg-white rounded-[32px] flex overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 z-10 min-h-[600px]">
        
        {/* Left Side: Brand Visuals */}
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

          {/* OR Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

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