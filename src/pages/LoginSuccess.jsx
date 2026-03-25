import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract the token from the URL (?token=xxxx)
    const token = searchParams.get("token");

    if (token) {
      // 2. Store it just like your manual login does
      localStorage.setItem("token", token);
      
      // 3. Send them to the dashboard
      navigate("/dashboard");
    } else {
      // If something went wrong, send them back to login
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