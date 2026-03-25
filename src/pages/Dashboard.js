import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Zap, Users, MessageCircle, LogOut,
  Wifi, WifiOff, Plus, Copy, Check, ChevronLeft, ChevronRight,
  Trash2, Pencil, Menu, X, ExternalLink, Bell, Search,
  TrendingUp, Activity, Clock, CircleDot, AlertCircle, Hash,
  Phone, StickyNote, Download, MessageSquare, Send, RefreshCw
} from "lucide-react";

const API = "http://localhost:5000";
const POLL_CHATS_MS     = 8000;   // refresh chat list every 8s
const POLL_MESSAGES_MS  = 5000;   // refresh active messages every 5s
const POLL_WA_MS        = 30000;  // refresh WA status every 30s

function formatRelativeTime(date) {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

const NAV = [
  { key: "overview",  label: "Overview",  Icon: LayoutDashboard },
  { key: "chats",     label: "Chats",     Icon: MessageSquare },
  { key: "workflows", label: "Workflows", Icon: Zap },
  { key: "contacts",  label: "Contacts",  Icon: Users },
  { key: "whatsapp",  label: "WhatsApp",  Icon: MessageCircle },
];

export default function Dashboard() {
  const [user,          setUser]          = useState(null);
  const [waStatus,      setWaStatus]      = useState(null);
  const [form,          setForm]          = useState({ phoneNumberId: "", wabaId: "", accessToken: "" });
  const [waLoading,     setWaLoading]     = useState(false);
  const [waMsg,         setWaMsg]         = useState({ text: "", type: "" });
  const [workflows,     setWorkflows]     = useState([]);
  const [wfLoading,     setWfLoading]     = useState(true);
  const [activeTab,     setActiveTab]     = useState("overview");
  const [webhookInfo,   setWebhookInfo]   = useState(null);
  const [copied,        setCopied]        = useState("");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  // contacts
  const [contacts,       setContacts]       = useState([]);
  const [contactStats,   setContactStats]   = useState(null);
  const [contactsLoading,setContactsLoading]= useState(false);
  const [contactSearch,  setContactSearch]  = useState("");
  const [contactPage,    setContactPage]    = useState(1);
  const [contactTotal,   setContactTotal]   = useState(0);
  const [selectedContact,setSelectedContact]= useState(null);
  const [contactNotes,   setContactNotes]   = useState("");

  // chats
  const [chats,          setChats]          = useState([]);
  const [chatsLoading,   setChatsLoading]   = useState(false);
  const [selectedChat,   setSelectedChat]   = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [messagesLoading,setMessagesLoading]= useState(false);
  const [replyText,      setReplyText]      = useState("");
  const [sendingReply,   setSendingReply]   = useState(false);
  const [overviewStats,  setOverviewStats]  = useState(null);

  // refs
  const chatEndRef        = useRef(null);
  const messagesContainer = useRef(null);
  const chatPollRef       = useRef(null);
  const msgPollRef        = useRef(null);
  const waPollRef         = useRef(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const headers  = { Authorization: `Bearer ${token}` };

  // ─── AUTH ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/api/user/me`, { headers })
      .then(r => setUser(r.data))
      .catch(() => { localStorage.removeItem("token"); navigate("/login"); });
  }, []);

  // ─── WA STATUS (+ polling) ──────────────────────────────────────────────────
  const fetchWaStatus = useCallback(() => {
    axios.get(`${API}/api/whatsapp/status`, { headers })
      .then(r => setWaStatus(r.data))
      .catch(() => setWaStatus({ connected: false }));
  }, []);

  useEffect(() => {
    fetchWaStatus();
    waPollRef.current = setInterval(fetchWaStatus, POLL_WA_MS);
    return () => clearInterval(waPollRef.current);
  }, [fetchWaStatus]);

  // ─── WORKFLOWS ──────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/api/workflows`, { headers })
      .then(r => setWorkflows(r.data))
      .catch(() => {})
      .finally(() => setWfLoading(false));
  }, []);

  // ─── OVERVIEW STATS (fetched once on mount) ─────────────────────────────────
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/contacts/stats`, { headers }),
      axios.get(`${API}/api/contacts?page=1&limit=1`, { headers }),
    ])
      .then(([sRes, cRes]) => {
        setContactStats(sRes.data);
        setOverviewStats(sRes.data);
        setContactTotal(cRes.data.total);
      })
      .catch(() => {});
  }, []);

  // ─── WEBHOOK INFO ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "whatsapp") return;
    axios.get(`${API}/api/whatsapp/webhook-info`, { headers })
      .then(r => setWebhookInfo(r.data))
      .catch(() => {});
  }, [activeTab]);

  // ─── CHATS (+ polling when on chats tab) ─────────────────────────────────────
  const fetchChats = useCallback(() => {
    axios.get(`${API}/api/chats`, { headers })
      .then(r => setChats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab !== "chats") {
      clearInterval(chatPollRef.current);
      return;
    }
    setChatsLoading(true);
    axios.get(`${API}/api/chats`, { headers })
      .then(r => setChats(r.data))
      .catch(() => {})
      .finally(() => setChatsLoading(false));

    chatPollRef.current = setInterval(fetchChats, POLL_CHATS_MS);
    return () => clearInterval(chatPollRef.current);
  }, [activeTab, fetchChats]);

  // ─── MESSAGES (+ polling when a chat is selected) ────────────────────────────
  const fetchMessages = useCallback(() => {
    if (!selectedChat) return;
    axios.get(`${API}/api/chats/${selectedChat._id}/messages`, { headers })
      .then(r => setActiveMessages(r.data))
      .catch(() => {});
  }, [selectedChat]);

  useEffect(() => {
    clearInterval(msgPollRef.current);
    if (!selectedChat) { setActiveMessages([]); return; }

    setMessagesLoading(true);
    axios.get(`${API}/api/chats/${selectedChat._id}/messages`, { headers })
      .then(r => setActiveMessages(r.data))
      .catch(err => console.error("Failed to load messages", err))
      .finally(() => setMessagesLoading(false));

    msgPollRef.current = setInterval(fetchMessages, POLL_MESSAGES_MS);
    return () => clearInterval(msgPollRef.current);
  }, [selectedChat]);

  // ─── AUTO-SCROLL to bottom when messages change ───────────────────────────────
  useEffect(() => {
    if (!chatEndRef.current) return;
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // ─── CONTACTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "contacts") return;
    setContactsLoading(true);
    Promise.all([
      axios.get(`${API}/api/contacts?page=${contactPage}&limit=20&search=${contactSearch}`, { headers }),
      axios.get(`${API}/api/contacts/stats`, { headers }),
    ])
      .then(([cRes, sRes]) => {
        setContacts(cRes.data.contacts);
        setContactTotal(cRes.data.total);
        setContactStats(sRes.data);
      })
      .catch(() => {})
      .finally(() => setContactsLoading(false));
  }, [activeTab, contactPage, contactSearch]);

  // ─── HANDLERS ────────────────────────────────────────────────────────────────
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleWaConnect = async (e) => {
    e.preventDefault();
    setWaLoading(true);
    try {
      const res = await axios.post(`${API}/api/whatsapp/connect`, form, { headers });
      setWaMsg({ text: res.data.message, type: "success" });
      setWaStatus({ connected: true, ...form });
    } catch {
      setWaMsg({ text: "Connection failed. Check your credentials.", type: "error" });
    } finally { setWaLoading(false); }
  };

  const handleWaDisconnect = async () => {
    if (!window.confirm("Disconnect WhatsApp?")) return;
    await axios.delete(`${API}/api/whatsapp/disconnect`, { headers });
    setWaStatus({ connected: false });
    setWaMsg({ text: "Disconnected successfully.", type: "success" });
  };

  const handleToggleWorkflow = async (id) => {
    try {
      const res = await axios.patch(`${API}/api/workflows/${id}/toggle`, {}, { headers });
      setWorkflows(wfs => wfs.map(w => w._id === id ? { ...w, isActive: res.data.isActive } : w));
    } catch {}
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm("Delete this workflow?")) return;
    await axios.delete(`${API}/api/workflows/${id}`, { headers });
    setWorkflows(wfs => wfs.filter(w => w._id !== id));
  };

  // ─── SEND REPLY ──────────────────────────────────────────────────────────────
  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!text || !selectedChat || sendingReply) return;
    setSendingReply(true);
    const optimistic = {
      _id: `opt-${Date.now()}`,
      text,
      from: "admin",
      type: "text",
      createdAt: new Date().toISOString(),
    };
    setActiveMessages(prev => [...prev, optimistic]);
    setReplyText("");
    try {
      await axios.post(
        `${API}/api/chats/${selectedChat._id}/messages`,
        { text, type: "text" },
        { headers }
      );
      // real fetch to replace optimistic
      fetchMessages();
    } catch {
      // revert optimistic on failure
      setActiveMessages(prev => prev.filter(m => m._id !== optimistic._id));
      setReplyText(text);
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // ─── EXPORT ──────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const res = await axios.get(`${API}/api/contacts?limit=1000`, { headers });
      const data = res.data.contacts;
      if (!data || data.length === 0) return alert("No contacts to export");
      const csvHeaders = ["Name", "Phone", "Messages", "Last Active", "Notes"];
      const rows = data.map(c => [
        `"${c.name || "Unknown"}"`,
        `"${c.phone}"`,
        c.messageCount,
        `"${new Date(c.lastActive).toLocaleString()}"`,
        `"${c.notes || ""}"`,
      ]);
      const csvContent = [csvHeaders.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contacts_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to export contacts");
    }
  };

  // ─── SAVE CONTACT NOTES ───────────────────────────────────────────────────────
  const handleSaveNotes = async () => {
    if (!selectedContact) return;
    try {
      await axios.patch(
        `${API}/api/contacts/${selectedContact._id}`,
        { notes: contactNotes },
        { headers }
      );
      setContacts(prev =>
        prev.map(c => c._id === selectedContact._id ? { ...c, notes: contactNotes } : c)
      );
    } catch {}
    setSelectedContact(null);
  };

  const activeCount = workflows.filter(w => w.isActive).length;
  const webhookUrl  = webhookInfo?.webhookUrl || `${window.location.origin}/api/webhook`;
  const navTo = (key) => { setActiveTab(key); setSidebarOpen(false); };

  const S = {
    green:       "#25d366",
    greenDark:   "#16a34a",
    greenDeep:   "#065f56",
    greenBg:     "rgba(37,211,102,0.07)",
    greenBorder: "rgba(37,211,102,0.18)",
    darkBg:      "linear-gradient(135deg,#022c22 0%,#065f56 100%)",
    pageBg:      "linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)",
    surface:     "#ffffff",
    textPrimary: "#0a0a0a",
    textMuted:   "rgba(0,0,0,0.45)",
    textFaint:   "rgba(0,0,0,0.3)",
    border:      "rgba(37,211,102,0.12)",
    monoFont:    "'DM Mono', monospace",
    font:        "'DM Sans','Sora',system-ui,sans-serif",
    card:        { background: "#fff", border: "1px solid rgba(37,211,102,0.12)", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" },
    greenGrad:   "linear-gradient(135deg,#25d366,#16a34a)",
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: S.font, background: S.pageBg }}>
      <style>
        {`
        /* ... existing animations ... */

