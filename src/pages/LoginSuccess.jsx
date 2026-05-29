import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Fetch user email so superadmin check works after Google OAuth
      axios.get(`${API}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => localStorage.setItem("userEmail", r.data.email || ""))
        .catch(() => {})
        .finally(() => navigate("/dashboard"));
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25d366] mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-[#0f172a]">Finalizing Sign-in...</h2>
        <p className="text-slate-500">Securing your workspace access.</p>
      </div>
    </div>
  );
}