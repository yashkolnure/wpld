import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lock, Users, RefreshCw, Activity } from "lucide-react";

const ADMIN_PASSWORD = "yash1234"; // Set your password here

export default function AdminDashboard() {
  const [inputPass, setInputPass] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch data. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  // Check password logic
  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputPass === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      fetchData();
    } else {
      alert("Wrong password, Boss.");
    }
  };

  // ─── GATEKEEPER UI ───
  if (!isUnlocked) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#065f56" }}>
        <form onSubmit={handleUnlock} style={{ background: "#fff", padding: "40px", borderRadius: "24px", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
          <div style={{ width: "60px", height: "60px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock color="#16a34a" />
          </div>
          <h2 style={{ marginBottom: "10px", fontWeight: "900" }}>Admin Access</h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>Enter the static master password</p>
          <input 
            type="password" 
            placeholder="Master Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", outline: "none" }}
          />
          <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#16a34a", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // ─── MAIN ADMIN TABLE UI ───
  return (
    <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontWeight: "900", color: "#0f172a" }}>WPLeads Master Overview</h1>
        <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", border: "1px solid #22c55e", background: "#fff", color: "#16a34a", fontWeight: "700", cursor: "pointer" }}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Refresh Stats"}
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
       // Inside your AdminDashboard.jsx table
<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
    <tr style={{ textAlign: "left" }}>
      <th style={{ padding: "16px 24px" }}>User Info</th>
      <th>Plan</th>
      <th>WhatsApp Number</th>
      <th>Verified Status</th>
      <th>API Connection</th>
      <th>Joined</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u) => {
      const wa = u.whatsapp || {};
      return (
        <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
          {/* USER INFO */}
          <td style={{ padding: "16px 24px" }}>
            <p style={{ fontWeight: "800", fontSize: "14px" }}>{u.name}</p>
            <p style={{ fontSize: "11px", color: "#64748b" }}>{u.email}</p>
            <p style={{ fontSize: "11px", color: "#64748b" }}>{u.phone}</p>
          </td>

          {/* PLAN */}
          <td>
            <span style={{ fontSize: "10px", fontWeight: "900", color: u.plan === 'pro' ? '#7c3aed' : '#64748b' }}>
              {u.plan?.toUpperCase()}
            </span>
          </td>

          {/* WHATSAPP NUMBER */}
          <td style={{ fontWeight: "700", color: "#0f172a" }}>
            {wa.displayNumber ? `+${wa.displayNumber}` : "—"}
            {wa.verifiedName && (
               <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: "400" }}>{wa.verifiedName}</p>
            )}
          </td>

          {/* VERIFIED STATUS */}
          <td>
            {wa.isVerified ? (
              <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: "700" }}>
                ✓ Verified
              </span>
            ) : (
              <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#fee2e2", color: "#991b1b", fontSize: "11px", fontWeight: "700" }}>
                Unverified
              </span>
            )}
          </td>

          {/* API CONNECTION STATUS */}
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ 
                width: "10px", height: "100px", maxWidth: "10px", maxHeight: "10px", borderRadius: "50%", 
                background: wa.status === 'ACTIVE' ? '#22c55e' : '#f59e0b',
                boxShadow: wa.status === 'ACTIVE' ? '0 0 8px rgba(34,197,94,0.4)' : 'none'
              }} />
              <span style={{ fontSize: "12px", fontWeight: "600" }}>
                {wa.status || "PENDING"}
              </span>
            </div>
            {wa.wabaId && <p style={{ fontSize: "9px", color: "#94a3b8", marginTop: "2px" }}>ID: {wa.wabaId}</p>}
          </td>

          {/* JOINED DATE */}
          <td style={{ fontSize: "12px", color: "#94a3b8" }}>
            {new Date(u.createdAt).toLocaleDateString()}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
      </div>
    </div>
  );
}