import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { WaIcon } from "../components/Icons";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Just send the digits; let the backend handle the final normalization
    await axios.post("/api/auth/register", form); 

    alert("Success! Please sign in.");
    navigate("/login");
  } catch (err) {
    // Detailed error logging
    const msg = err.response?.data?.message || "Registration failed";
    alert(msg);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || ""}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex justify-center items-start pt-32 md:pt-40 pb-20 px-4 relative overflow-hidden font-sans">

      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(at_0%_0%,_rgba(37,211,102,0.06)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(99,102,241,0.06)_0px,_transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-6xl bg-white rounded-[32px] flex overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 z-10 min-h-[640px]">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 bg-[#0f172a] p-16 flex-col justify-center relative">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-[#25d366] uppercase mb-6">
              14-Day Free Trial
            </span>

            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Build your first bot in <span className="text-[#25d366]">5 minutes.</span>
            </h2>

            <div className="space-y-5">
              {[
                "Unlimited visual workflows",
                "Real-time contact CRM",
                "Official Meta API Access"
              ].map(text => (
                <div key={text} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="text-[#25d366] font-black text-lg">✓</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-[1.2] p-8 md:p-16 flex flex-col justify-center">

          <div className="mb-10">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <WaIcon size={20} color="#fff" />
            </div>

            <h1 className="text-3xl font-black text-[#0f172a] mb-2">
              Create account
            </h1>

            <p className="text-slate-500">
              Join 12,000+ high-growth teams.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
              <input
                type="text"
                placeholder="Yash Kolnure"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border focus:border-[#25d366]"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Work Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border focus:border-[#25d366]"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border focus:border-[#25d366]"
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, "")
                  })
                }
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Security Key</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border focus:border-[#25d366]"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#0f172a] text-white font-bold hover:bg-slate-800"
            >
              {loading ? "Creating Account..." : "Get Started for Free →"}
            </button>

          </form>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full py-4 rounded-xl border font-bold"
          >
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#0f172a]">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}