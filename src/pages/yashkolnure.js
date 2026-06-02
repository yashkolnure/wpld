import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const api = () => axios.create({ baseURL: "/api", headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
const rupees = (paise) => "₹" + ((paise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const C = {
  bg: "#0b1220", panel: "#fff", green: "#16a34a", greenSoft: "#f0fdf4",
  text: "#0f172a", muted: "#64748b", faint: "#94a3b8", border: "#e2e8f0",
  font: "'DM Sans', system-ui, sans-serif",
};

export default function AdminDashboard() {
  const [auth, setAuth] = useState("loading"); // loading | nologin | denied | ok
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null); // userId
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([api().get("/admin/stats"), api().get("/admin/users")]);
      setStats(s.data); setUsers(u.data);
    } catch (e) { /* handled by auth gate */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("token")) { setAuth("nologin"); return; }
      try {
        const r = await api().get("/admin/whoami");
        setAdmin(r.data); setAuth("ok"); loadAll();
      } catch (e) {
        setAuth(e?.response?.status === 403 ? "denied" : "nologin");
      }
    })();
  }, [loadAll]);

  const openUser = async (id) => {
    setSelected(id); setDetail(null); setDetailLoading(true);
    try { const r = await api().get(`/admin/users/${id}`); setDetail(r.data); }
    catch (e) { alert("Failed to load user"); }
    finally { setDetailLoading(false); }
  };

  const impersonate = async (id, email) => {
    if (!window.confirm(`Log in as ${email}? You'll be taken to their dashboard. A banner will let you return here.`)) return;
    try {
      const r = await api().post(`/admin/users/${id}/impersonate`);
      localStorage.setItem("wpl_admin_return", localStorage.getItem("token")); // stash super-admin token
      localStorage.setItem("wpl_impersonating", email);
      localStorage.setItem("token", r.data.token);
      window.location.href = "/dashboard";
    } catch (e) { alert(e?.response?.data?.message || "Impersonation failed"); }
  };

  // ── Gate screens ──────────────────────────────────────────────────────────
  if (auth === "loading") return <Center>Loading…</Center>;
  if (auth === "nologin") return (
    <Center>
      <Gate emoji="🔐" title="Super Admin">
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 18px" }}>Log in with a super-admin account to continue.</p>
        <Link to="/login" style={btn(C.green)}>Go to login →</Link>
      </Gate>
    </Center>
  );
  if (auth === "denied") return (
    <Center>
      <Gate emoji="⛔" title="Not authorized">
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 18px" }}>This account doesn't have super-admin access.</p>
        <Link to="/dashboard" style={btn("#475569")}>Back to dashboard</Link>
      </Gate>
    </Center>
  );

  const filtered = users.filter((u) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return [u.name, u.email, u.phone].some((v) => (v || "").toLowerCase().includes(s));
  });

  const statCards = stats ? [
    { icon: "👥", label: "Users", value: stats.totalUsers },
    { icon: "⭐", label: "Pro", value: stats.proUsers },
    { icon: "🔌", label: "WA Connected", value: stats.connectedAccounts },
    { icon: "💬", label: "Messages", value: stats.totalMessages?.toLocaleString("en-IN") },
    { icon: "👛", label: "Wallet Balance", value: rupees(stats.totalBalancePaise) },
    { icon: "💸", label: "Total Spent", value: rupees(stats.totalSpentPaise) },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: C.font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap'); *{box-sizing:border-box} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg,#065f56,#022c22)", color: "#fff", padding: "18px clamp(16px,4vw,40px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 22 }}>🛡️</span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>WPLeads Super Admin</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{admin?.email}</div>
        </div>
        <button onClick={loadAll} disabled={loading} style={{ ...btn("rgba(255,255,255,0.14)"), display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", animation: loading ? "spin 0.8s linear infinite" : "none" }}>🔄</span>{loading ? "Syncing…" : "Refresh"}
        </button>
        <Link to="/dashboard" style={btn("rgba(255,255,255,0.14)")}>My dashboard</Link>
      </div>

      <div style={{ padding: "clamp(16px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 22 }}>
          {statCards.map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>{s.value ?? "—"}</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍  Search name, email or phone…"
            style={{ flex: 1, padding: "12px 16px", fontSize: 14, border: `1px solid ${C.border}`, borderRadius: 12, outline: "none", fontFamily: C.font, background: "#fff" }} />
          <span style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{filtered.length} of {users.length}</span>
        </div>

        {/* Users table */}
        <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720, fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `2px solid ${C.border}`, textAlign: "left" }}>
                  {["User", "Plan", "WhatsApp", "Balance", "Spent", "Joined", ""].map((h, i) => (
                    <th key={i} style={{ padding: "13px 16px", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, textAlign: i >= 3 && i <= 4 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const wa = u.whatsapp || {};
                  return (
                    <tr key={u._id} style={{ borderBottom: `1px solid #f1f5f9` }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 800, color: C.text }}>{u.name || "—"}</div>
                        <div style={{ fontSize: 11.5, color: C.muted }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize: 11, color: C.faint }}>{u.phone}</div>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 20, background: u.plan === "pro" ? "#f5f3ff" : "#f1f5f9", color: u.plan === "pro" ? "#7c3aed" : C.muted }}>{(u.plan || "free").toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {wa.isVerified ? <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>✓ {wa.connectionType || "own"}</span> : <span style={{ fontSize: 12, color: C.faint }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: u.balancePaise > 0 ? C.green : C.faint }}>{rupees(u.balancePaise)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: C.text }}>{rupees(u.spentPaise)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: C.faint, whiteSpace: "nowrap" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button onClick={() => openUser(u._id)} style={{ ...btn(C.green), padding: "7px 14px", fontSize: 12 }}>Manage</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: C.faint }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail / manage drawer */}
      {selected && (
        <UserModal
          loading={detailLoading}
          detail={detail}
          onClose={() => { setSelected(null); setDetail(null); }}
          onRefresh={() => { openUser(selected); loadAll(); }}
          onImpersonate={impersonate}
        />
      )}
    </div>
  );
}

// ── Manage modal ──────────────────────────────────────────────────────────────
function UserModal({ loading, detail, onClose, onRefresh, onImpersonate }) {
  const [amount, setAmount] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);

  const u = detail?.user;
  const flash = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 4000); };

  const addBalance = async () => {
    const amt = parseFloat(amount);
    if (!amt) return flash("Enter an amount (₹)", false);
    setBusy("credit");
    try { await api().post(`/admin/users/${u._id}/credit`, { amount: amt }); setAmount(""); flash(`${amt >= 0 ? "Added" : "Deducted"} ₹${Math.abs(amt)}`); onRefresh(); }
    catch (e) { flash(e?.response?.data?.message || "Failed", false); }
    finally { setBusy(""); }
  };
  const changePw = async () => {
    if (!pw || pw.length < 6) return flash("Password must be 6+ chars", false);
    setBusy("pw");
    try { await api().post(`/admin/users/${u._id}/password`, { password: pw }); setPw(""); flash("Password updated"); }
    catch (e) { flash(e?.response?.data?.message || "Failed", false); }
    finally { setBusy(""); }
  };
  const togglePlan = async () => {
    const next = u.plan === "pro" ? "free" : "pro";
    setBusy("plan");
    try { await api().patch(`/admin/users/${u._id}/plan`, { plan: next }); flash(`Plan set to ${next}`); onRefresh(); }
    catch (e) { flash(e?.response?.data?.message || "Failed", false); }
    finally { setBusy(""); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.55)", zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(560px,100%)", height: "100%", background: "#f8fafc", overflowY: "auto", boxShadow: "-12px 0 40px rgba(0,0,0,0.25)", animation: "none" }}>
        {/* header */}
        <div style={{ background: "linear-gradient(135deg,#065f56,#022c22)", color: "#fff", padding: "20px 22px", position: "sticky", top: 0, zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{u?.name || "User"}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>{u?.email}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
        </div>

        {loading || !detail ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading…</div>
        ) : (
          <div style={{ padding: 22, display: "grid", gap: 16 }}>
            {msg && <div style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: msg.ok ? "#dcfce7" : "#fee2e2", color: msg.ok ? "#166534" : "#991b1b" }}>{msg.text}</div>}

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Mini label="Balance" value={rupees(detail.balancePaise)} color={C.green} />
              <Mini label="Spent" value={rupees(detail.spentPaise)} />
              <Mini label="Messages" value={detail.messageCount?.toLocaleString("en-IN")} />
            </div>

            {/* Quick facts */}
            <Card title="Account">
              <Row k="Phone" v={u.phone || "—"} />
              <Row k="Plan" v={(u.plan || "free").toUpperCase()} />
              <Row k="WhatsApp" v={detail.whatsapp ? `${detail.whatsapp.isVerified ? "Verified · " : ""}${detail.whatsapp.connectionType || "own"}${detail.whatsapp.displayNumber ? " · +" + detail.whatsapp.displayNumber : ""}` : "Not connected"} />
              <Row k="Joined" v={new Date(u.createdAt).toLocaleString()} />
            </Card>

            {/* Actions */}
            <Card title="💰 Add / adjust balance">
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ₹ (use - to deduct)"
                  style={{ flex: 1, padding: "11px 14px", fontSize: 14, border: `1px solid ${C.border}`, borderRadius: 10, outline: "none", fontFamily: C.font }} />
                <button onClick={addBalance} disabled={busy === "credit"} style={btn(C.green)}>{busy === "credit" ? "…" : "Apply"}</button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {[100, 500, 1000, 2000].map((a) => (
                  <button key={a} onClick={() => setAmount(String(a))} style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: C.muted }}>+₹{a}</button>
                ))}
              </div>
            </Card>

            <Card title="🔑 Set new password">
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password (6+ chars)"
                  style={{ flex: 1, padding: "11px 14px", fontSize: 14, border: `1px solid ${C.border}`, borderRadius: 10, outline: "none", fontFamily: C.font }} />
                <button onClick={changePw} disabled={busy === "pw"} style={btn("#0f172a")}>{busy === "pw" ? "…" : "Update"}</button>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => onImpersonate(u._id, u.email)} style={{ ...btn(C.green), padding: "13px", fontSize: 14 }}>🚪 Log in as user</button>
              <button onClick={togglePlan} disabled={busy === "plan"} style={{ ...btn("#7c3aed"), padding: "13px", fontSize: 14 }}>{busy === "plan" ? "…" : `Set ${u.plan === "pro" ? "FREE" : "PRO"}`}</button>
            </div>

            {/* Transactions */}
            <Card title={`🧾 Recent transactions (${detail.transactions?.length || 0})`}>
              {detail.transactions?.length ? detail.transactions.slice(0, 20).map((t) => (
                <div key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: C.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>{t.description || t.type}</div>
                    <div style={{ fontSize: 10.5, color: C.faint }}>{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: t.type === "credit" ? C.green : "#dc2626", whiteSpace: "nowrap" }}>{t.type === "credit" ? "+" : "−"}{rupees(t.amount)}</div>
                </div>
              )) : <div style={{ color: C.faint, fontSize: 13 }}>No transactions</div>}
            </Card>

            {/* Campaigns spend */}
            <Card title={`📣 Campaigns (${(detail.campaigns?.length || 0) + (detail.bulkCampaigns?.length || 0)})`}>
              {[...(detail.campaigns || []).map((c) => ({ ...c, kind: "Broadcast" })), ...(detail.bulkCampaigns || []).map((c) => ({ ...c, kind: "Outreach" }))]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12).map((c) => (
                  <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>{c.name} <span style={{ fontSize: 10, color: C.faint }}>· {c.kind}</span></div>
                      <div style={{ fontSize: 10.5, color: C.faint }}>{c.status} · sent {c.sentCount || 0} · delivered {c.deliveredCount || 0}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: C.text }}>{rupees(c.costPaise)}</div>
                  </div>
                ))}
              {!(detail.campaigns?.length || detail.bulkCampaigns?.length) && <div style={{ color: C.faint, fontSize: 13 }}>No campaigns</div>}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── small UI helpers ──────────────────────────────────────────────────────────
const btn = (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block", fontFamily: C.font });
const Center = ({ children }) => <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#065f56", fontFamily: C.font, color: "#fff" }}>{children}</div>;
const Gate = ({ emoji, title, children }) => (
  <div style={{ background: "#fff", padding: 40, borderRadius: 24, textAlign: "center", maxWidth: 360, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
    <h2 style={{ margin: "0 0 8px", fontWeight: 900, color: C.text }}>{title}</h2>
    {children}
  </div>
);
const Mini = ({ label, value, color }) => (
  <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
    <div style={{ fontSize: 16, fontWeight: 900, color: color || C.text }}>{value ?? "—"}</div>
    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
  </div>
);
const Card = ({ title, children }) => (
  <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
    <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>{title}</div>
    {children}
  </div>
);
const Row = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0", fontSize: 13 }}>
    <span style={{ color: C.muted }}>{k}</span>
    <span style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{v}</span>
  </div>
);