/* Mobile Sidebar (Hidden by default) */
.wpl-sidebar {
  transform: translateX(-100%);
}

/* Mobile Sidebar (When Open) */
.wpl-sidebar.open {
  transform: translateX(0) !important;
}

/* Main Content Adjustments */
.wpl-main {
  margin-left: 0 !important; /* Full width on mobile */
  width: 100%;
}

/* Desktop override (1024px and up) */
@media (min-width: 1024px) {
  .wpl-sidebar {
    transform: translateX(0) !important;
  }
  .wpl-main {
    margin-left: 218px !important; /* Push content for sidebar */
  }
  .wpl-hamburger {
    display: none !important; /* Hide menu button on desktop */
  }
  .wpl-overlay {
    display: none !important; /* Hide backdrop on desktop */
  }
}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes wpl-ping   { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes wpl-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wpl-spin   { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        .dnav:hover  { background: rgba(37,211,102,0.07) !important; color: #16a34a !important; }
        .dnav.on     { background: linear-gradient(135deg,#25d366,#16a34a) !important; color:#fff !important; box-shadow:0 8px 20px rgba(37,211,102,0.25); }
        .dcard       { transition: transform 0.2s, box-shadow 0.2s; }
        .dcard:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; }
        .drow:hover  { background: #f0fdf8 !important; }
        .dib         { transition:all 0.15s; border-radius:8px; padding:5px; border:none; cursor:pointer; background:none; }
        .dib:hover   { background:rgba(37,211,102,0.1); color:#16a34a !important; }
        .dib.rd:hover{ background:rgba(239,68,68,0.08); color:#dc2626 !important; }
        .dinput:focus{ border-color:rgba(37,211,102,0.5) !important; outline:none; }
        .dqbtn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.08) !important; }
        .spin        { animation: wpl-spin 0.8s linear infinite; }
        .chat-item:hover { background: #f0fdf8 !important; }
        .reply-input:focus { border-color: rgba(37,211,102,0.4) !important; outline: none; box-shadow: 0 0 0 3px rgba(37,211,102,0.08); }
        ::-webkit-scrollbar        { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track  { background: transparent; }
        ::-webkit-scrollbar-thumb  { background: rgba(37,211,102,0.2); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(37,211,102,0.4); }
      `}
      
      
      </style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`wpl-sidebar ${sidebarOpen ? "open" : ""}`} style={{
    width: 218, flexShrink: 0, display: "flex", flexDirection: "column",
    background: S.surface, borderRight: `1px solid ${S.border}`,
    position: "fixed", inset: "0 auto 0 0", zIndex: 50,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother slide
  }}>
        {/* Logo */}
        <div style={{ height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}>
              <MessageCircle size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.04em" }}>WPLeads</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: S.textMuted }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
          <p style={{ padding: "4px 10px 10px", fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont }}>Menu</p>
          {NAV.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => navTo(key)}
              className={`dnav${activeTab === key ? " on" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: S.font, fontSize: 13, fontWeight: 600, textAlign: "left", color: activeTab === key ? "#fff" : S.textMuted, background: "transparent", transition: "all 0.15s" }}>
              <Icon size={15} strokeWidth={activeTab === key ? 2.5 : 2} />
              {label}
              {key === "workflows" && workflows.length > 0 && (
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: activeTab === key ? "rgba(255,255,255,0.2)" : S.greenBg, color: activeTab === key ? "#fff" : S.greenDark }}>
                  {workflows.length}
                </span>
              )}
              {key === "chats" && chats.length > 0 && (
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: activeTab === key ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.08)", color: activeTab === key ? "#fff" : "#2563eb" }}>
                  {chats.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "10px", borderTop: `1px solid ${S.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 16, background: S.greenBg, border: `1px solid ${S.greenBorder}` }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "User"}</p>
              <p style={{ fontSize: 10, color: S.textMuted }}>Admin</p>
            </div>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", color: S.textFaint, padding: 4, borderRadius: 6, transition: "color 0.15s" }}
              onMouseOver={e => e.currentTarget.style.color = "#dc2626"}
              onMouseOut={e => e.currentTarget.style.color = S.textFaint}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="wpl-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", marginLeft: 218 }}>

        {/* Topbar */}
        <header style={{ height: 62, background: S.surface, borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: S.textMuted, padding: 4 }}>
              <Menu size={18} />
            </button>
            <h1 style={{ fontSize: 17, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.03em", textTransform: "capitalize" }}>{activeTab}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* WA status pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: waStatus?.connected ? S.greenBg : "rgba(0,0,0,0.04)", border: `1px solid ${waStatus?.connected ? S.greenBorder : "rgba(0,0,0,0.08)"}`, color: waStatus?.connected ? S.greenDark : S.textMuted }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: waStatus?.connected ? S.green : "#d1d5db", animation: waStatus?.connected ? "wpl-ping 1.5s ease-in-out infinite" : "none" }} />
              {waStatus?.connected ? "Connected" : "Offline"}
            </div>
            {activeTab === "workflows" && (
              <button onClick={() => navigate("/workflow/new")}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", borderRadius: 12, background: S.greenGrad, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font, boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}>
                <Plus size={13} /> New workflow
              </button>
            )}
            {activeTab === "chats" && (
              <button onClick={fetchChats} title="Refresh chats"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
                <RefreshCw size={13} /> Refresh
              </button>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        {/* Chats tab gets its own full-height layout, other tabs scroll normally */}
        {activeTab === "chats" ? (

          /* ─── CHATS (INBOX) — full height, no outer scroll ─────────────────── */
          <div style={{ flex: 1, overflow: "hidden", padding: 16 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              height: "100%",
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${S.border}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              animation: "wpl-fadein 0.4s ease both",
            }}>

              {/* LEFT: chat list */}
              <div style={{ borderRight: `1px solid ${S.border}`, display: "flex", flexDirection: "column", background: "#fcfdfe", minHeight: 0 }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em" }}>Messages</h3>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: S.greenDark }}>
                    <MessageSquare size={13} />
                  </div>
                </div>

                {/* scrollable chat list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {chatsLoading ? (
                    <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>
                      <Activity size={18} style={{ animation: "wpl-ping 1.5s infinite" }} />
                    </div>
                  ) : chats.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>
                      <MessageSquare size={28} color="rgba(37,211,102,0.25)" style={{ marginBottom: 10 }} />
                      <p style={{ fontSize: 12 }}>No conversations yet</p>
                    </div>
                  ) : chats.map(chat => (
                    <div key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className="chat-item"
                      style={{
                        padding: "14px 18px",
                        cursor: "pointer",
                        borderBottom: `1px solid rgba(0,0,0,0.03)`,
                        display: "flex",
                        gap: 11,
                        alignItems: "center",
                        background: selectedChat?._id === chat._id ? S.greenBg : "transparent",
                        borderLeft: selectedChat?._id === chat._id ? `3px solid ${S.green}` : "3px solid transparent",
                        transition: "all 0.15s",
                      }}>
                      <div style={{ width: 40, height: 40, borderRadius: 13, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0, boxShadow: "0 3px 8px rgba(37,211,102,0.2)" }}>
                        {chat.name?.charAt(0).toUpperCase() || "#"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {chat.name || chat.phone}
                          </p>
                          <span style={{ fontSize: 10, color: S.textFaint, flexShrink: 0 }}>{formatRelativeTime(chat.lastActive)}</span>
                        </div>
                        <p style={{ fontSize: 11, color: S.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                          {chat.lastMessage || "Media message"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: conversation pane */}
              <div style={{ display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: 0 }}>
                {selectedChat ? (
                  <>
                    {/* Chat header */}
                    <div style={{ padding: "12px 22px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
                          {selectedChat.name?.charAt(0).toUpperCase() || "#"}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary }}>{selectedChat.name || selectedChat.phone}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: S.green, animation: "wpl-ping 2s ease-in-out infinite" }} />
                            <p style={{ fontSize: 10, color: S.greenDark, fontWeight: 600 }}>Active via WhatsApp</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button onClick={fetchMessages} title="Refresh messages"
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.font }}>
                          <RefreshCw size={11} /> Sync
                        </button>
                      </div>
                    </div>

                    {/* Messages area — this is the only scrollable part */}
                    <div
                      ref={messagesContainer}
                      style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {messagesLoading ? (
                        <div style={{ textAlign: "center", marginTop: 30, color: S.textMuted }}>
                          <Activity size={20} color={S.green} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
                        </div>
                      ) : activeMessages.length === 0 ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.textMuted, paddingTop: 60 }}>
                          <MessageSquare size={28} color="rgba(37,211,102,0.2)" style={{ marginBottom: 10 }} />
                          <p style={{ fontSize: 12 }}>No messages yet</p>
                        </div>
                      ) : activeMessages.map((m) => {
                        const isMe        = m.from === "bot" || m.from === "admin";
                        const isButtonMsg = m.type === "interactive" || m.metadata?.buttons;
                        const isOptimistic= m._id?.startsWith("opt-");

                        return (
                          <div key={m._id} style={{
                            alignSelf: isMe ? "flex-end" : "flex-start",
                            maxWidth: isButtonMsg ? "280px" : "72%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMe ? "flex-end" : "flex-start",
                            opacity: isOptimistic ? 0.7 : 1,
                            transition: "opacity 0.3s",
                          }}>
                            <div style={{
                              padding: isButtonMsg ? "0" : (m.type === "image" ? "6px" : "10px 14px"),
                              borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                              background: isMe ? S.greenGrad : "#fff",
                              color: isMe ? "#fff" : S.textPrimary,
                              fontSize: 13,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              border: isMe ? "none" : `1px solid ${S.border}`,
                              overflow: "hidden",
                            }}>

                              {/* Interactive / buttons */}
                              {isButtonMsg && (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  {m.metadata?.header && <div style={{ padding: "10px 14px 4px", fontWeight: 800, fontSize: 12 }}>{m.metadata.header}</div>}
                                  <div style={{ padding: "8px 14px 10px", whiteSpace: "pre-wrap" }}>{m.text || m.metadata?.body}</div>
                                  {m.metadata?.footer && <div style={{ padding: "0 14px 10px", fontSize: 10, opacity: 0.6 }}>{m.metadata.footer}</div>}
                                  <div style={{ display: "flex", flexDirection: "column", borderTop: isMe ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f1f5f9" }}>
                                    {m.metadata?.buttons?.map((btn, idx) => (
                                      <div key={idx} style={{ padding: "10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: isMe ? "#fff" : "#2563eb", borderTop: idx > 0 ? (isMe ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f1f5f9") : "none", background: "rgba(0,0,0,0.02)" }}>
                                        {btn.title}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Image */}
                              {m.type === "image" && (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <img src={m.media?.url || "https://placehold.co/400x300?text=Image+Expired"}
                                    style={{ width: "100%", borderRadius: 10, display: "block" }} alt="attachment" />
                                  {m.text && <p style={{ padding: "8px 10px 4px" }}>{m.text}</p>}
                                </div>
                              )}

                              {/* Button reply */}
                              {(m.type === "button_reply" || m.type === "list_reply") && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}>
                                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Check size={10} />
                                  </div>
                                  <span style={{ fontWeight: 600 }}>{m.text}</span>
                                </div>
                              )}

                              {/* Text */}
                              {m.type === "text" && !isButtonMsg && (
                                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{m.text}</p>
                              )}

                              {/* Timestamp */}
                              {!isButtonMsg && (
                                <div style={{ fontSize: 9, textAlign: "right", marginTop: 4, opacity: 0.55, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  {isMe && <Check size={9} />}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Scroll anchor */}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Reply bar */}
                    <div style={{ padding: "12px 16px", background: "#fff", borderTop: `1px solid ${S.border}`, display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
                      <textarea
                        className="reply-input"
                        rows={1}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={handleReplyKeyDown}
                        placeholder="Type a reply… (Enter to send, Shift+Enter for newline)"
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: 14,
                          border: `1px solid ${S.border}`,
                          fontSize: 13,
                          background: "#f9fafb",
                          fontFamily: S.font,
                          resize: "none",
                          maxHeight: 120,
                          lineHeight: 1.5,
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendingReply}
                        style={{
                          width: 42, height: 42, borderRadius: 13,
                          background: replyText.trim() ? S.greenGrad : "rgba(0,0,0,0.06)",
                          color: replyText.trim() ? "#fff" : S.textFaint,
                          border: "none", cursor: replyText.trim() ? "pointer" : "default",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: replyText.trim() ? "0 4px 12px rgba(37,211,102,0.3)" : "none",
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}>
                        {sendingReply
                          ? <Activity size={16} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
                          : <Send size={16} />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.textMuted }}>
                    <div style={{ width: 60, height: 60, borderRadius: 20, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <MessageSquare size={28} color={S.green} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em" }}>Your Conversations</h3>
                    <p style={{ fontSize: 13, marginTop: 6, opacity: 0.55 }}>Select a lead from the sidebar to view their history</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        ) : (
          /* ─── ALL OTHER TABS — scrollable ──────────────────────────────────── */
          <main style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ padding: 24, margin: "0 auto" }}>

              {/* ─── OVERVIEW ─── */}
              {activeTab === "overview" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 16 }}>

                    {/* Hero dark card */}
                    <div style={{ gridColumn: "span 2", borderRadius: 28, padding: "32px 36px", position: "relative", overflow: "hidden", background: S.darkBg, boxShadow: "0 24px 60px rgba(6,95,86,0.22)" }}>
                      <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,211,102,0.2) 0%,transparent 65%)", pointerEvents: "none" }} />
                      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: S.monoFont, marginBottom: 14 }}>
                        <Activity size={10} /> Live automation
                      </p>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 60, fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1 }}>{activeCount}</span>
                        <span style={{ fontSize: 26, fontWeight: 300, color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>/ {workflows.length}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>workflows active right now</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => navigate("/workflow/new")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 12, background: "#fff", border: "none", color: S.greenDeep, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
                          <Plus size={13} /> New workflow
                        </button>
                        <button onClick={() => navTo("workflows")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.font }}>
                          View all <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Contacts card */}
                    <div className="dcard" style={{ ...S.card, padding: "22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont }}>Contacts</span>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Users size={14} color={S.greenDark} />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1 }}>{contactTotal || overviewStats?.total || 0}</p>
                      <p style={{ fontSize: 12, color: S.textMuted, marginTop: 4 }}>total in database</p>
                      {overviewStats?.newToday > 0 && (
                        <p style={{ fontSize: 11, color: S.greenDark, marginTop: 6, fontWeight: 600 }}>+{overviewStats.newToday} today</p>
                      )}
                    </div>

                    {/* WA status card */}
                    <div className="dcard" style={{ ...S.card, padding: "22px 24px", background: waStatus?.connected ? "rgba(37,211,102,0.05)" : "#fff", border: waStatus?.connected ? `1px solid ${S.greenBorder}` : "1px solid rgba(0,0,0,0.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont }}>WhatsApp</span>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: waStatus?.connected ? S.greenBg : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {waStatus?.connected ? <Wifi size={14} color={S.greenDark} /> : <WifiOff size={14} color="#9ca3af" />}
                        </div>
                      </div>
                      <p style={{ fontSize: 20, fontWeight: 800, color: waStatus?.connected ? S.greenDark : "#9ca3af" }}>{waStatus?.connected ? "Live" : "Offline"}</p>
                      <p style={{ fontSize: 12, color: S.textMuted, marginTop: 4 }}>Cloud API gateway</p>
                    </div>

                    {/* Chats card */}
                    <div className="dcard" style={{ ...S.card, padding: "22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont }}>Conversations</span>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(37,99,235,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MessageSquare size={14} color="#2563eb" />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1 }}>{chats.length}</p>
                      <p style={{ fontSize: 12, color: S.textMuted, marginTop: 4 }}>active chats</p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont, marginBottom: 12 }}>Quick actions</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                    {[
                      { label: "My Conversations", desc: "View recent chats",    Icon: MessageSquare, col: "#16a34a", bg: "rgba(22,163,74,0.07)",   border: "rgba(22,163,74,0.18)",   action: () => navTo("chats") },
                      { label: "Create workflow",   desc: "Automate responses",  Icon: Zap,           col: "#2563eb", bg: "rgba(37,99,235,0.07)",   border: "rgba(37,99,235,0.14)",   action: () => navigate("/workflow/new") },
                      { label: "Manage WhatsApp",   desc: "Connect your number", Icon: MessageCircle, col: S.greenDark, bg: S.greenBg,             border: S.greenBorder,            action: () => navTo("whatsapp") },
                      { label: "View contacts",     desc: "Browse your audience",Icon: Users,         col: "#7c3aed", bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.14)", action: () => navTo("contacts") },
                    ].map(({ label, desc, Icon, col, bg, border, action }) => (
                      <button key={label} onClick={action} className="dqbtn"
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 20, background: "#fff", border: `1px solid ${border}`, cursor: "pointer", textAlign: "left", fontFamily: S.font, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={17} color={col} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary }}>{label}</p>
                          <p style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── WORKFLOWS ─── */}
              {activeTab === "workflows" && (
                <div style={{ ...S.card, overflow: "hidden", animation: "wpl-fadein 0.4s ease both" }}>
                  {wfLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "80px 0", color: S.textMuted, fontSize: 13 }}>
                      <Activity size={14} style={{ animation: "wpl-ping 1.5s ease-in-out infinite" }} /> Loading…
                    </div>
                  ) : workflows.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "90px 0", textAlign: "center" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 18, background: S.greenBg, border: `1px solid ${S.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Zap size={22} color={S.green} />
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: S.textPrimary, marginBottom: 6 }}>No workflows yet</p>
                      <p style={{ fontSize: 13, color: S.textMuted, marginBottom: 20 }}>Create your first automation</p>
                      <button onClick={() => navigate("/workflow/new")}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 12, background: S.greenGrad, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font, boxShadow: "0 6px 18px rgba(37,211,102,0.3)" }}>
                        <Plus size={14} /> Create workflow
                      </button>
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${S.border}` }}>
                          {["Workflow", "Trigger", "Status", ""].map((h, i) => (
                            <th key={i} style={{ padding: "14px 20px", fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: i === 3 ? "right" : "left", fontFamily: S.monoFont }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {workflows.map(wf => (
                          <tr key={wf._id} className="drow" style={{ borderBottom: `1px solid rgba(37,211,102,0.06)`, transition: "background 0.1s" }}>
                            <td style={{ padding: "14px 20px" }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary }}>{wf.name}</p>
                              <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: S.textMuted, marginTop: 2 }}>
                                <Hash size={9} /> {wf.nodes?.length || 0} nodes
                              </p>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <code style={{ fontSize: 11, background: S.greenBg, color: S.greenDark, padding: "3px 10px", borderRadius: 7, fontFamily: S.monoFont, fontWeight: 600, border: `1px solid ${S.greenBorder}` }}>
                                {wf.nodes?.[0]?.data?.keyword || "Any"}
                              </code>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <button onClick={() => handleToggleWorkflow(wf._id)}
                                style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.font, background: wf.isActive ? S.greenBg : "rgba(0,0,0,0.05)", color: wf.isActive ? S.greenDark : S.textMuted }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: wf.isActive ? S.green : "#9ca3af", animation: wf.isActive ? "wpl-ping 1.5s ease-in-out infinite" : "none" }} />
                                {wf.isActive ? "Active" : "Paused"}
                              </button>
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "right" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                <button className="dib" title="Edit" style={{ color: S.textFaint }} onClick={() => navigate(`/workflow/${wf._id}`)}>
                                  <Pencil size={14} />
                                </button>
                                <button className="dib rd" title="Delete" style={{ color: S.textFaint }} onClick={() => handleDeleteWorkflow(wf._id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ─── WHATSAPP ─── */}
              {activeTab === "whatsapp" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, animation: "wpl-fadein 0.4s ease both" }}>
                  {/* Connect card */}
                  <div style={{ borderRadius: 28, padding: "32px", position: "relative", overflow: "hidden", background: S.darkBg, boxShadow: "0 24px 60px rgba(6,95,86,0.22)" }}>
                    <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,211,102,0.18) 0%,transparent 65%)", pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <MessageCircle size={13} color="#4ade80" />
                      <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: S.monoFont }}>Cloud API</span>
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 20 }}>WhatsApp Gateway</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 12, marginBottom: 22, background: waStatus?.connected ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 600, color: waStatus?.connected ? "#4ade80" : "rgba(255,255,255,0.35)" }}>
                      {waStatus?.connected ? <><Wifi size={12} />Connected and active</> : <><WifiOff size={12} />Not connected</>}
                    </div>
                    {!waStatus?.connected ? (
                      <form onSubmit={handleWaConnect}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                          {[["Phone Number ID", "phoneNumberId", "123456…"], ["WABA ID", "wabaId", "987654…"]].map(([label, key, ph]) => (
                            <div key={key}>
                              <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: S.font }}>{label}</label>
                              <input className="dinput" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#fff", fontFamily: S.monoFont }}
                                placeholder={ph} required onChange={e => setForm({ ...form, [key]: e.target.value })} />
                            </div>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: S.font }}>Access Token</label>
                          <input type="password" className="dinput" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#fff", fontFamily: S.font }}
                            placeholder="EAAxxxxx…" required onChange={e => setForm({ ...form, accessToken: e.target.value })} />
                        </div>
                        <button type="submit" disabled={waLoading}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: S.greenGrad, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font, boxShadow: "0 8px 24px rgba(37,211,102,0.3)", opacity: waLoading ? 0.7 : 1 }}>
                          {waLoading ? <><Activity size={12} style={{ animation: "wpl-spin 0.8s linear infinite" }} />Connecting…</> : <><Wifi size={13} />Connect</>}
                        </button>
                      </form>
                    ) : (
                      <div>
                        <div style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
                          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8, fontFamily: S.monoFont }}>Active number ID</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", fontFamily: S.monoFont, wordBreak: "break-all" }}>{waStatus.phoneNumberId}</p>
                        </div>
                        <button onClick={handleWaDisconnect}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
                          <WifiOff size={13} /> Disconnect
                        </button>
                      </div>
                    )}
                    {waMsg.text && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "9px 14px", borderRadius: 12, background: waMsg.type === "success" ? "rgba(37,211,102,0.12)" : "rgba(239,68,68,0.12)", color: waMsg.type === "success" ? "#4ade80" : "#f87171", fontSize: 12 }}>
                        {waMsg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {waMsg.text}
                      </div>
                    )}
                  </div>

                  {/* Webhook card */}
                  <div style={{ ...S.card, padding: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                      <Bell size={16} color={S.greenDark} />
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Webhook setup</h3>
                    </div>
                    <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 24 }}>Paste these into your Meta App Dashboard.</p>
                    {[
                      { label: "Callback URL",  value: webhookUrl,                              key: "url" },
                      { label: "Verify Token", value: webhookInfo?.verifyToken || "Loading…", key: "token" },
                    ].map(({ label, value, key }) => (
                      <div key={key} style={{ marginBottom: 18 }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>{label}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 11, fontFamily: S.monoFont, color: S.greenDeep, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                          <button onClick={() => copyToClipboard(value, key)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: copied === key ? `1px solid ${S.greenBorder}` : "1px solid rgba(0,0,0,0.1)", background: copied === key ? S.greenBg : "#fff", color: copied === key ? S.greenDark : S.textMuted }}>
                            {copied === key ? <><Check size={11} />Copied</> : <><Copy size={11} />Copy</>}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, padding: "14px 16px", borderRadius: 16, background: "#fffbeb", border: "1px solid #fde68a" }}>
                      <AlertCircle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.65 }}>
                        Subscribe to <strong>messages</strong> webhook field in Meta Developer Console after pasting these values.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── CONTACTS ─── */}
              {activeTab === "contacts" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 16 }}>
                    {[
                      { label: "Total contacts",   val: contactStats?.total,         Icon: Users,      col: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
                      { label: "New today",         val: contactStats?.newToday,       Icon: TrendingUp, col: "#2563eb", bg: "rgba(37,99,235,0.08)"   },
                      { label: "Active this week",  val: contactStats?.activeThisWeek, Icon: Activity,   col: S.greenDark, bg: S.greenBg              },
                    ].map(({ label, val, Icon, col, bg }) => (
                      <div key={label} className="dcard" style={{ ...S.card, display: "flex", alignItems: "center", gap: 14, padding: "18px 22px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={17} color={col} />
                        </div>
                        <div>
                          <p style={{ fontSize: 28, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.04em", lineHeight: 1 }}>{val ?? 0}</p>
                          <p style={{ fontSize: 11, color: S.textMuted, marginTop: 3 }}>{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ ...S.card, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                        <Search size={13} style={{ position: "absolute", left: 12, color: S.textFaint }} />
                        <input className="dinput"
                          style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, width: 260 }}
                          placeholder="Search contacts…" value={contactSearch}
                          onChange={e => { setContactSearch(e.target.value); setContactPage(1); }} />
                      </div>
                      <button onClick={handleExport}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font, transition: "all 0.2s" }}
                        onMouseOver={e => e.currentTarget.style.background = S.greenBg}
                        onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                        <Download size={14} /> Export CSV
                      </button>
                    </div>

                    {contactsLoading ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "70px 0", color: S.textMuted, fontSize: 13 }}>
                        <Activity size={14} style={{ animation: "wpl-ping 1.5s ease-in-out infinite" }} /> Loading contacts…
                      </div>
                    ) : contacts.length === 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 0" }}>
                        <Users size={26} color="rgba(37,211,102,0.3)" style={{ marginBottom: 10 }} />
                        <p style={{ fontSize: 13, color: S.textMuted }}>No contacts found</p>
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${S.border}` }}>
                            {["Contact", "Messages", "Last active", ""].map((h, i) => (
                              <th key={i} style={{ padding: "12px 20px", fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: i === 3 ? "right" : "left", fontFamily: S.monoFont }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map(c => (
                            <tr key={c._id} className="drow" style={{ borderBottom: `1px solid rgba(37,211,102,0.05)`, transition: "background 0.1s" }}>
                              <td style={{ padding: "12px 20px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                                    {c.name?.charAt(0)?.toUpperCase() || "#"}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary }}>{c.name || "Unknown"}</p>
                                    <p style={{ fontSize: 10, color: S.textMuted, fontFamily: S.monoFont }}>+{c.phone}</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "12px 20px" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: S.greenBg, color: S.greenDark, border: `1px solid ${S.greenBorder}` }}>
                                  <MessageCircle size={9} /> {c.messageCount}
                                </span>
                              </td>
                              <td style={{ padding: "12px 20px" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: S.textMuted }}>
                                  <Clock size={10} /> {formatRelativeTime(c.lastActive)}
                                </span>
                              </td>
                              <td style={{ padding: "12px 20px", textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                  <button className="dib" title="View" style={{ color: S.textFaint }}
                                    onClick={() => { setSelectedContact(c); setContactNotes(c.notes || ""); }}>
                                    <CircleDot size={14} />
                                  </button>
                                  <button className="dib rd" title="Delete" style={{ color: S.textFaint }}
                                    onClick={() => {
                                      if (window.confirm("Delete contact?"))
                                        axios.delete(`${API}/api/contacts/${c._id}`, { headers })
                                          .then(() => {
                                            setContacts(prev => prev.filter(x => x._id !== c._id));
                                            setContactTotal(t => t - 1);
                                          });
                                    }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {contactTotal > 20 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: `1px solid ${S.border}` }}>
                        <p style={{ fontSize: 11, color: S.textMuted }}>Page <strong style={{ color: S.textPrimary }}>{contactPage}</strong> of {Math.ceil(contactTotal / 20)}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setContactPage(p => Math.max(1, p - 1))} disabled={contactPage === 1}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: "#fff", border: `1px solid ${S.greenBorder}`, color: S.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: S.font, opacity: contactPage === 1 ? 0.4 : 1 }}>
                            <ChevronLeft size={13} /> Prev
                          </button>
                          <button onClick={() => setContactPage(p => p + 1)} disabled={contactPage >= Math.ceil(contactTotal / 20)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: S.greenGrad, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font, boxShadow: "0 4px 14px rgba(37,211,102,0.28)", opacity: contactPage >= Math.ceil(contactTotal / 20) ? 0.4 : 1 }}>
                            Next <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </main>
        )}
      </div>

      {/* ── CONTACT MODAL ── */}
      {selectedContact && (
        <div onClick={e => e.target === e.currentTarget && setSelectedContact(null)}
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
          <div style={{ width: "100%", maxWidth: 400, borderRadius: 28, overflow: "hidden", background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.18)", animation: "wpl-fadein 0.25s ease both" }}>
            <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${S.border}`, position: "relative" }}>
              <button onClick={() => setSelectedContact(null)}
                style={{ position: "absolute", top: 18, right: 18, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: S.textFaint }}>
                <X size={13} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff", boxShadow: "0 6px 18px rgba(37,211,102,0.3)" }}>
                  {selectedContact.name?.charAt(0)?.toUpperCase() || "#"}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.03em" }}>{selectedContact.name || "Unknown"}</h2>
                  <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: S.textMuted, fontFamily: S.monoFont, marginTop: 2 }}>
                    <Phone size={9} /> +{selectedContact.phone}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${S.border}` }}>
              {[
                { label: "Messages",    val: selectedContact.messageCount },
                { label: "Last active", val: formatRelativeTime(selectedContact.lastActive) },
                { label: "Since",       val: new Date(selectedContact.createdAt).toLocaleDateString() },
              ].map(({ label, val }, i) => (
                <div key={label} style={{ padding: "16px 12px", textAlign: "center", borderRight: i < 2 ? `1px solid ${S.border}` : "none" }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary }}>{val}</p>
                  <p style={{ fontSize: 9, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3, fontFamily: S.monoFont }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 10 }}>
                <StickyNote size={12} /> Notes
              </label>
              <textarea className="dinput"
                style={{ width: "100%", padding: "12px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 16, color: S.textPrimary, fontFamily: S.font, resize: "none", marginBottom: 14 }}
                rows={3}
                value={contactNotes}
                onChange={e => setContactNotes(e.target.value)}
                placeholder="Add notes about this contact…" />
              <button onClick={handleSaveNotes}
                style={{ width: "100%", padding: "13px 0", borderRadius: 16, background: S.greenGrad, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: S.font, boxShadow: "0 8px 24px rgba(37,211,102,0.3)" }}>
                Save & close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}