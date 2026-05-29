import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { WaIcon } from "../components/Icons";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/reset-password/${token}`, { password });
      alert("Password reset successful! Please sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex justify-center items-start pt-32 md:pt-40 pb-20 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(at_0%_0%,_rgba(37,211,102,0.06)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(99,102,241,0.06)_0px,_transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 z-10">

        <div className="mb-10">
          <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <WaIcon size={20} color="#fff" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a] mb-2">Set new password</h1>
          <p className="text-slate-500">Must be at least 8 characters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 text-slate-900 font-medium mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#25d366] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-200 text-slate-900 font-medium mt-1"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] active:scale-[0.98]"
          >
            {loading ? "Resetting..." : "Reset Password →"}
          </button>

          <Link to="/login" className="block text-center text-sm text-slate-500 font-medium hover:text-[#0f172a] transition-colors">
            ← Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}
