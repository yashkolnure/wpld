
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import WhatsAppManager from "./WhatsAppManager";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Zap, Users, MessageCircle, LogOut,
  Wifi, WifiOff, Plus, Copy, Check, ChevronLeft, ChevronRight,
  Trash2, Pencil, Menu, X, ExternalLink, Bell, Search,
  TrendingUp, Activity, Clock, CircleDot, AlertCircle, Hash,
  Phone, StickyNote, Download, MessageSquare, Send, RefreshCw, Layers, Lock,
  Megaphone, QrCode, Tag, CheckCircle2, XCircle, Loader2,
  Wallet, FileText, Upload, BarChart2, Trash, Image, Video, List, MousePointerClick, Paperclip, Info,
  User, Image as ImageIcon, ShoppingBag,
} from "lucide-react";
import MyLeads from "./MyLeads";
import ShopPage from "./ShopPage";

const API = process.env.REACT_APP_API_URL || "http://localhost:5005";
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
  { key: "overview",   label: "Overview",   Icon: LayoutDashboard },
  { key: "chats",      label: "Chats",      Icon: MessageSquare },
  { key: "myleads",    label: "My Leads",   Icon: Layers },
  { key: "workflows",  label: "Workflows",  Icon: Zap },
  { key: "contacts",   label: "Contacts",   Icon: Users },
  { key: "broadcast",  label: "Broadcast",  Icon: Megaphone },
  { key: "bulk",       label: "Cold Outreach",Icon: Upload },
  { key: "templates",  label: "Templates",  Icon: FileText },
  { key: "wallet",     label: "Wallet",     Icon: Wallet },
  { key: "shop",       label: "Shop",       Icon: ShoppingBag },
  { key: "qrcode",     label: "QR & Links", Icon: QrCode },
  { key: "whatsapp",   label: "WhatsApp API",   Icon: MessageCircle },
];

// ── Template selector — only approved templates, with variable filling ────────
// Per Meta policy: only template messages can be sent outside the 24-hr window.
function TemplateSelector({ value, onChange, headers, S }) {
  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [err,       setErr]       = useState('');
  const [search,    setSearch]    = useState('');

  const load = () => {
    setLoading(true); setErr('');
    axios.get(`${API}/api/templates`, { headers })
      .then(r => setTemplates((r.data || []).filter(t => t.status === 'APPROVED')))
      .catch(() => setErr('Failed to load templates. Check your WhatsApp connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const selected = value?.templateName
    ? templates.find(t => t.name === value.templateName) || null
    : null;

  const extractVarCount = (components = []) => {
    let max = 0;
    for (const c of components) {
      const ms = (c.text || '').match(/\{\{(\d+)\}\}/g) || [];
      for (const m of ms) { const n = parseInt(m.replace(/\D/g,'')); if (n > max) max = n; }
    }
    return max;
  };

  const handleSelect = (tpl) => {
    const varCount = extractVarCount(tpl.components);
    onChange({ type:'template', templateName:tpl.name, templateLanguage:tpl.language||'en', templateComponents:tpl.components, variables:Array(varCount).fill('') });
  };

  const handleVarChange = (idx, val) => {
    const vars = [...(value?.variables||[])]; vars[idx] = val;
    onChange({ ...value, variables: vars });
  };

  const preview = (components=[], variables=[]) => {
    const body = components.find(c=>c.type==='BODY');
    if (!body) return '';
    let t = body.text||'';
    variables.forEach((v,i)=>{ if(v) t=t.replace(new RegExp(`\\{\\{${i+1}\\}\\}`,'g'),v); });
    return t;
  };

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div style={{padding:'24px',textAlign:'center',color:S.textFaint,fontSize:13}}>
      <Loader2 size={16} style={{animation:'wpl-spin 0.8s linear infinite',display:'block',margin:'0 auto 8px'}}/>
      Loading approved templates…
    </div>
  );

  if (err) return (
    <div style={{padding:'12px 14px',borderRadius:10,background:'#fee2e2',border:'1px solid #fca5a5',color:'#dc2626',fontSize:12,fontWeight:600,display:'flex',alignItems:'center',gap:8}}>
      <XCircle size={14}/> {err}
      <button onClick={load} style={{marginLeft:'auto',fontSize:11,background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontWeight:700,textDecoration:'underline'}}>Retry</button>
    </div>
  );

  if (!selected) return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(124,58,237,0.06)',border:'1px solid rgba(124,58,237,0.15)',fontSize:11.5,color:'#7c3aed',fontWeight:600}}>
        Per Meta policy, only pre-approved templates can be sent outside the 24-hour service window.
      </div>
      <div style={{display:'flex',gap:8}}>
        <input style={{flex:1,padding:'9px 12px',fontSize:12,background:S.greenBg,border:`1px solid ${S.greenBorder}`,borderRadius:10,color:S.textPrimary,fontFamily:S.font,outline:'none'}} placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <button onClick={load} style={{padding:'9px 12px',borderRadius:10,background:S.greenBg,border:`1px solid ${S.greenBorder}`,cursor:'pointer',display:'flex',alignItems:'center'}}>
          <RefreshCw size={13} color={S.greenDark}/>
        </button>
      </div>
      {filtered.length === 0 ? (
        <div style={{padding:'20px',textAlign:'center',borderRadius:10,border:`1px solid ${S.border}`}}>
          <p style={{fontSize:13,color:S.textFaint,margin:'0 0 4px'}}>No approved templates found</p>
          <p style={{fontSize:11,color:S.textFaint,margin:0}}>Go to the Templates tab to create and submit templates for Meta approval.</p>
        </div>
      ) : (
        <div style={{maxHeight:260,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
          {filtered.map(tpl=>(
            <div key={tpl.id} onClick={()=>handleSelect(tpl)}
              style={{padding:'12px 14px',borderRadius:10,border:`1px solid ${S.border}`,cursor:'pointer',background:'#fff'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                <span style={{fontSize:12,fontWeight:700,color:S.textPrimary,fontFamily:S.monoFont}}>{tpl.name}</span>
                <span style={{fontSize:10,fontWeight:700,color:'#16a34a',background:'#dcfce7',padding:'2px 8px',borderRadius:5}}>{tpl.category}</span>
              </div>
              <p style={{fontSize:11.5,color:S.textMuted,margin:'0 0 3px',lineHeight:1.4}}>{tpl.components?.find(c=>c.type==='BODY')?.text?.slice(0,100)||'No body'}</p>
              <p style={{fontSize:10,color:S.textFaint,margin:0}}>{tpl.language}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Template selected ──────────────────────────────────────────────────────
  const varCount = (value?.variables||[]).length;
  return (
    <div style={{borderRadius:12,border:`1px solid ${S.greenBorder}`,overflow:'hidden'}}>
      {/* Header bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:S.greenBg,borderBottom:`1px solid ${S.greenBorder}`}}>
        <div>
          <p style={{fontSize:12,fontWeight:800,color:S.greenDark,margin:0,fontFamily:S.monoFont}}>{selected.name}</p>
          <p style={{fontSize:10,color:S.textMuted,margin:'2px 0 0'}}>{selected.language} · {selected.category}</p>
        </div>
        <button onClick={()=>onChange({type:'template',templateName:'',variables:[]})} style={{fontSize:11,color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontWeight:700,padding:'4px 8px'}}>Change</button>
      </div>
      {/* Preview */}
      <div style={{padding:'14px 16px',background:'#f8fafc',borderBottom:varCount>0?`1px solid ${S.greenBorder}`:'none'}}>
        <p style={{fontSize:10,fontWeight:700,color:S.textMuted,textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 8px'}}>Message Preview</p>
        {selected.components?.map((comp,i)=>{
          if(comp.type==='HEADER'&&comp.format==='TEXT') return <p key={i} style={{fontSize:12,fontWeight:700,color:S.textPrimary,margin:'0 0 6px'}}>{comp.text}</p>;
          if(comp.type==='BODY') return <p key={i} style={{fontSize:12,color:S.textPrimary,margin:'0 0 6px',lineHeight:1.5,whiteSpace:'pre-wrap'}}>{preview(selected.components,value?.variables)}</p>;
          if(comp.type==='FOOTER') return <p key={i} style={{fontSize:11,color:S.textFaint,margin:0}}>{comp.text}</p>;
          if(comp.type==='BUTTONS') return <div key={i} style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:8}}>{comp.buttons?.map((btn,j)=><span key={j} style={{padding:'4px 10px',borderRadius:6,background:'#e0f2fe',color:'#0369a1',fontSize:11,fontWeight:600}}>{btn.text}</span>)}</div>;
          return null;
        })}
      </div>
      {/* Variable inputs */}
      {varCount>0 && (
        <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
          <p style={{fontSize:10,fontWeight:700,color:S.textMuted,textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>Fill Template Variables</p>
          {(value?.variables||[]).map((v,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:11,color:S.textMuted,width:30,flexShrink:0,fontFamily:S.monoFont,fontWeight:700}}>{`{{${i+1}}}`}</span>
              <input style={{flex:1,padding:'7px 10px',fontSize:12,background:S.greenBg,border:`1px solid ${S.greenBorder}`,borderRadius:8,color:S.textPrimary,fontFamily:S.font,outline:'none'}} placeholder={`Value for {{${i+1}}}`} value={v||''} onChange={e=>handleVarChange(i,e.target.value)}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reusable info tooltip — rendered into document.body via portal ───────────
// Portal escapes any parent CSS transform/overflow/stacking context completely.
function InfoTip({ title, text, width = 240, position = "top" }) {
  const [tipStyle, setTipStyle] = useState(null);
  const anchorRef = useRef(null);

  const handleMouseEnter = () => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const left = Math.max(8, Math.min(cx - width / 2, window.innerWidth - width - 8));
    const GAP = 10;
    let style;
    if (position === "bottom")  style = { top: r.bottom + GAP, left };
    else if (position === "left")  style = { top: r.top + r.height / 2 - 28, right: window.innerWidth - r.left + GAP };
    else if (position === "right") style = { top: r.top + r.height / 2 - 28, left: r.right + GAP };
    else if (r.top < 90)       style = { top: r.bottom + GAP, left };
    else                        style = { top: r.top - GAP, left, transform: "translateY(-100%)" };
    setTipStyle(style);
  };

  return (
    <span
      ref={anchorRef}
      style={{ display: "inline-flex", alignItems: "center", cursor: "help", flexShrink: 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTipStyle(null)}>
      <Info size={12} color="#94a3b8" />
      {tipStyle && createPortal(
        <div style={{
          position: "fixed", ...tipStyle, width,
          background: "#0f172a", borderRadius: 10, padding: "11px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          zIndex: 999999, pointerEvents: "none",
        }}>
          {title && <p style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", margin: "0 0 5px", lineHeight: 1.3 }}>{title}</p>}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{text}</p>
        </div>,
        document.body
      )}
    </span>
  );
}

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
  const [waConnectMode,     setWaConnectMode]     = useState(null);  // null | 'platform' | 'own' | 'facebook'
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [embeddedLoading,   setEmbeddedLoading]   = useState(false);
  const [embeddedErr,       setEmbeddedErr]       = useState('');
  const [waPromoDismissed,  setWaPromoDismissed]  = useState(() => sessionStorage.getItem("wa_promo_dismissed") === "1");


  //payments
  const [userPlan,    setUserPlan]    = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [payLoading,  setPayLoading]  = useState(false);
  const [payMsg,      setPayMsg]      = useState({ text: "", type: "" });
  const [selectedDuration, setSelectedDuration] = useState("monthly");


  // chats
  const [chats,          setChats]          = useState([]);
  const [chatsLoading,   setChatsLoading]   = useState(false);
  const [selectedChat,   setSelectedChat]   = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [messagesLoading,setMessagesLoading]= useState(false);
  const [replyText,      setReplyText]      = useState("");
  const [sendingReply,   setSendingReply]   = useState(false);
  const [overviewStats,  setOverviewStats]  = useState(null);
  const [overviewCampaigns, setOverviewCampaigns] = useState([]);

  // broadcast (upgraded)
  const [campaigns,        setCampaigns]        = useState([]);
  const [campaignForm,     setCampaignForm]     = useState({ name: '', message: { type: 'template', templateName: '' }, targetTags: [], filterLast24hrs: false });
  const [availableTags,    setAvailableTags]    = useState([]);
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastMsg,     setBroadcastMsg]     = useState({ text: '', type: '' });
  const [contactPreview,   setContactPreview]   = useState(null);
  const [active24Count,    setActive24Count]    = useState(null);

  // wallet
  const [walletData,       setWalletData]       = useState(null);
  const [walletLoading,    setWalletLoading]    = useState(false);
  const [rechargeAmount,   setRechargeAmount]   = useState('');
  const [recharging,       setRecharging]       = useState(false);
  const [walletMsg,        setWalletMsg]        = useState({ text: '', type: '' });

  // templates
  const [templates,        setTemplates]        = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [showCreateTpl,    setShowCreateTpl]    = useState(false);
  const [tplForm,          setTplForm]          = useState({ name: '', category: 'MARKETING', language: 'en', header: '', body: '', footer: '', buttons: [] });
  const [tplSaving,        setTplSaving]        = useState(false);
  const [tplMsg,           setTplMsg]           = useState({ text: '', type: '' });

  // bulk upload
  const [bulkCampaigns,    setBulkCampaigns]    = useState([]);
  const [bulkForm,         setBulkForm]         = useState({ name: '', message: { type: 'template', templateName: '' }, phoneNumbers: [] });
  const [bulkSending,      setBulkSending]      = useState(false);
  const [bulkMsg,          setBulkMsg]          = useState({ text: '', type: '' });
  const [bulkNumbers,      setBulkNumbers]      = useState([]); // { num, valid, warn, reason }
  const [bulkManualInput,  setBulkManualInput]  = useState('');
  const [bulkShowInvalid,  setBulkShowInvalid]  = useState(false);

  // qr code
  const [qrPhone,    setQrPhone]    = useState('');
  const [qrMessage,  setQrMessage]  = useState('');
  const [qrUrl,      setQrUrl]      = useState('');
  const [qrCopied,   setQrCopied]   = useState(false);

  // chat tags
  const [tagPanelOpen,       setTagPanelOpen]       = useState(false);
  const [tagInput,           setTagInput]           = useState('');
  const [tagSaving,          setTagSaving]          = useState(false);
  const [activeChatTagFilter,setActiveChatTagFilter] = useState([]);

  // attachments
  const [attachment,    setAttachment]    = useState(null); // { file, previewUrl, mediaType }
  const [uploadingFile, setUploadingFile] = useState(false);
  const attachInputRef = useRef(null);

  // message pagination
  const [hasMoreMessages,    setHasMoreMessages]    = useState(false);
  const [loadingOlderMsgs,   setLoadingOlderMsgs]   = useState(false);

  // refs
  const chatEndRef        = useRef(null);
  const messagesContainer = useRef(null);
  const chatPollRef       = useRef(null);
  const msgPollRef        = useRef(null);
  const waPollRef         = useRef(null);
  const fbSessionRef      = useRef({});        // stores { waba_id, phone_number_id } from Meta postMessage

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const headers  = { Authorization: `Bearer ${token}` };

// ── Profile state ──
const [profileForm,     setProfileForm]     = useState({ displayName: "", about: "", email: "", website: "", address: "" });
const [profileFetching, setProfileFetching] = useState(false);
const [profileLoading,  setProfileLoading]  = useState({});
const [profileMsg,      setProfileMsg]      = useState({ text: "", type: "" });
const [profilePhoto,    setProfilePhoto]    = useState({ file: null, preview: null, uploading: false, msg: null });
const [currentPhoto,    setCurrentPhoto]    = useState(null);


// ── Display Name Request State ──
const [nameStatus,       setNameStatus]       = useState(null); // APPROVED / PENDING_REVIEW / DECLINED / NONE
const [nameStatusLoading,setNameStatusLoading]= useState(false);
const [requestedName,    setRequestedName]    = useState("");
const [nameReqLoading,   setNameReqLoading]   = useState(false);
const [nameReqMsg,       setNameReqMsg]       = useState({ text: "", type: "" });

// ── Fetch phone number info (name + status) from Meta ──
const fetchNameStatus = () => {
  if (!waStatus?.connected || !waStatus?.accessToken) return;
  setNameStatusLoading(true);
  fetch(
    `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}` +
    `?fields=verified_name,name_status,quality_rating,display_phone_number,code_verification_status`,
    { headers: { Authorization: `Bearer ${waStatus.accessToken}` } }
  )
    .then(r => r.json())
    .then(data => {
      console.log("Phone number info:", data);
      setNameStatus(data);
      setRequestedName(data.verified_name || "");
    })
    .catch(err => console.error("Name status error:", err))
    .finally(() => setNameStatusLoading(false));
};

// ── Fetch on tab open ──
useEffect(() => {
  if (activeTab !== "whatsapp" || !waStatus?.connected) return;
  fetchNameStatus();
}, [activeTab, waStatus?.connected]);

// ── Submit name change request ──
const handleNameChangeRequest = async () => {
  if (!requestedName.trim() || !waStatus?.accessToken) return;
  setNameReqLoading(true);
  setNameReqMsg({ text: "", type: "" });
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}/whatsapp_business_profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${waStatus.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          name: requestedName.trim(),
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Request failed");
    setNameReqMsg({ text: "Name change request submitted! Pending Meta review.", type: "success" });
    // re-fetch status after 2s
    setTimeout(fetchNameStatus, 2000);
  } catch (err) {
    setNameReqMsg({ text: err.message, type: "error" });
  } finally {
    setNameReqLoading(false);
  }
};
// ── Fetch directly from Meta ──
useEffect(() => {
  if (activeTab !== "whatsapp" || !waStatus?.connected || !waStatus?.accessToken) return;

  setProfileFetching(true);
  fetch(
    `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}/whatsapp_business_profile` +
    `?fields=about,address,email,profile_picture_url,websites,vertical,name`,
    { headers: { Authorization: `Bearer ${waStatus.accessToken}` } }
  )
    .then(r => r.json())
    .then(data => {
      console.log("RAW META PROFILE:", data); // remove after confirming
      const p = data.data?.[0] || {};
      setProfileForm({
        displayName: p.name          || "",
        about:       p.about         || "",
        email:       p.email         || "",
        website:     p.websites?.[0] || "",
        address:     p.address       || "",
      });
      setCurrentPhoto(p.profile_picture_url || null);
    })
    .catch(err => {
      console.error("Profile fetch error:", err);
      setProfileMsg({ text: "Failed to load profile", type: "error" });
    })
    .finally(() => setProfileFetching(false));
}, [activeTab, waStatus?.connected, waStatus?.accessToken]);

// ── Update single field directly on Meta ──
const handleUpdateProfile = async (field) => {
  if (!waStatus?.connected || !waStatus?.accessToken) return;

  const fieldMap = {
    name:    "name",
    about:   "about",
    email:   "email",
    website: "websites",
    address: "address",
  };

  const formKeyMap = {
    name:    "displayName",
    about:   "about",
    email:   "email",
    website: "website",
    address: "address",
  };

  const value = field === "website"
    ? [profileForm.website]
    : profileForm[formKeyMap[field]];

  setProfileLoading(l => ({ ...l, [field]: true }));
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}/whatsapp_business_profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${waStatus.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          [fieldMap[field]]: value,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Update failed");
    setProfileMsg({ text: `✓ ${field} updated successfully!`, type: "success" });
  } catch (err) {
    console.error("Update error:", err);
    setProfileMsg({ text: err.message, type: "error" });
  } finally {
    setProfileLoading(l => ({ ...l, [field]: false }));
    setTimeout(() => setProfileMsg({ text: "", type: "" }), 3500);
  }
};

// ── Photo select ──
const handlePhotoSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setProfilePhoto(p => ({ ...p, file, preview: URL.createObjectURL(file) }));
};

// ── Upload photo directly to Meta (2-step) ──
const handlePhotoUpload = async () => {
  if (!profilePhoto.file || !waStatus?.accessToken) return;
  setProfilePhoto(p => ({ ...p, uploading: true, msg: null }));
  try {
    // Step 1 — upload media
    const formData = new FormData();
    formData.append("file", profilePhoto.file);
    formData.append("messaging_product", "whatsapp");
    formData.append("type", profilePhoto.file.type);

    const uploadRes = await fetch(
      `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}/media`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${waStatus.accessToken}` },
        body: formData,
      }
    );
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload failed");

    // Step 2 — set as profile photo
    const setRes = await fetch(
      `https://graph.facebook.com/v19.0/${waStatus.phoneNumberId}/whatsapp_business_profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${waStatus.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          profile_picture_handle: uploadData.id,
        }),
      }
    );
    const setData = await setRes.json();
    if (!setRes.ok) throw new Error(setData.error?.message || "Failed to set photo");

    setCurrentPhoto(profilePhoto.preview);
    setProfilePhoto(p => ({ ...p, uploading: false, msg: { type: "success", text: "✓ Profile photo updated!" } }));
  } catch (err) {
    setProfilePhoto(p => ({ ...p, uploading: false, msg: { type: "error", text: err.message } }));
  }
};

  // ─── AUTH ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/api/user/me`, { headers })
      .then(r => setUser(r.data))
      .catch(() => { localStorage.removeItem("token"); navigate("/login"); });
  }, []);


  // ─── WA STATUS (+ polling) ──────────────────────────────────────────────────
const fetchWaStatus = useCallback(() => {
  axios.get(`${API}/api/whatsapp/status`, { headers })
    .then(r => {
      const storedToken = localStorage.getItem("wa_token");
      setWaStatus({ ...r.data, accessToken: storedToken || r.data.accessToken });
    })
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
      axios.get(`${API}/api/broadcasts`, { headers }),
      axios.get(`${API}/api/bulk`, { headers }),
      axios.get(`${API}/api/wallet`, { headers }),
    ])
      .then(([sRes, cRes, bRes, bulkRes, wRes]) => {
        setContactStats(sRes.data);
        setOverviewStats(sRes.data);
        setContactTotal(cRes.data.total);
        const combined = [
          ...bRes.data.map(c => ({ ...c, _type: "broadcast" })),
          ...bulkRes.data.map(c => ({ ...c, _type: "bulk" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOverviewCampaigns(combined);
        setWalletData(d => d || wRes.data);
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

  // ─── PLAN ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setPlanLoading(true);
    axios.get(`${API}/api/payments/plan`, { headers })
      .then(r => setUserPlan(r.data))
      .catch(() => setUserPlan({ plan: "free", isActive: false }))
      .finally(() => setPlanLoading(false));
  }, []);
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


  
  // ─── MESSAGES (paginated + polling) ─────────────────────────────────────────
  // Fetch latest page; scrollToBottom=true on initial load
  const fetchMessages = useCallback((scrollToBottom = false) => {
    if (!selectedChat) return;
    axios.get(`${API}/api/chats/${selectedChat._id}/messages?limit=30`, { headers })
      .then(r => {
        const { messages, hasMore } = r.data;
        setActiveMessages(prev => {
          // merge: keep optimistic messages, replace real ones by _id
          const existingIds = new Set(messages.map(m => m._id));
          const optimistics = prev.filter(m => m._id.startsWith('opt-'));
          return [...messages, ...optimistics.filter(o => !existingIds.has(o._id))];
        });
        setHasMoreMessages(hasMore);
        if (scrollToBottom) {
          // use setTimeout so DOM has painted before scrolling
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'instant' }), 0);
        }
      })
      .catch(() => {});
  }, [selectedChat]);

  // Load older messages (prepend, preserve scroll position)
  const loadOlderMessages = useCallback(() => {
    if (!selectedChat || loadingOlderMsgs || !hasMoreMessages) return;
    const oldest = activeMessages.find(m => !m._id.startsWith('opt-'));
    if (!oldest) return;
    setLoadingOlderMsgs(true);
    const container = messagesContainer.current;
    const prevScrollHeight = container?.scrollHeight || 0;
    axios.get(`${API}/api/chats/${selectedChat._id}/messages?limit=30&before=${oldest._id}`, { headers })
      .then(r => {
        const { messages, hasMore } = r.data;
        setActiveMessages(prev => [...messages, ...prev]);
        setHasMoreMessages(hasMore);
        // restore scroll position so old messages don't jump the view
        requestAnimationFrame(() => {
          if (container) container.scrollTop = container.scrollHeight - prevScrollHeight;
        });
      })
      .catch(() => {})
      .finally(() => setLoadingOlderMsgs(false));
  }, [selectedChat, activeMessages, hasMoreMessages, loadingOlderMsgs]);

  useEffect(() => {
    clearInterval(msgPollRef.current);
    if (!selectedChat) { setActiveMessages([]); setHasMoreMessages(false); return; }

    setMessagesLoading(true);
    axios.get(`${API}/api/chats/${selectedChat._id}/messages?limit=30`, { headers })
      .then(r => {
        const { messages, hasMore } = r.data;
        setActiveMessages(messages);
        setHasMoreMessages(hasMore);
        // scroll to bottom instantly on first open
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'instant' }), 0);
      })
      .catch(err => console.error("Failed to load messages", err))
      .finally(() => setMessagesLoading(false));

    msgPollRef.current = setInterval(() => fetchMessages(false), POLL_MESSAGES_MS);
    return () => clearInterval(msgPollRef.current);
  }, [selectedChat]);

  // ─── AUTO-SCROLL to bottom when user sends a new message ─────────────────────
  const prevMessageCount = useRef(0);
  useEffect(() => {
    const count = activeMessages.filter(m => !m._id.startsWith('opt-')).length;
    if (count > prevMessageCount.current) {
      const container = messagesContainer.current;
      if (container) {
        const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
        if (nearBottom) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevMessageCount.current = count;
  }, [activeMessages]);


  // ─── CONTACTS ────────────────────────────────────────────────────────────────
   useEffect(() => {
    if (activeTab !== "contacts") return;
    setContactsLoading(true);
    const contactLimit = isFree ? 50 : 20;
    Promise.all([
      axios.get(`${API}/api/contacts?page=${contactPage}&limit=${contactLimit}&search=${contactSearch}`, { headers }),
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

  // ─── BROADCAST ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "broadcast") return;
    axios.get(`${API}/api/broadcasts`, { headers }).then(r => setCampaigns(r.data)).catch(() => {});
    axios.get(`${API}/api/broadcasts/tags`, { headers }).then(r => setAvailableTags(r.data)).catch(() => {});
    axios.get(`${API}/api/broadcasts/active24`, { headers }).then(r => setActive24Count(r.data.count)).catch(() => {});
    axios.get(`${API}/api/contacts/stats`, { headers }).then(r => setContactPreview(r.data.total)).catch(() => {});
  }, [activeTab]);

  const handleSendBroadcast = async () => {
    if (!campaignForm.name.trim()) { setBroadcastMsg({ text: 'Campaign name is required', type: 'error' }); return; }
    if (!campaignForm.message?.templateName) { setBroadcastMsg({ text: 'Please select an approved template', type: 'error' }); return; }
    setBroadcastSending(true);
    setBroadcastMsg({ text: '', type: '' });
    try {
      const res = await axios.post(`${API}/api/broadcasts`, campaignForm, { headers });
      setBroadcastMsg({ text: `Launched! Sending to ${res.data.totalContacts} contacts. Est. cost: ${res.data.estimatedCost}`, type: 'success' });
      setCampaignForm({ name: '', message: { type: 'template', templateName: '' }, targetTags: [], filterLast24hrs: false });
      setCampaigns(prev => [res.data.campaign, ...prev]);
      axios.get(`${API}/api/wallet`, { headers }).then(r => setWalletData(r.data)).catch(() => {});
    } catch (err) {
      setBroadcastMsg({ text: err.response?.data?.message || 'Failed to send', type: 'error' });
    } finally { setBroadcastSending(false); }
  };

  const refreshCampaigns = () => {
    axios.get(`${API}/api/broadcasts`, { headers }).then(r => setCampaigns(r.data)).catch(() => {});
  };

  // ─── WALLET ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "wallet") return;
    setWalletLoading(true);
    axios.get(`${API}/api/wallet`, { headers })
      .then(r => setWalletData(r.data)).catch(() => {}).finally(() => setWalletLoading(false));
  }, [activeTab]);

  const handleRecharge = async () => {
    const amt = parseFloat(rechargeAmount);
    if (!amt || amt < 10) { setWalletMsg({ text: 'Minimum recharge is ₹10', type: 'error' }); return; }
    setRecharging(true);
    setWalletMsg({ text: '', type: '' });
    try {
      const orderRes = await axios.post(`${API}/api/wallet/recharge/create-order`, { amount: amt }, { headers });
      const { orderId, amount: orderAmount, currency } = orderRes.data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_live_R795ytd3I8Ex1o',
        amount: orderAmount, currency, order_id: orderId,
        name: 'WPLeads Wallet',
        description: 'Wallet Recharge',
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API}/api/wallet/recharge/verify`, {
              ...response, amount: orderAmount,
            }, { headers });
            setWalletData(d => ({ ...d, balanceRupees: verifyRes.data.balanceRupees, balancePaise: verifyRes.data.balancePaise }));
            setWalletMsg({ text: `₹${amt} added successfully!`, type: 'success' });
            setRechargeAmount('');
            // Refresh full wallet data
            axios.get(`${API}/api/wallet`, { headers }).then(r => setWalletData(r.data)).catch(() => {});
          } catch { setWalletMsg({ text: 'Payment verification failed', type: 'error' }); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#25d366' },
      };
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      setWalletMsg({ text: err.response?.data?.message || 'Failed to create order', type: 'error' });
    } finally { setRecharging(false); }
  };

  // ─── TEMPLATES ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "templates") return;
    setTemplatesLoading(true);
    axios.get(`${API}/api/templates`, { headers })
      .then(r => setTemplates(r.data)).catch(() => {}).finally(() => setTemplatesLoading(false));
  }, [activeTab]);

  const handleCreateTemplate = async () => {
    if (!tplForm.name.trim() || !tplForm.body.trim()) { setTplMsg({ text: 'Name and body are required', type: 'error' }); return; }
    setTplSaving(true); setTplMsg({ text: '', type: '' });
    try {
      await axios.post(`${API}/api/templates`, tplForm, { headers });
      setTplMsg({ text: 'Template submitted to Meta for review!', type: 'success' });
      setTplForm({ name: '', category: 'MARKETING', language: 'en', header: '', body: '', footer: '', buttons: [] });
      setShowCreateTpl(false);
      axios.get(`${API}/api/templates`, { headers }).then(r => setTemplates(r.data)).catch(() => {});
    } catch (err) {
      setTplMsg({ text: err.response?.data?.message || 'Failed to create template', type: 'error' });
    } finally { setTplSaving(false); }
  };

  const handleDeleteTemplate = async (name) => {
    if (!window.confirm(`Delete template "${name}"?`)) return;
    try {
      await axios.delete(`${API}/api/templates/${name}`, { headers });
      setTemplates(t => t.filter(x => x.name !== name));
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  // ─── BULK UPLOAD ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "bulk") return;
    axios.get(`${API}/api/bulk`, { headers }).then(r => setBulkCampaigns(r.data)).catch(() => {});
  }, [activeTab]);

  const validateBulkNum = (raw) => {
    const num = raw.replace(/\D/g, '');
    if (!num) return { num, valid: false, reason: 'Empty' };
    if (num.length < 7)  return { num, valid: false, reason: 'Too short' };
    if (num.length > 15) return { num, valid: false, reason: 'Too long (>15 digits)' };
    if (num.length < 10) return { num, valid: false, reason: 'Too short (<10 digits)' };
    if (num.length === 10) return { num, valid: true, warn: 'May be missing country code' };
    return { num, valid: true };
  };

  const parseBulkLines = (lines, existing = []) => {
    const seen = new Set(existing.map(e => e.num));
    const result = [...existing];
    for (const line of lines) {
      const raw = line.split(',')[0].trim();
      if (!raw) continue;
      const entry = validateBulkNum(raw);
      if (seen.has(entry.num)) continue;
      seen.add(entry.num);
      result.push(entry);
    }
    return result;
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const parsed = parseBulkLines(lines);
      setBulkNumbers(parsed);
      setBulkForm(f => ({ ...f, phoneNumbers: parsed.filter(p => p.valid).map(p => p.num) }));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addBulkManualNumber = () => {
    const lines = bulkManualInput.split(/[\n,;\s]+/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const parsed = parseBulkLines(lines, bulkNumbers);
    setBulkNumbers(parsed);
    setBulkForm(f => ({ ...f, phoneNumbers: parsed.filter(p => p.valid).map(p => p.num) }));
    setBulkManualInput('');
  };

  const removeBulkNumber = (num) => {
    const updated = bulkNumbers.filter(e => e.num !== num);
    setBulkNumbers(updated);
    setBulkForm(f => ({ ...f, phoneNumbers: updated.filter(p => p.valid).map(p => p.num) }));
  };

  const handleSendBulk = async () => {
    if (!bulkForm.name.trim() || !bulkForm.phoneNumbers.length) { setBulkMsg({ text: 'Name and phone numbers are required', type: 'error' }); return; }
    if (!bulkForm.message?.templateName) { setBulkMsg({ text: 'Please select an approved template', type: 'error' }); return; }
    setBulkSending(true); setBulkMsg({ text: '', type: '' });
    try {
      const res = await axios.post(`${API}/api/bulk`, bulkForm, { headers });
      setBulkMsg({ text: `Campaign launched to ${res.data.totalNumbers} numbers. Est. cost: ${res.data.estimatedCost}`, type: 'success' });
      setBulkForm({ name: '', message: { type: 'template', templateName: '' }, phoneNumbers: [] });
      setBulkNumbers([]);
      setBulkCampaigns(prev => [res.data.campaign, ...prev]);
      axios.get(`${API}/api/wallet`, { headers }).then(r => setWalletData(r.data)).catch(() => {});
    } catch (err) {
      setBulkMsg({ text: err.response?.data?.message || 'Failed', type: 'error' });
    } finally { setBulkSending(false); }
  };

  // ─── QR CODE ─────────────────────────────────────────────────────────────────
  const generateQr = () => {
    const phone = qrPhone.replace(/\D/g, '');
    if (!phone) return;
    const waLink = `https://wa.me/${phone}${qrMessage.trim() ? '?text=' + encodeURIComponent(qrMessage) : ''}`;
    setQrUrl(waLink);
  };

  const copyQrLink = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  // ─── HANDLERS ────────────────────────────────────────────────────────────────
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

// ── Facebook JS SDK (Embedded Signup) ────────────────────────────────────────
useEffect(() => {
  window.fbAsyncInit = function () {
    window.FB.init({ appId: '1568257117773406', autoLogAppEvents: true, xfbml: true, version: 'v25.0' });
  };
  if (!document.getElementById('facebook-jssdk')) {
    const s = document.createElement('script');
    s.id = 'facebook-jssdk'; s.async = true; s.defer = true; s.crossOrigin = 'anonymous';
    s.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(s);
  }
}, []);

// Listen for Embedded Signup session info (WABA ID + phone number ID)
useEffect(() => {
  const handler = (event) => {
    if (event.origin !== 'https://www.facebook.com') return;
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'WA_EMBEDDED_SIGNUP') {
        if (data.event === 'FINISH') {
          fbSessionRef.current = { waba_id: data.data?.waba_id, phone_number_id: data.data?.phone_number_id };
        } else if (data.event === 'CANCEL' || data.event === 'ERROR') {
          setEmbeddedErr('Facebook signup was cancelled or failed. Try again.');
          setEmbeddedLoading(false);
        }
      }
    } catch (_) {}
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, []);

const doEmbeddedConnect = async (code) => {
  try {
    const r = await axios.post(`${API}/api/whatsapp/embedded-connect`, {
      code,
      wabaId:        fbSessionRef.current.waba_id,
      phoneNumberId: fbSessionRef.current.phone_number_id,
    }, { headers });
    setWaMsg({ text: 'WhatsApp connected successfully!', type: 'success' });
    setWaStatus({ connected: true, ...r.data });
    setWaConnectMode(null);
    setEmbeddedErr('');
  } catch (e) {
    setEmbeddedErr(e.response?.data?.message || 'Connection failed. Please try again.');
  } finally {
    setEmbeddedLoading(false);
  }
};

const handleEmbeddedSignup = () => {
  if (!window.FB) { setEmbeddedErr('Facebook SDK not ready yet. Please wait a moment and try again.'); return; }
  setEmbeddedLoading(true);
  setEmbeddedErr('');
  fbSessionRef.current = {};
  // FB.login callback must be synchronous — async work is done in doEmbeddedConnect
  window.FB.login(
    (response) => {
      if (!response.authResponse?.code) {
        setEmbeddedErr('Facebook login was cancelled.');
        setEmbeddedLoading(false);
        return;
      }
      doEmbeddedConnect(response.authResponse.code);
    },
    { config_id: '1566294694619714', response_type: 'code', override_default_response_type: true, extras: { version: 'v4', sessionInfoVersion: '3' } }
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const handleWaConnect = async (e) => {
  e.preventDefault();
  setWaLoading(true);
  try {
    const res = await axios.post(`${API}/api/whatsapp/connect`, form, { headers });
    setWaMsg({ text: res.data.message, type: "success" });
    // ✅ persist accessToken for profile API calls
    localStorage.setItem("wa_token", form.accessToken);
    setWaStatus({ connected: true, ...form });
  } catch {
    setWaMsg({ text: "Connection failed. Check your credentials.", type: "error" });
  } finally { setWaLoading(false); }
};

const handleWaDisconnect = async () => {
  if (!window.confirm("Disconnect WhatsApp?")) return;
  await axios.delete(`${API}/api/whatsapp/disconnect`, { headers });
  localStorage.removeItem("wa_token"); // ✅ clear stored token
  setWaStatus({ connected: false });
  setWaMsg({ text: "Disconnected successfully.", type: "success" });
};

  const handleToggleWorkflow = async (id) => {
    try {
      const res = await axios.patch(`${API}/api/workflows/${id}/toggle`, {}, { headers });
      setWorkflows(wfs => wfs.map(w => w._id === id ? { ...w, isActive: res.data.isActive } : w));
    } catch {}
  };

  const PRO_PLANS = {
    monthly: { label: "Monthly (including GST)",   price: 1499, paise: 149900, duration: 30,  badge: null,          saving: null },
    halfyear:{ label: "6 Months (including GST)",  price: 4999, paise: 499900, duration: 180, badge: "Save 44%",    saving: "vs ₹8,994 monthly" },
    yearly:  { label: "Yearly (including GST)",    price: 8999, paise: 899900, duration: 365, badge: "Best value",  saving: "vs ₹17,988 monthly" },
  };

  // ─── RAZORPAY UPGRADE ─────────────────────────────────────────────────────────
const handleUpgrade = async () => {
  setPayLoading(true);
  setPayMsg({ text: "", type: "" });
  try {
    const plan = PRO_PLANS[selectedDuration];

    const { data } = await axios.post(
      `${API}/api/payments/create-order`,
      { amount: plan.paise, currency: "INR" },
      { headers }
    );

    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script   = document.createElement("script");
        script.src     = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload  = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    const rzp = new window.Razorpay({
      key:         "rzp_live_R795ytd3I8Ex1o",
      amount:      data.amount,
      currency:    data.currency,
      order_id:    data.orderId,
      name:        "WPLeads",
      description: `Pro Plan — ${plan.label}`,
      theme:       { color: "#25d366" },
      prefill: {
        name:  user?.name  || "",
        email: user?.email || "",
      },
      handler: async (response) => {
        try {
          const verify = await axios.post(
            `${API}/api/payments/verify`,
            {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            },
            { headers }
          );
          setUserPlan({ plan: "pro", planExpiresAt: verify.data.planExpiresAt, isActive: true });
          setPayMsg({ text: `🎉 Upgraded to Pro (${plan.label}) successfully!`, type: "success" });
        } catch {
          setPayMsg({ text: "Payment received but verification failed. Contact support.", type: "error" });
        } finally {
          setPayLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPayLoading(false);
          setPayMsg({ text: "Payment cancelled.", type: "error" });
        },
      },
    });

    rzp.open();

  } catch {
    setPayLoading(false);
    setPayMsg({ text: "Failed to initiate payment. Try again.", type: "error" });
  }
};

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm("Delete this workflow?")) return;
    await axios.delete(`${API}/api/workflows/${id}`, { headers });
    setWorkflows(wfs => wfs.filter(w => w._id !== id));
  };

  const handleNewWorkflow = () => {
    navigate("/workflow/new");
  };
  // ─── SEND REPLY ──────────────────────────────────────────────────────────────
  const handleAttachFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum size is 10 MB.");
      e.target.value = "";
      return;
    }
    const mediaType = file.type.startsWith("image/") ? "image"
      : file.type.startsWith("video/") ? "video"
      : "document";
    const previewUrl = (mediaType === "image" || mediaType === "video") ? URL.createObjectURL(file) : null;
    setAttachment({ file, previewUrl, mediaType, filename: file.name });
    e.target.value = "";
  };

  const clearAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
  };

  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!attachment && !text) return;
    if (!selectedChat || sendingReply) return;
    setSendingReply(true);

    const optimistic = {
      _id: `opt-${Date.now()}`,
      text: attachment ? (text || `📎 ${attachment.filename}`) : text,
      from: "admin",
      type: attachment ? attachment.mediaType : "text",
      createdAt: new Date().toISOString(),
      ...(attachment?.previewUrl ? { media: { url: attachment.previewUrl } } : {}),
    };
    setActiveMessages(prev => [...prev, optimistic]);
    setReplyText("");
    const pendingAttach = attachment;
    setAttachment(null);

    try {
      if (pendingAttach) {
        setUploadingFile(true);
        const form = new FormData();
        form.append("file", pendingAttach.file);
        const { data } = await axios.post(
          `${API}/api/chats/upload-media`,
          form,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
        setUploadingFile(false);
        await axios.post(
          `${API}/api/chats/${selectedChat._id}/messages`,
          { type: "media", mediaType: pendingAttach.mediaType, mediaId: data.mediaId, mediaCaption: text, mediaFilename: pendingAttach.filename },
          { headers }
        );
      } else {
        await axios.post(
          `${API}/api/chats/${selectedChat._id}/messages`,
          { text, type: "text" },
          { headers }
        );
      }
      fetchMessages(true);
    } catch {
      setActiveMessages(prev => prev.filter(m => m._id !== optimistic._id));
      if (!pendingAttach) setReplyText(text);
      else setAttachment(pendingAttach);
    } finally {
      setSendingReply(false);
      setUploadingFile(false);
    }
  };

  const handleReplyKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // ─── CHAT TAGS ───────────────────────────────────────────────────────────────
  const PRESET_TAGS = [
    { label: "Lead",      color: "#2563eb", bg: "#dbeafe" },
    { label: "Priority",  color: "#dc2626", bg: "#fee2e2" },
    { label: "Paid",      color: "#16a34a", bg: "#dcfce7" },
    { label: "Hot",       color: "#ea580c", bg: "#ffedd5" },
    { label: "Cold",      color: "#64748b", bg: "#f1f5f9" },
    { label: "New",       color: "#0891b2", bg: "#cffafe" },
    { label: "Follow-up", color: "#ca8a04", bg: "#fef9c3" },
    { label: "VIP",       color: "#7c3aed", bg: "#ede9fe" },
    { label: "Spam",      color: "#9ca3af", bg: "#f3f4f6" },
  ];

  const getTagStyle = (label) => {
    const preset = PRESET_TAGS.find(p => p.label.toLowerCase() === label.toLowerCase());
    return preset || { color: S.greenDark, bg: S.greenBg };
  };

  const saveTags = async (newTags) => {
    if (!selectedChat) return;
    setTagSaving(true);
    try {
      await axios.patch(`${API}/api/contacts/${selectedChat._id}`, { tags: newTags }, { headers });
      const updated = { ...selectedChat, tags: newTags };
      setSelectedChat(updated);
      setChats(prev => prev.map(c => c._id === selectedChat._id ? { ...c, tags: newTags } : c));
    } catch (e) {
      console.error('Tag save failed', e);
    } finally {
      setTagSaving(false);
    }
  };

  const addTag = (label) => {
    const tag = label.trim();
    if (!tag) return;
    const current = selectedChat?.tags || [];
    if (current.map(t => t.toLowerCase()).includes(tag.toLowerCase())) return;
    saveTags([...current, tag]);
    setTagInput('');
  };

  const removeTag = (label) => {
    const current = selectedChat?.tags || [];
    saveTags(current.filter(t => t.toLowerCase() !== label.toLowerCase()));
  };

  // ─── EXPORT ──────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const res = await axios.get(`${API}/api/contacts/export`, {
        headers,
        responseType: 'blob',
      });
      const url  = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export contacts');
    }
  };
  // Add this inside the Dashboard component
const resolveIdToLabel = (text) => {
  if (!text || text.length < 20 || !text.includes('-')) return text;

  // Search through all loaded workflows for a matching ID
  for (const wf of workflows) {
    if (!wf.nodes) continue;
    for (const node of wf.nodes) {
      const msg = node.data?.message;
      if (!msg) continue;

      // Check if it matches a Button ID
      if (msg.buttons) {
        const btn = msg.buttons.find(b => b.id === text);
        if (btn) return btn.title;
      }

      // Check if it matches a List Row ID
      if (msg.sections) {
        for (const section of msg.sections) {
          const row = section.rows?.find(r => r.id === text);
          if (row) return row.title;
        }
      }
      
      // Check if it matches a Node ID (in case the bot logs Node IDs)
      if (node.id === text) {
        return msg.text || msg.buttonBody || msg.listBody || "Interactive Message";
      }
    }
  }

  return text; // Return original if no match found
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

  const isFree = false; // all accounts are pro; billing is via wallet balance
const activeCount = workflows.filter(w => w.isActive).length;
  const webhookUrl  = webhookInfo?.webhookUrl || `${API}/api/webhook`;
  const navTo = (key) => { setActiveTab(key); setSidebarOpen(false); };

  /* ── WhatsApp-native design tokens ── */
  const S = {
    /* Brand greens — straight from WhatsApp */
    green:       "#25D366",
    greenDark:   "#128C7E",
    greenDeep:   "#075E54",
    greenBg:     "#DCF8C6",
    greenBorder: "#b8e4a0",
    /* Page */
    pageBg:      "#F0F2F5",   /* WA chat-list bg */
    surface:     "#FFFFFF",
    sidebarBg:   "#FFFFFF",
    sidebarHead: "#075E54",   /* WA teal header */
    /* Text */
    textPrimary: "#111B21",   /* WA dark text */
    textMuted:   "#667781",   /* WA secondary text */
    textFaint:   "#B0B8BF",
    /* Borders & shadow */
    border:      "#E8E9EC",
    shadow:      "0 1px 4px rgba(11,20,26,0.08)",
    shadowMd:    "0 4px 16px rgba(11,20,26,0.10)",
    shadowLg:    "0 8px 32px rgba(11,20,26,0.13)",
    /* Gradients */
    greenGrad:   "linear-gradient(135deg,#25D366 0%,#128C7E 100%)",
    tealGrad:    "linear-gradient(135deg,#075E54 0%,#128C7E 100%)",
    darkBg:      "linear-gradient(135deg,#075E54 0%,#128C7E 100%)",
    /* Fonts */
    font:        "'DM Sans',system-ui,sans-serif",
    monoFont:    "'DM Mono',monospace",
    /* Card system */
    card:        { background:"#FFFFFF", border:"1px solid #E8E9EC", borderRadius:14, boxShadow:"0 1px 4px rgba(11,20,26,0.07)" },
    cardHover:   { boxShadow:"0 6px 20px rgba(11,20,26,0.11)" },
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: S.font, background: S.pageBg }}>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');

  /* ─── Keyframes ─── */
  @keyframes wpl-ping   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0} }
  @keyframes wpl-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes wpl-spin   { to{transform:rotate(360deg)} }
  @keyframes wpl-pop    { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }

  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',system-ui,sans-serif; }

  /* ─── Sidebar slide ─── */
  .wpl-sidebar { transform:translateX(-100%); transition:transform 0.28s cubic-bezier(.4,0,.2,1); }
  .wpl-sidebar.open { transform:translateX(0) !important; }
  .wpl-main { margin-left:0; width:100%; }

  @media (min-width:1024px) {
    .wpl-sidebar   { transform:translateX(0) !important; }
    .wpl-main      { margin-left:260px !important; width:calc(100% - 260px); }
    .wpl-hamburger { display:none !important; }
    .wpl-overlay   { display:none !important; }
  }

  /* ─── Chats ─── */
  .chats-grid { display:flex; flex-direction:column; height:100%; }
  .chats-list { flex-shrink:0; height:260px; overflow:hidden; }
  .chats-pane { flex:1; min-height:0; }
  @media (min-width:768px) {
    .chats-grid { display:grid; grid-template-columns:300px 1fr; }
    .chats-list { height:auto; }
  }
  @media (min-width:1024px) { .chats-grid { grid-template-columns:330px 1fr; } }

  /* ─── Tables ─── */
  .table-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; }

  /* ─── Hero card ─── */
  .hero-card { grid-column:span 1; }
  @media (min-width:640px) { .hero-card { grid-column:span 2; } }

  /* ─── Contacts mobile ─── */
  @media (max-width:540px) {
    .contacts-toolbar { flex-direction:column !important; gap:10px; }
    .contacts-toolbar input { width:100% !important; }
  }

  /* ══════════════════════════════════════════
     SIDEBAR NAV — WhatsApp chat-list style
  ══════════════════════════════════════════ */
  .dnav {
    display:flex; align-items:center; gap:11px;
    width:100%; padding:10px 14px;
    border:none; border-radius:0; cursor:pointer;
    font-size:14px; font-weight:500; text-align:left;
    color:#667781; background:transparent;
    transition:background 0.12s, color 0.12s;
    font-family:'DM Sans',system-ui,sans-serif;
    position:relative;
  }
  .dnav::before {
    content:''; position:absolute; left:0; top:20%; bottom:20%;
    width:3px; border-radius:0 3px 3px 0;
    background:transparent; transition:background 0.15s;
  }
  .dnav:hover  { background:#F5F6F6 !important; color:#111B21 !important; }
  .dnav.on     { background:#DCF8C6 !important; color:#075E54 !important; font-weight:700; }
  .dnav.on::before { background:#25D366; }
  .dnav.on svg { color:#075E54 !important; }

  /* ══════════════════════════════════════════
     CARDS
  ══════════════════════════════════════════ */
  .dcard { transition:box-shadow 0.18s, transform 0.18s; }
  .dcard:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(11,20,26,0.12) !important; }

  /* ── Metric card with left-accent ── */
  .metric-card {
    background:#fff; border:1px solid #E8E9EC; border-radius:14px;
    padding:22px 24px; position:relative; overflow:hidden;
    box-shadow:0 1px 4px rgba(11,20,26,0.07);
    transition:box-shadow 0.18s,transform 0.18s;
  }
  .metric-card::after {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:4px; border-radius:14px 0 0 14px;
  }
  .metric-card.green::after  { background:linear-gradient(180deg,#25D366,#128C7E); }
  .metric-card.purple::after { background:linear-gradient(180deg,#7c3aed,#a855f7); }
  .metric-card.blue::after   { background:linear-gradient(180deg,#2563eb,#60a5fa); }
  .metric-card.orange::after { background:linear-gradient(180deg,#f59e0b,#fbbf24); }
  .metric-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(11,20,26,0.11) !important; }

  /* ═══════════════════════════════════════
     TABLE
  ═══════════════════════════════════════ */
  .drow { transition:background 0.1s; }
  .drow:hover { background:#F5F6F6 !important; }

  /* ═══════════════════════════════════════
     ICON BUTTONS
  ═══════════════════════════════════════ */
  .dib { transition:all 0.12s; border-radius:8px; padding:6px; border:none; cursor:pointer; background:none; color:#667781; }
  .dib:hover   { background:#F0F2F5; color:#111B21 !important; }
  .dib.rd:hover{ background:#FEE2E2; color:#dc2626 !important; }

  /* ═══════════════════════════════════════
     INPUTS — WhatsApp search bar style
  ═══════════════════════════════════════ */
  .dinput { outline:none; }
  .dinput:focus { border-color:#25D366 !important; box-shadow:0 0 0 3px rgba(37,211,102,0.14) !important; }

  /* ═══════════════════════════════════════
     BUTTONS
  ═══════════════════════════════════════ */
  .btn-primary {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 20px; border-radius:24px;
    background:linear-gradient(135deg,#25D366,#128C7E);
    color:#fff; border:none; font-weight:700; font-size:13px;
    cursor:pointer; transition:all 0.15s;
    font-family:'DM Sans',system-ui,sans-serif;
    box-shadow:0 3px 10px rgba(37,211,102,0.3);
    letter-spacing:0.01em;
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(37,211,102,0.4); }
  .btn-primary:active { transform:translateY(0); }

  .btn-secondary {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:24px;
    background:#fff; color:#128C7E; border:1.5px solid #25D366;
    font-weight:700; font-size:13px; cursor:pointer;
    transition:all 0.15s; font-family:'DM Sans',system-ui,sans-serif;
  }
  .btn-secondary:hover { background:#DCF8C6; border-color:#128C7E; }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:24px;
    background:transparent; color:#667781; border:1px solid #E8E9EC;
    font-weight:600; font-size:13px; cursor:pointer;
    transition:all 0.12s; font-family:'DM Sans',system-ui,sans-serif;
  }
  .btn-ghost:hover { background:#F5F6F6; color:#111B21; }

  /* ═══════════════════════════════════════
     BADGES
  ═══════════════════════════════════════ */
  .badge-green  { display:inline-flex;align-items:center;gap:4px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; background:#DCF8C6; color:#075E54; }
  .badge-yellow { display:inline-flex;align-items:center;gap:4px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; background:#FEF3C7; color:#92400E; }
  .badge-red    { display:inline-flex;align-items:center;gap:4px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; background:#FEE2E2; color:#991B1B; }
  .badge-blue   { display:inline-flex;align-items:center;gap:4px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; background:#DBEAFE; color:#1E40AF; }
  .badge-gray   { display:inline-flex;align-items:center;gap:4px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:700; background:#F3F4F6; color:#374151; }

  /* ═══════════════════════════════════════
     QUICK ACTION GRID CARDS
  ═══════════════════════════════════════ */
  .qa-card {
    background:#fff; border:1px solid #E8E9EC; border-radius:14px;
    padding:18px 20px; cursor:pointer; text-align:left;
    display:flex; align-items:center; gap:14px;
    font-family:'DM Sans',system-ui,sans-serif;
    box-shadow:0 1px 4px rgba(11,20,26,0.06);
    transition:all 0.18s;
  }
  .qa-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(11,20,26,0.12); border-color:#25D366; }

  /* ═══════════════════════════════════════
     CHAT ITEMS
  ═══════════════════════════════════════ */
  .chat-item { transition:background 0.1s; cursor:pointer; }
  .chat-item:hover { background:#F5F6F6 !important; }

  /* ═══════════════════════════════════════
     REPLY INPUT
  ═══════════════════════════════════════ */
  .reply-input:focus { border-color:#25D366 !important; outline:none; box-shadow:0 0 0 3px rgba(37,211,102,0.12); }

  /* ═══════════════════════════════════════
     SECTION HEADERS
  ═══════════════════════════════════════ */
  .section-label {
    font-size:11px; font-weight:700; letter-spacing:0.1em;
    text-transform:uppercase; color:#B0B8BF;
    font-family:'DM Mono',monospace;
    padding:0 16px; margin-bottom:4px;
  }

  /* ═══════════════════════════════════════
     SCROLLBAR — WhatsApp style
  ═══════════════════════════════════════ */
  ::-webkit-scrollbar        { width:5px; height:5px; }
  ::-webkit-scrollbar-track  { background:transparent; }
  ::-webkit-scrollbar-thumb  { background:#D1D7DB; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:#B0B8BF; }

  /* ═══════════════════════════════════════
     ANIMATIONS
  ═══════════════════════════════════════ */
  .spin        { animation:wpl-spin 0.7s linear infinite; }
  .fade-in     { animation:wpl-fadein 0.35s ease both; }
  .pop-in      { animation:wpl-pop 0.25s ease both; }

  /* ═══════════════════════════════════════
     STAT CARDS (overview / contacts)
  ═══════════════════════════════════════ */
  .stat-card {
    background:#fff; border:1px solid #E8E9EC; border-radius:14px;
    padding:20px 22px;
    box-shadow:0 1px 4px rgba(11,20,26,0.07);
    transition:box-shadow 0.18s, transform 0.18s;
  }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(11,20,26,0.12) !important; }
  .stat-num { font-size:30px; font-weight:900; color:#111B21; letter-spacing:-0.04em; line-height:1; }
  .stat-label { font-size:11.5px; color:#667781; margin-top:5px; }

  /* ═══════════════════════════════════════
     QUICK ACTION BUTTONS (overview grid)
  ═══════════════════════════════════════ */
  .dqbtn { transition:all 0.18s; border:none; }
  .dqbtn:hover { transform:translateY(-3px) !important; box-shadow:0 8px 24px rgba(11,20,26,0.12) !important; border-color:#25D366 !important; }

  /* ═══════════════════════════════════════
     TEAL HERO / DARK CARD
  ═══════════════════════════════════════ */
  .teal-card { background:linear-gradient(135deg,#075E54 0%,#128C7E 100%); }
  .teal-card .wpl-label { color:rgba(255,255,255,0.55); }
  .teal-card .wpl-num   { color:#fff; }

  /* ═══════════════════════════════════════
     FORM GROUPS
  ═══════════════════════════════════════ */
  .form-group { display:flex; flex-direction:column; gap:6px; }
  .form-label { font-size:12px; font-weight:700; color:#111B21; letter-spacing:0.01em; }
  .form-hint  { font-size:11px; color:#667781; }
  .form-input {
    width:100%; padding:10px 14px; font-size:13.5px;
    background:#F0F2F5; border:1.5px solid transparent;
    border-radius:10px; color:#111B21;
    font-family:'DM Sans',system-ui,sans-serif;
    transition:border-color 0.15s, box-shadow 0.15s, background 0.15s;
    outline:none;
  }
  .form-input:focus { background:#fff; border-color:#25D366; box-shadow:0 0 0 3px rgba(37,211,102,0.12); }
  .form-input::placeholder { color:#B0B8BF; }

  /* ═══════════════════════════════════════
     ALERT / TOAST
  ═══════════════════════════════════════ */
  .alert-success { display:flex;align-items:center;gap:9px; padding:11px 15px; border-radius:10px; background:#DCF8C6; border:1px solid #b8e4a0; color:#075E54; font-size:13px; font-weight:600; }
  .alert-error   { display:flex;align-items:center;gap:9px; padding:11px 15px; border-radius:10px; background:#FEE2E2; border:1px solid #fca5a5; color:#991B1B; font-size:13px; font-weight:600; }

  /* ═══════════════════════════════════════
     TOGGLE / FILTER SELECTOR
  ═══════════════════════════════════════ */
  .filter-tab {
    flex:1; padding:11px 14px; border-radius:12px; border:2px solid #E8E9EC;
    background:#F0F2F5; cursor:pointer; font-family:inherit;
    transition:all 0.15s; text-align:left;
  }
  .filter-tab.active { border-color:#25D366; background:#DCF8C6; }

  /* ═══════════════════════════════════════
     TAG PILLS (broadcast)
  ═══════════════════════════════════════ */
  .tag-pill {
    padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600;
    border:1.5px solid #E8E9EC; background:#F0F2F5; color:#667781;
    cursor:pointer; transition:all 0.12s; font-family:inherit;
  }
  .tag-pill.active { border-color:#25D366; background:#DCF8C6; color:#075E54; }
  .tag-pill:hover  { border-color:#25D366; color:#128C7E; }
`}</style>


      {/* ── WhatsApp connect promo popup ── */}
      {!waStatus?.connected && !waPromoDismissed && activeTab !== "whatsapp" && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 500,
          width: 340, background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(15,23,42,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          overflow: "hidden", animation: "wpl-fadein 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {/* Green accent bar */}
          <div style={{ height: 4, background: "linear-gradient(90deg,#16a34a,#25D366,#128C7E)" }} />

          {/* Close */}
          <button onClick={() => { setWaPromoDismissed(true); sessionStorage.setItem("wa_promo_dismissed","1"); }}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 28, height: 28, borderRadius: "50%",
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#fee2e2"; e.currentTarget.style.borderColor="#fca5a5"; e.currentTarget.style.color="#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#94a3b8"; }}>
            <X size={13} />
          </button>

          <div style={{ padding: "18px 20px 20px" }}>
            {/* Icon + heading */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  Connect WhatsApp API
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4, padding: "2px 8px", borderRadius: 99, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#15803d" }}>100% FREE</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 16 }}>
              You're one step away from sending messages, running automations, and managing chats — all through your own WhatsApp Business number.
            </p>

            {/* Feature bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
              {[
                "Send & receive WhatsApp messages",
                "Automate replies with workflows",
                "Bulk campaigns & broadcasts",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => { setWaPromoDismissed(true); sessionStorage.setItem("wa_promo_dismissed","1"); navTo("whatsapp"); }}
              style={{
                width: "100%", height: 44, borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 18px rgba(22,163,74,0.35)",
                fontFamily: S.font, transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Connect WhatsApp API — Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Platform number setup modal */}
      <WhatsAppManager
        open={platformModalOpen}
        onClose={() => setPlatformModalOpen(false)}
        onSuccess={() => { fetchWaStatus(); setPlatformModalOpen(false); }}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }} />
      )}

      {/* ══════════════════════════════════════
          SIDEBAR — WhatsApp chat-panel style
      ══════════════════════════════════════ */}
      <aside className={`wpl-sidebar ${sidebarOpen ? "open" : ""}`} style={{
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column",
        background: "#FFFFFF", borderRight: "1px solid #E8E9EC",
        position: "fixed", inset: "0 auto 0 0", zIndex: 50,
        transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
        boxShadow: "2px 0 8px rgba(11,20,26,0.06)",
      }}>

        {/* ── Teal header (WhatsApp brand) ── */}
        <div style={{
          background: S.tealGrad,
          padding: "0 18px",
          height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <MessageCircle size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>WPLeads</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", fontFamily: S.monoFont }}>BUSINESS SUITE</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="wpl-hamburger"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#fff", padding: 7, borderRadius: 8, display: "flex", alignItems: "center" }}>
            <X size={15} />
          </button>
        </div>

        {/* ── WA status pill under header ── */}
        <div style={{ padding: "10px 14px", background: "#F0F2F5", borderBottom: "1px solid #E8E9EC", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(37,211,102,0.35)" }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111B21", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 11, color: waStatus?.connected ? "#25D366" : "#B0B8BF", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: waStatus?.connected ? "#25D366" : "#B0B8BF", display: "inline-block", animation: waStatus?.connected ? "wpl-ping 2s ease-in-out infinite" : "none" }} />
              {waStatus?.connected ? "WhatsApp Connected" : "Not Connected"}
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} title="Sign out"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#B0B8BF", padding: 6, borderRadius: 8, display: "flex", transition: "all 0.12s" }}
            onMouseOver={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#FEE2E2"; }}
            onMouseOut={e => { e.currentTarget.style.color = "#B0B8BF"; e.currentTarget.style.background = "none"; }}>
            <LogOut size={14} />
          </button>
        </div>

        {/* ── Nav items — WA chat-list style ── */}
        <nav style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div className="section-label" style={{ paddingTop: 14, paddingBottom: 6 }}>Main Menu</div>
          {NAV.slice(0, 5).map(({ key, label, Icon }) => (
            <button key={key} onClick={() => navTo(key)} className={`dnav${activeTab === key ? " on" : ""}`}>
              <Icon size={17} strokeWidth={activeTab === key ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {key === "chats" && chats.length > 0 && (
                <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{chats.length}</span>
              )}
              {key === "workflows" && workflows.length > 0 && (
                <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: activeTab === key ? "#075E54" : "#F0F2F5", color: activeTab === key ? "#DCF8C6" : "#667781", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{workflows.length}</span>
              )}
            </button>
          ))}

          <div className="section-label" style={{ paddingTop: 14, paddingBottom: 6 }}>Marketing</div>
          {NAV.slice(5, 10).map(({ key, label, Icon }) => (
            <button key={key} onClick={() => navTo(key)} className={`dnav${activeTab === key ? " on" : ""}`}>
              <Icon size={17} strokeWidth={activeTab === key ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </button>
          ))}

          <div className="section-label" style={{ paddingTop: 14, paddingBottom: 6 }}>Setup</div>
          {NAV.slice(10).map(({ key, label, Icon }) => (
            <button key={key} onClick={() => navTo(key)} className={`dnav${activeTab === key ? " on" : ""}`}>
              <Icon size={17} strokeWidth={activeTab === key ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </button>
          ))}

          {/* ── Pro Active badge ── */}
          <div style={{ margin: "16px 14px", padding: "14px 16px", borderRadius: 14, background: "linear-gradient(135deg,#075E54,#128C7E)", boxShadow: "0 4px 16px rgba(7,94,84,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={14} color="#fff" fill="#fff" />
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", display: "block" }}>Pro Plan — Active</span>
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>Free forever · All features unlocked</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="wpl-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0, zIndex: 30, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="wpl-hamburger" onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: S.textMuted, padding: 6, borderRadius: 8 }}>
              <Menu size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: S.textPrimary, letterSpacing: "-0.02em", textTransform: "capitalize", lineHeight: 1.2 }}>
                {activeTab === "upgrade" ? "Upgrade Plan" : activeTab === "qrcode" ? "QR & Links" : activeTab === "myleads" ? "My Leads" : activeTab === "whatsapp" ? "WhatsApp API" : activeTab === "shop" ? "Shop" : activeTab}
              </h1>
              <p style={{ fontSize: 11, color: S.textMuted, marginTop: 1 }}>
                {activeTab === "overview" && "Dashboard overview"}
                {activeTab === "chats" && "Customer conversations"}
                {activeTab === "contacts" && "Contact management"}
                {activeTab === "workflows" && "Automation flows"}
                {activeTab === "broadcast" && "Send to all contacts"}
                {activeTab === "bulk" && "Upload & send in bulk"}
                {activeTab === "templates" && "WhatsApp message templates"}
                {activeTab === "wallet" && "Balance & transactions"}
                {activeTab === "shop"   && "Product catalog & WhatsApp commerce"}
                {activeTab === "qrcode" && "Generate WhatsApp links"}
                {activeTab === "whatsapp" && "API & profile settings"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* WA status pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: waStatus?.connected ? "#f0fdf4" : "#f8fafc", border: `1px solid ${waStatus?.connected ? "#bbf7d0" : "#e2e8f0"}`, color: waStatus?.connected ? "#15803d" : S.textMuted }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: waStatus?.connected ? "#22c55e" : "#d1d5db", animation: waStatus?.connected ? "wpl-ping 2s ease-in-out infinite" : "none" }} />
              {waStatus?.connected ? "WhatsApp Live" : "Not Connected"}
            </div>

            {activeTab === "workflows" && (
              <button
                onClick={handleNewWorkflow}
                className="btn-primary">
                <Plus size={14} /> New Workflow
              </button>
            )}

            {activeTab === "chats" && (
              <button onClick={fetchChats} className="btn-secondary">
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
           <div className="chats-grid" style={{
              height: "100%",
              background: "#fff",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: S.shadowMd,
              animation: "wpl-fadein 0.35s ease both",
            }}>

              {/* LEFT: chat list */}
              <div className="chats-list" style={{ borderRight: `1px solid ${S.border}`, display: "flex", flexDirection: "column", background: "#fcfdfe", minHeight: 0 }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em" }}>Messages</h3>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: S.greenDark }}>
                    <MessageSquare size={13} />
                  </div>
                </div>

                {/* Tag filter bar */}
                {(() => {
                  const allTags = [...new Set(chats.flatMap(c => c.tags || []))].sort();
                  if (allTags.length === 0) return null;
                  return (
                    <div style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0, background: "#f8fafc" }}>
                      <button
                        onClick={() => setActiveChatTagFilter([])}
                        style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${activeChatTagFilter.length === 0 ? S.green : S.border}`, background: activeChatTagFilter.length === 0 ? S.greenBg : "#fff", color: activeChatTagFilter.length === 0 ? S.greenDark : S.textMuted, cursor: "pointer", fontFamily: S.font, transition: "all 0.15s" }}>
                        All
                      </button>
                      {allTags.map(tag => {
                        const ts = getTagStyle(tag);
                        const active = activeChatTagFilter.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => setActiveChatTagFilter(prev =>
                              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                            )}
                            style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${active ? ts.color : S.border}`, background: active ? ts.color : ts.bg, color: active ? "#fff" : ts.color, cursor: "pointer", fontFamily: S.font, transition: "all 0.15s" }}>
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* scrollable chat list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {(() => {
                    const base = isFree ? chats.slice(0, 10) : chats;
                    const filtered = activeChatTagFilter.length === 0
                      ? base
                      : base.filter(c => activeChatTagFilter.every(ft => (c.tags || []).map(t => t.toLowerCase()).includes(ft.toLowerCase())));
                    return chatsLoading ? (
                    <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>
                      <Activity size={18} style={{ animation: "wpl-ping 1.5s infinite" }} />
                    </div>
                    ) : filtered.length === 0 ? (
                      <div style={{ padding: 40, textAlign: "center", color: S.textMuted }}>
                        <Tag size={24} color="rgba(37,211,102,0.25)" style={{ marginBottom: 10 }} />
                        <p style={{ fontSize: 12 }}>{chats.length === 0 ? "No conversations yet" : "No chats match these tags"}</p>
                        {activeChatTagFilter.length > 0 && (
                          <button onClick={() => setActiveChatTagFilter([])} style={{ marginTop: 10, fontSize: 11, color: S.greenDark, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: S.font }}>Clear filter</button>
                        )}
                      </div>
                    ) : filtered.map(chat => (
                    <div key={chat._id}
                      onClick={() => { setSelectedChat(chat); setTagPanelOpen(false); setTagInput(''); }}
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
                        {chat.tags?.length > 0 && (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                            {chat.tags.slice(0, 3).map(tag => {
                              const ts = getTagStyle(tag);
                              return (
                                <span key={tag} style={{ fontSize: 9, fontWeight: 700, color: ts.color, background: ts.bg, padding: "2px 7px", borderRadius: 20, letterSpacing: "0.03em" }}>
                                  {tag}
                                </span>
                              );
                            })}
                            {chat.tags.length > 3 && (
                              <span style={{ fontSize: 9, color: S.textFaint }}>+{chat.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                  })()}
                  {isFree && chats.length > 10 && (
                    <div
                      onClick={() => navTo("upgrade")}
                      style={{ margin: "0 12px 12px", padding: "14px 16px", borderRadius: 14, background: S.tealGrad, cursor: "pointer", textAlign: "center", boxShadow: "0 4px 14px rgba(7,94,84,0.25)" }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 3 }}>⚡ {chats.length - 10} more conversations</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Upgrade to Pro to view all</p>
                    </div>
                  )}
                </div>
              </div>


              {/* RIGHT: conversation pane */}
              <div className="chats-pane" style={{ display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: 0 }}>
                {selectedChat ? (
                  <>
                    {/* Chat header */}
                    <div style={{ background: "#fff", flexShrink: 0 }}>
                      <div style={{ padding: "12px 22px", borderBottom: tagPanelOpen ? "none" : `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
                            {selectedChat.name?.charAt(0).toUpperCase() || "#"}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary }}>{selectedChat.name || selectedChat.phone}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: S.green, animation: "wpl-ping 2s ease-in-out infinite" }} />
                                <p style={{ fontSize: 10, color: S.greenDark, fontWeight: 600 }}>Active via WhatsApp</p>
                              </div>
                              {selectedChat.tags?.slice(0, 4).map(tag => {
                                const ts = getTagStyle(tag);
                                return (
                                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: ts.color, background: ts.bg, padding: "2px 8px", borderRadius: 20 }}>
                                    {tag}
                                  </span>
                                );
                              })}
                              {selectedChat.tags?.length > 4 && (
                                <span style={{ fontSize: 10, color: S.textFaint }}>+{selectedChat.tags.length - 4}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => setTagPanelOpen(o => !o)}
                            title="Manage tags"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: tagPanelOpen ? S.greenBg : "#f8fafc", border: `1px solid ${tagPanelOpen ? S.greenBorder : S.border}`, color: tagPanelOpen ? S.greenDark : S.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.font, transition: "all 0.15s" }}>
                            <Tag size={11} /> Tags {selectedChat.tags?.length > 0 && `(${selectedChat.tags.length})`}
                          </button>
                          <button onClick={fetchMessages} title="Refresh messages"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: S.font }}>
                            <RefreshCw size={11} /> Sync
                          </button>
                        </div>
                      </div>

                      {/* Tag management panel */}
                      {tagPanelOpen && (
                        <div style={{ padding: "14px 22px 16px", borderBottom: `1px solid ${S.border}`, background: "#fafbfc", animation: "wpl-fadein 0.18s ease both" }}>
                          {/* Current tags */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {(selectedChat.tags || []).length === 0 && (
                              <span style={{ fontSize: 11, color: S.textFaint, fontStyle: "italic" }}>No tags yet — add one below</span>
                            )}
                            {(selectedChat.tags || []).map(tag => {
                              const ts = getTagStyle(tag);
                              return (
                                <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: ts.color, background: ts.bg, padding: "4px 10px 4px 12px", borderRadius: 20, border: `1px solid ${ts.color}22` }}>
                                  {tag}
                                  <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: ts.color, display: "flex", alignItems: "center", padding: 0, opacity: 0.7 }}>
                                    <X size={11} />
                                  </button>
                                </span>
                              );
                            })}
                          </div>

                          {/* Preset quick-add */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
                            <p style={{ fontSize: 9.5, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: S.monoFont }}>Quick add</p>
                            <InfoTip title="Contact Tags" text="Tags help you segment contacts. Use them to filter the chat list and target specific groups in broadcast campaigns. Tags are stored per-contact and visible across all tabs." width={250} position="right" />
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {PRESET_TAGS.map(({ label, color, bg }) => {
                              const active = (selectedChat.tags || []).map(t => t.toLowerCase()).includes(label.toLowerCase());
                              return (
                                <button
                                  key={label}
                                  onClick={() => active ? removeTag(label) : addTag(label)}
                                  disabled={tagSaving}
                                  style={{ fontSize: 11, fontWeight: 700, color: active ? "#fff" : color, background: active ? color : bg, border: `1px solid ${color}44`, borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontFamily: S.font, transition: "all 0.15s", opacity: tagSaving ? 0.6 : 1 }}>
                                  {active ? "✓ " : ""}{label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom tag input */}
                          <div style={{ display: "flex", gap: 8 }}>
                            <input
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                              placeholder="Custom tag…"
                              style={{ flex: 1, padding: "7px 12px", borderRadius: 10, border: `1px solid ${S.border}`, fontSize: 12, fontFamily: S.font, background: "#fff", outline: "none" }}
                            />
                            <button
                              onClick={() => addTag(tagInput)}
                              disabled={!tagInput.trim() || tagSaving}
                              style={{ padding: "7px 16px", borderRadius: 10, background: tagInput.trim() ? S.greenGrad : "#f1f5f9", color: tagInput.trim() ? "#fff" : S.textFaint, border: "none", fontSize: 12, fontWeight: 700, cursor: tagInput.trim() ? "pointer" : "default", fontFamily: S.font, transition: "all 0.15s" }}>
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

{/* Messages area — this is the only scrollable part */}
<div
  ref={messagesContainer}
  onScroll={e => { if (e.currentTarget.scrollTop === 0 && hasMoreMessages && !loadingOlderMsgs) loadOlderMessages(); }}
  style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>

  {/* Load older messages trigger */}
  {hasMoreMessages && (
    <div style={{ textAlign: "center", marginBottom: 4 }}>
      <button
        onClick={loadOlderMessages}
        disabled={loadingOlderMsgs}
        style={{ fontSize: 11, fontWeight: 600, color: S.greenDark, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 20, padding: "5px 16px", cursor: "pointer", fontFamily: S.font }}>
        {loadingOlderMsgs ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : "↑ Load older messages"}
      </button>
    </div>
  )}

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
    const isMe         = m.from === "bot" || m.from === "admin";
    const isButtonMsg  = m.type === "interactive" || m.metadata?.buttons;
    const isOptimistic = m._id?.startsWith("opt-");

    // --- Dynamic Status Icon Helper ---
    const renderStatusIcon = () => {
      if (!isMe) return null; 
      if (isOptimistic || m.status === "pending") return <Clock size={9} style={{ opacity: 0.6 }} />;
      
      switch (m.status) {
        case "read":
          return (
            <div style={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
              <Check size={9} color="#34b7f1" strokeWidth={4} style={{ marginRight: -4 }} />
              <Check size={9} color="#34b7f1" strokeWidth={4} />
            </div>
          );
        case "delivered":
          return (
            <div style={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
              <Check size={9} strokeWidth={3} style={{ marginRight: -4 }} />
              <Check size={9} strokeWidth={3} />
            </div>
          );
        case "sent":
          return <Check size={9} strokeWidth={3} />;
        case "failed":
          return <AlertCircle size={9} color="#ff4d4d" />;
        default:
          return <Check size={9} strokeWidth={3} />;
      }
    };

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
              {/* Status in Buttons Footer */}
              <div style={{ padding: "4px 12px 8px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, fontSize: 9, opacity: 0.7 }}>
                 {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                 {renderStatusIcon()}
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
              <span style={{ fontWeight: 600 }}>{resolveIdToLabel(m.text)}</span>
            </div>
          )}

          

          {/* Standard Text */}
          {m.type === "text" && !isButtonMsg && (
            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{resolveIdToLabel(m.text)}</p>
          )}

          {/* Timestamp & Status Ticks (for non-interactive messages) */}
          {!isButtonMsg && (
            <div style={{ fontSize: 9, textAlign: "right", marginTop: 4, opacity: 0.7, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
              {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {renderStatusIcon()}
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
                    <div style={{ background: "#fff", borderTop: `1px solid ${S.border}`, flexShrink: 0 }}>

                      {/* Attachment preview strip */}
                      {attachment && (
                        <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 10, animation: "wpl-fadein 0.15s ease both" }}>
                          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 12, background: "#f1f5f9", border: `1px solid ${S.border}` }}>
                            {attachment.mediaType === "image" && attachment.previewUrl && (
                              <img src={attachment.previewUrl} alt="preview" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                            )}
                            {attachment.mediaType === "video" && (
                              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Video size={20} color="#fff" />
                              </div>
                            )}
                            {attachment.mediaType === "document" && (
                              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={20} color="#2563eb" />
                              </div>
                            )}
                            <div>
                              <p style={{ fontSize: 11.5, fontWeight: 700, color: S.textPrimary, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachment.filename}</p>
                              <p style={{ fontSize: 10, color: S.textMuted, textTransform: "capitalize" }}>{attachment.mediaType}</p>
                            </div>
                            {uploadingFile && (
                              <Activity size={14} color={S.greenDark} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
                            )}
                            <button onClick={clearAttachment} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <X size={10} color="#fff" />
                            </button>
                          </div>
                          <span style={{ fontSize: 11, color: S.textMuted }}>Add a caption below (optional)</span>
                        </div>
                      )}

                      <div style={{ padding: "12px 16px", display: "flex", gap: 8, alignItems: "flex-end" }}>
                        {/* Hidden file input */}
                        <input
                          ref={attachInputRef}
                          type="file"
                          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
                          style={{ display: "none" }}
                          onChange={handleAttachFile}
                        />

                        {/* Attach button */}
                        <button
                          onClick={() => attachInputRef.current?.click()}
                          disabled={sendingReply}
                          title="Attach file"
                          style={{ width: 40, height: 40, borderRadius: 12, background: attachment ? S.greenBg : "#f1f5f9", border: `1px solid ${attachment ? S.greenBorder : S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: attachment ? S.greenDark : S.textMuted, transition: "all 0.15s" }}>
                          <Paperclip size={15} />
                        </button>

                        <textarea
                          className="reply-input"
                          rows={1}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={handleReplyKeyDown}
                          placeholder={attachment ? "Add a caption… (optional)" : "Type a reply… (Enter to send, Shift+Enter for newline)"}
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
                          disabled={(!replyText.trim() && !attachment) || sendingReply}
                          style={{
                            width: 42, height: 42, borderRadius: 13,
                            background: (replyText.trim() || attachment) ? S.greenGrad : "rgba(0,0,0,0.06)",
                            color: (replyText.trim() || attachment) ? "#fff" : S.textFaint,
                            border: "none", cursor: (replyText.trim() || attachment) ? "pointer" : "default",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: (replyText.trim() || attachment) ? "0 4px 12px rgba(37,211,102,0.3)" : "none",
                            transition: "all 0.2s",
                            flexShrink: 0,
                          }}>
                          {sendingReply
                            ? <Activity size={16} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
                            : <Send size={16} />}
                        </button>
                      </div>
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
            <div style={{ padding: "24px 28px", maxWidth: 1400, margin: "0 auto" }}>

              {/* ─── OVERVIEW ─── */}
              {activeTab === "overview" && (
                <div style={{ animation: "wpl-fadein 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* ── Welcome Banner ── */}
                  <div style={{ background: S.tealGrad, borderRadius: 20, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, position: "relative", overflow: "hidden", boxShadow: "0 6px 28px rgba(7,94,84,0.28)" }}>
                    <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginBottom: 5 }}>
                        {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 5 }}>
                        Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
                      </h2>
                      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>
                        Here's your WhatsApp business performance at a glance
                      </p>
                    </div>
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, background: waStatus?.connected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: waStatus?.connected ? "#dcf8c6" : "rgba(255,255,255,0.4)", animation: waStatus?.connected ? "wpl-ping 2s ease-in-out infinite" : "none" }} />
                        {waStatus?.connected ? "WhatsApp Live" : "Not Connected"}
                      </div>
                      {!waStatus?.connected && (
                        <button onClick={() => navTo("whatsapp")} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: S.font }}>
                          Connect WhatsApp →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── KPI Row 1: 4 core metrics ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
                    <div className="metric-card purple">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Contacts</span>
                          <InfoTip title="Total Contacts" text="All unique contacts stored in your database. A new contact is created automatically the first time someone messages your WhatsApp number." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Users size={16} color="#7c3aed" />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>{contactTotal || overviewStats?.total || 0}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {overviewStats?.newToday > 0 && <span style={{ fontSize: 11, color: S.greenDark, fontWeight: 700, background: S.greenBg, padding: "2px 8px", borderRadius: 20, border: `1px solid ${S.greenBorder}` }}>+{overviewStats.newToday} today</span>}
                        <span style={{ fontSize: 11, color: S.textMuted }}>in database</span>
                      </div>
                    </div>

                    <div className="metric-card green">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Automations</span>
                          <InfoTip title="Automations" text="Keyword-triggered workflows that automatically reply to your contacts. Unlimited workflows included free." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap size={16} color={S.greenDark} />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>{activeCount}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: S.greenDark, fontWeight: 700 }}>{activeCount} active</span>
                        <span style={{ fontSize: 11, color: S.textMuted }}>· {workflows.length} total</span>
                      </div>
                    </div>

                    <div className="metric-card blue">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Conversations</span>
                          <InfoTip title="Conversations" text="Number of active chat threads. Each unique contact who has ever messaged you appears here." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MessageSquare size={16} color="#2563eb" />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>{chats.length}</p>
                      <span style={{ fontSize: 11, color: S.textMuted }}>active chat threads</span>
                    </div>

                    <div className="metric-card orange">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Active / Week</span>
                          <InfoTip title="Active This Week" text="Contacts who sent or received a message in the last 7 days. These are your most engaged leads." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Activity size={16} color="#f59e0b" />
                        </div>
                      </div>
                      <p style={{ fontSize: 38, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>{overviewStats?.activeThisWeek || 0}</p>
                      <span style={{ fontSize: 11, color: S.textMuted }}>contacts this week</span>
                    </div>
                  </div>

                  {/* ── KPI Row 2: secondary metrics ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
                    <div className="metric-card blue">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Msgs Sent</span>
                          <InfoTip title="Total Messages Sent" text="Sum of all messages dispatched across every broadcast and cold outreach campaign you've ever run." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Send size={16} color="#2563eb" />
                        </div>
                      </div>
                      <p style={{ fontSize: 34, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>
                        {overviewCampaigns.reduce((s, c) => s + (c.sentCount || 0), 0).toLocaleString("en-IN")}
                      </p>
                      <span style={{ fontSize: 11, color: S.textMuted }}>across all campaigns</span>
                    </div>

                    <div className="metric-card green">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Campaigns</span>
                          <InfoTip title="Campaigns" text="Total number of broadcast and cold outreach campaigns created. Broadcasts target saved contacts by tag; Cold Outreach targets a custom phone number list." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: S.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Megaphone size={16} color={S.greenDark} />
                        </div>
                      </div>
                      <p style={{ fontSize: 34, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 8 }}>{overviewCampaigns.length}</p>
                      <span style={{ fontSize: 11, color: S.textMuted }}>broadcasts + bulk sends</span>
                    </div>

                    <div className="metric-card purple">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Plan</span>
                          <InfoTip title="Your Plan" text="All accounts are Pro — free forever. Messaging is billed per message from your wallet. Unlimited workflows included." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap size={16} color="#7c3aed" fill="#7c3aed" />
                        </div>
                      </div>
                      <p style={{ fontSize: 26, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8, textTransform: "capitalize" }}>
                        {userPlan?.plan || "Free"}
                      </p>
                      {isFree
                        ? <button onClick={() => navTo("upgrade")} style={{ fontSize: 11, color: S.greenDark, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: S.font }}>Upgrade to Pro →</button>
                        : <span style={{ fontSize: 11, color: S.greenDark, fontWeight: 700 }}>✓ Full access active</span>}
                    </div>

                    <div className="metric-card orange">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Wallet Balance</span>
                          <InfoTip title="Wallet Balance" text="Pre-paid balance used to send messages. Marketing messages (broadcasts): ₹0.XX each. Service messages (24h window): cheaper rate. Recharge anytime." />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Wallet size={16} color="#f59e0b" />
                        </div>
                      </div>
                      <p style={{ fontSize: 26, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
                        {walletData ? `₹${walletData.balanceRupees}` : "—"}
                      </p>
                      <button onClick={() => navTo("wallet")} style={{ fontSize: 11, color: S.greenDark, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: S.font }}>Recharge →</button>
                    </div>
                  </div>

                  {/* ── Analytics Row ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 18 }}>

                    {/* Campaign Delivery Funnel */}
                    <div style={{ ...S.card, padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <BarChart2 size={16} color="#fff" />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Campaign Analytics</h3>
                            <InfoTip title="Campaign Analytics" text="Delivery funnel across all your campaigns. Sent → Delivered → Read shows how many messages made it through each stage. Failed means WhatsApp couldn't deliver." width={260} />
                          </div>
                          <p style={{ fontSize: 11, color: S.textMuted }}>Delivery & engagement funnel</p>
                        </div>
                      </div>
                      {(() => {
                        const tSent      = overviewCampaigns.reduce((s, c) => s + (c.sentCount || 0), 0);
                        const tDelivered = overviewCampaigns.reduce((s, c) => s + (c.deliveredCount || 0), 0);
                        const tRead      = overviewCampaigns.reduce((s, c) => s + (c.readCount || 0), 0);
                        const tFailed    = overviewCampaigns.reduce((s, c) => s + (c.failedCount || 0), 0);
                        const dRate = tSent > 0 ? Math.round((tDelivered / tSent) * 100) : 0;
                        const rRate = tSent > 0 ? Math.round((tRead / tSent) * 100) : 0;
                        const fRate = tSent > 0 ? Math.round((tFailed / tSent) * 100) : 0;
                        if (tSent === 0) return (
                          <div style={{ textAlign: "center", padding: "36px 0", color: S.textMuted }}>
                            <BarChart2 size={32} color={S.greenBorder} style={{ marginBottom: 12 }} />
                            <p style={{ fontSize: 13, marginBottom: 14 }}>No campaigns yet — run your first broadcast</p>
                            <button onClick={() => navTo("broadcast")} className="btn-primary" style={{ margin: "0 auto" }}>
                              <Megaphone size={13} /> Create Campaign
                            </button>
                          </div>
                        );
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                              { label: "Sent",      tip: "Messages accepted and queued by WhatsApp's servers.",                                       val: tSent,      pct: 100,  color: "#2563eb", bar: "#dbeafe" },
                              { label: "Delivered", tip: "Messages that reached the recipient's device. Requires internet on their end.",              val: tDelivered, pct: dRate, color: S.greenDark, bar: S.greenBg },
                              { label: "Read",      tip: "Messages opened by the recipient. Read receipts must be enabled on their WhatsApp.",         val: tRead,      pct: rRate, color: "#7c3aed", bar: "#ede9fe" },
                              { label: "Failed",    tip: "Messages WhatsApp could not deliver — invalid number, blocked, or outside 24h window.",      val: tFailed,    pct: fRate, color: "#dc2626", bar: "#fee2e2" },
                            ].map(({ label, tip, val, pct, color, bar }) => (
                              <div key={label}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: S.textPrimary }}>{label}</span>
                                    <InfoTip text={tip} width={220} />
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: 15, fontWeight: 900, color }}>{val.toLocaleString("en-IN")}</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: S.textFaint, minWidth: 34, textAlign: "right" }}>{pct}%</span>
                                  </div>
                                </div>
                                <div style={{ height: 9, borderRadius: 99, background: bar, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color }} />
                                </div>
                              </div>
                            ))}
                            <div style={{ marginTop: 4, padding: "14px 18px", borderRadius: 14, background: S.greenBg, border: `1px solid ${S.greenBorder}`, display: "flex", justifyContent: "space-around" }}>
                              {[
                                { label: "Campaigns",  val: overviewCampaigns.length, color: S.greenDark, tip: "Total campaigns run" },
                                { label: "Delivery %", val: `${dRate}%`,                color: "#2563eb",   tip: "% of sent messages that were delivered" },
                                { label: "Read Rate",  val: `${rRate}%`,                color: "#7c3aed",   tip: "% of sent messages that were opened" },
                              ].map(({ label, val, color, tip }, i) => (
                                <div key={label} style={{ textAlign: "center" }}>
                                  <p style={{ fontSize: 20, fontWeight: 900, color }}>{val}</p>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 3 }}>
                                    <p style={{ fontSize: 9, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                                    <InfoTip text={tip} position="bottom" width={180} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Recent Conversations */}
                    <div style={{ ...S.card, padding: "24px", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <MessageSquare size={16} color="#2563eb" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Recent Chats</h3>
                            <p style={{ fontSize: 11, color: S.textMuted }}>{chats.length} active threads</p>
                          </div>
                        </div>
                        <button onClick={() => navTo("chats")} style={{ fontSize: 11, fontWeight: 700, color: S.greenDark, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: S.font }}>View all</button>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        {chats.length === 0 ? (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.textMuted, paddingTop: 28 }}>
                            <MessageSquare size={28} color={S.greenBorder} style={{ marginBottom: 10 }} />
                            <p style={{ fontSize: 12 }}>No conversations yet</p>
                          </div>
                        ) : chats.slice(0, 6).map(chat => (
                          <div key={chat._id} onClick={() => navTo("chats")} className="chat-item"
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 10px", borderRadius: 12, cursor: "pointer" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 11, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                              {chat.name?.charAt(0)?.toUpperCase() || "#"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                                <p style={{ fontSize: 12.5, fontWeight: 700, color: S.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.name || chat.phone}</p>
                                <span style={{ fontSize: 10, color: S.textFaint, flexShrink: 0 }}>{formatRelativeTime(chat.lastActive)}</span>
                              </div>
                              <p style={{ fontSize: 11, color: S.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{chat.lastMessage || "Media message"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {chats.length > 6 && (
                        <button onClick={() => navTo("chats")} style={{ marginTop: 10, padding: "8px 0", borderRadius: 10, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font, width: "100%" }}>
                          +{chats.length - 6} more conversations
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Recent Campaigns Table ── */}
                  {overviewCampaigns.length > 0 && (
                    <div style={{ ...S.card, overflow: "hidden" }}>
                      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Megaphone size={14} color="#fff" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary }}>Recent Campaigns</h3>
                            <p style={{ fontSize: 11, color: S.textMuted }}>Last {Math.min(6, overviewCampaigns.length)} broadcasts & bulk sends</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => navTo("broadcast")} style={{ fontSize: 11, fontWeight: 700, color: S.greenDark, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: S.font }}>Broadcast</button>
                          <button onClick={() => navTo("bulk")} style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#dbeafe", border: "1px solid #bfdbfe", borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: S.font }}>Bulk</button>
                        </div>
                      </div>
                      <div className="table-scroll">
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${S.border}` }}>
                              {["Campaign", "Type", "Status", "Sent", "Delivered", "Read", "Failed", "Cost", "Date"].map((h, i) => (
                                <th key={h} style={{ padding: "10px 14px", fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: i > 2 ? "center" : "left", fontFamily: S.monoFont, whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {overviewCampaigns.slice(0, 6).map(c => (
                              <tr key={c._id} className="drow" style={{ borderBottom: `1px solid rgba(37,211,102,0.05)` }}>
                                <td style={{ padding: "11px 14px", fontWeight: 700, color: S.textPrimary, fontSize: 12.5, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</td>
                                <td style={{ padding: "11px 14px" }}>
                                  <span className={c._type === "bulk" ? "badge-blue" : "badge-green"} style={{ fontSize: 10 }}>
                                    {c._type === "bulk" ? "Bulk" : "Broadcast"}
                                  </span>
                                </td>
                                <td style={{ padding: "11px 14px" }}>
                                  <span className={c.status === "done" ? "badge-green" : c.status === "running" ? "badge-yellow" : "badge-red"} style={{ fontSize: 10 }}>
                                    {c.status === "running" && <Loader2 size={8} style={{ animation: "wpl-spin 0.8s linear infinite" }} />}
                                    {" "}{c.status}
                                  </span>
                                </td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 13, fontWeight: 800, color: "#2563eb" }}>{c.sentCount || 0}</td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 13, fontWeight: 800, color: S.greenDark }}>{c.deliveredCount || 0}</td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 13, fontWeight: 800, color: "#7c3aed" }}>{c.readCount || 0}</td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 13, fontWeight: 800, color: c.failedCount > 0 ? "#dc2626" : S.textFaint }}>{c.failedCount || 0}</td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 12, color: S.textPrimary, fontWeight: 600 }}>₹{((c.costPaise || 0) / 100).toFixed(2)}</td>
                                <td style={{ padding: "11px 14px", textAlign: "center", fontSize: 10, color: S.textFaint, fontFamily: S.monoFont, whiteSpace: "nowrap" }}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── Quick Actions ── */}
                  <div>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12, fontFamily: S.monoFont }}>Quick Actions</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 10 }}>
                      {[
                        { label: "Start Broadcast",  desc: "Send to all contacts",  Icon: Megaphone,     col: S.greenDark, bg: S.greenBg,  action: () => navTo("broadcast") },
                        { label: "New Workflow",      desc: "Automate responses", Icon: Zap, col: "#2563eb", bg: "#dbeafe", action: handleNewWorkflow },
                        { label: "View Chats",        desc: "Reply to customers",    Icon: MessageSquare, col: "#7c3aed",   bg: "#ede9fe",  action: () => navTo("chats") },
                        { label: "Manage Contacts",   desc: "Browse your audience",  Icon: Users,         col: "#f59e0b",   bg: "#fef3c7",  action: () => navTo("contacts") },
                        { label: "Cold Outreach",     desc: "Send to custom numbers", Icon: Upload,        col: "#dc2626",   bg: "#fee2e2",  action: () => navTo("bulk") },
                        { label: "Recharge Wallet",   desc: walletData ? `₹${walletData.balanceRupees} balance` : "Top up balance", Icon: Wallet, col: "#2563eb", bg: "#dbeafe", action: () => navTo("wallet") },
                      ].map(({ label, desc, Icon, col, bg, action }) => (
                        <button key={label} onClick={action} className="qa-card" style={{ fontFamily: S.font, cursor: "pointer" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${S.border}` }}>
                            <Icon size={16} color={col} />
                          </div>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 700, color: S.textPrimary }}>{label}</p>
                            <p style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Upgrade Banner (free users only) ── */}
                  <div style={{ padding: "18px 24px", background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Zap size={16} color="#fff" fill="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: S.greenDark }}>Pro Plan — Free Forever</p>
                      <p style={{ fontSize: 11.5, color: S.textMuted, marginTop: 2 }}>All features unlocked. Pay only per message: ₹0.20 (service) or ₹0.90 (marketing).</p>
                    </div>
                  </div>

                </div>
              )}
              {/* Inside your Dashboard content mapping */}

{/* ─── MY LEADS (With Free Plan Blocker) ─── */}
{activeTab === "myleads" && (
  <main style={{ flex: 1, overflowY: "auto" }}>
    <div style={{ padding: isFree ? 24 : 0, margin: "0 auto", height: "100%" }}>
      {isFree ? (
        <div style={{ 
          ...S.card, 
          height: "100%", 
          minHeight: 450, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          textAlign: "center", 
          padding: 40,
          background: "#fff",
          animation: "wpl-fadein 0.4s ease both"
        }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 30, 
            background: "rgba(37,211,102,0.1)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            marginBottom: 24,
            position: 'relative'
          }}>
            <Layers size={32} color={S.greenDark} style={{ opacity: 0.5 }} />
            <div style={{ 
              position: 'absolute', 
              bottom: -4, 
              right: -4, 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: S.greenGrad, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '4px solid #fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <Lock size={14} color="#fff" />
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.textPrimary, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Unlock Lead Generation
          </h2>
          <p style={{ fontSize: 15, color: S.textMuted, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
            Custom lead forms and CRM management are available for <strong>Pro Plan</strong> users. Capture leads directly from WhatsApp and manage them in one place.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            <button 
              onClick={() => navTo("upgrade")}
              style={{ 
                padding: "14px 28px", 
                borderRadius: 16, 
                background: S.greenGrad, 
                color: "#fff", 
                border: "none", 
                fontSize: 14, 
                fontWeight: 800, 
                cursor: "pointer", 
                boxShadow: "0 10px 25px rgba(37,211,102,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <Zap size={16} fill="#fff" /> Upgrade to Pro
            </button>
            <button 
              onClick={() => navTo("overview")}
              style={{ 
                padding: "14px 28px", 
                borderRadius: 16, 
                background: "transparent", 
                color: S.textMuted, 
                border: `1px solid ${S.border}`, 
                fontSize: 14, 
                fontWeight: 700, 
                cursor: "pointer" 
              }}
            >
              Go back
            </button>
          </div>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 500, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Check size={16} color={S.greenDark} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: S.textMuted }}><strong>Custom Forms:</strong> Build branded lead capture forms.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Check size={16} color={S.greenDark} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: S.textMuted }}><strong>CRM Integration:</strong> Organize leads with notes and stats.</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: 0, margin: "0 auto" }}>
          <MyLeads S={S} headers={headers} />
        </div>
      )}
    </div>
  </main>
)}

              {/* ─── WORKFLOWS ─── */}
              {activeTab === "workflows" && (
                <div style={{ ...S.card, overflow: "hidden", animation: "wpl-fadein 0.35s ease both" }}>
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
                    <div className="table-scroll">
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
                    </div>
                  )}
                </div>
              )}
{activeTab === "upgrade" && (
  <div style={{ animation: "wpl-fadein 0.35s ease both" }}>

    {/* ── Current plan banner ── */}
    <div style={{ borderRadius: 18, padding: "22px 26px", background: S.tealGrad, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, boxShadow: "0 8px 32px rgba(7,94,84,0.28)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont, marginBottom: 6 }}>Current plan</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>Pro</span>
          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.25)", color: "#fff" }}>Active</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Free forever · All features unlocked · No expiry</p>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 14, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dcf8c6", animation: "wpl-ping 1.5s ease-in-out infinite" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Pro · Free Forever</span>
      </div>
    </div>

    {/* ── Pro Features included ── */}
    <div style={{ ...S.card, padding: "28px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em" }}>Pro Plan — Free Forever</h3>
          <p style={{ fontSize: 12, color: S.textMuted, marginTop: 2 }}>All features unlocked. Pay only per message sent from your wallet.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
        {[
          { icon: "∞", label: "Unlimited Workflows" },
          { icon: "∞", label: "Unlimited Contacts" },
          { icon: "📤", label: "Bulk Cold Outreach" },
          { icon: "📢", label: "Broadcast Campaigns" },
          { icon: "📋", label: "Template Management" },
          { icon: "💬", label: "All Message Types" },
          { icon: "📊", label: "Analytics Dashboard" },
          { icon: "🔒", label: "Encrypted Credentials" },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: S.greenBg, border: `1px solid ${S.greenBorder}` }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: S.textPrimary }}>{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Message pricing info ── */}
    <div style={{ ...S.card, padding: "24px", marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary, marginBottom: 4 }}>Pay-per-message pricing</h3>
      <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 16 }}>No monthly subscription. Recharge your wallet and only pay for messages you send.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {[
          { label: "Marketing / Cold Outreach", price: "₹0.90", sub: "per message", color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
          { label: "Service (24h window)", price: "₹0.20", sub: "per message", color: S.greenDark, bg: S.greenBg, border: S.greenBorder },
        ].map(r => (
          <div key={r.label} style={{ padding: "16px 18px", borderRadius: 12, background: r.bg, border: `1px solid ${r.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.04em", lineHeight: 1 }}>{r.price}</p>
            <p style={{ fontSize: 11, color: S.textMuted, marginTop: 4 }}>{r.sub}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navTo("wallet")} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, background: S.greenGrad, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
        Recharge Wallet →
      </button>
    </div>

    {/* ── What's included table ── */}
    <div style={{ ...S.card, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${S.border}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em" }}>What's included in Pro</h3>
        <p style={{ fontSize: 12, color: S.textMuted, marginTop: 3 }}>Everything is free — you only pay per message sent</p>
      </div>
      <div className="table-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${S.border}` }}>
              <th style={{ padding: "12px 24px", fontSize: 9, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "left", fontFamily: S.monoFont }}>Feature</th>
              <th style={{ padding: "12px 20px", fontSize: 9, fontWeight: 700, color: S.greenDark, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", fontFamily: S.monoFont }}>Pro (Free)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: "Workflows",              val: "Unlimited" },
              { feature: "Contacts",               val: "Unlimited" },
              { feature: "Broadcast Campaigns",    val: "✓ Included" },
              { feature: "Bulk Cold Outreach",     val: "✓ Included" },
              { feature: "Template Management",    val: "✓ Included" },
              { feature: "Interactive Messages",   val: "All types" },
              { feature: "Analytics Dashboard",    val: "✓ Included" },
              { feature: "WhatsApp API setup",     val: "Self-setup (free)" },
              { feature: "Marketing messages",     val: "₹0.90 / msg" },
              { feature: "Service messages",       val: "₹0.20 / msg" },
            ].map(({ feature, val }) => (
              <tr key={feature} className="drow" style={{ borderBottom: `1px solid rgba(37,211,102,0.05)` }}>
                <td style={{ padding: "13px 24px", fontSize: 13, fontWeight: 600, color: S.textPrimary }}>{feature}</td>
                <td style={{ padding: "13px 20px", textAlign: "center", fontSize: 12, fontWeight: 700, color: S.greenDark }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
)}
{activeTab === "whatsapp" && (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: 18, animation: "wpl-fadein 0.35s ease both" }}>

    {/* ─── Connect Card ─── */}
    <div style={{ borderRadius: 18, padding: "28px", position: "relative", overflow: "hidden", background: S.tealGrad, boxShadow: "0 8px 32px rgba(7,94,84,0.3)" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <MessageCircle size={13} color="rgba(255,255,255,0.8)" />
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: S.monoFont }}>Cloud API</span>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 20 }}>Connect to WhatsApp API</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 12, marginBottom: 22, background: waStatus?.connected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
        {waStatus?.connected ? <><Wifi size={12} />Connected and active</> : <><WifiOff size={12} />Not connected</>}
      </div>

      {!waStatus?.connected ? (
        <>
          {/* ── Mode selector ── */}
          {!waConnectMode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4, fontWeight: 600 }}>Choose how to connect:</p>

              {/* Option A — Platform number */}
              <button type="button" onClick={() => setPlatformModalOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(37,211,102,0.4)" }}>
                  <Zap size={18} color="#fff" fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Use Platform Number</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Add a new number under our managed WABA — no Meta setup needed</div>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.5)" style={{ marginLeft: "auto", flexShrink: 0 }} />
              </button>

              {/* Option B — Connect via Facebook (Embedded Signup) */}
              <button type="button" onClick={() => setWaConnectMode("facebook")}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14,
                  background: "rgba(24,119,242,0.18)", border: "1.5px solid rgba(24,119,242,0.45)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(24,119,242,0.28)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(24,119,242,0.18)"}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(24,119,242,0.4)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Connect via Facebook</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Fastest — sign in with Facebook &amp; select your WhatsApp Business account</div>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.5)" style={{ marginLeft: "auto", flexShrink: 0 }} />
              </button>

              {/* Option C — Own Meta account (manual) */}
              <button type="button" onClick={() => setWaConnectMode("own")}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Connect Own Business</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Manually enter your WABA ID &amp; access token</div>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.5)" style={{ marginLeft: "auto", flexShrink: 0 }} />
              </button>
            </div>
          )}

          {/* Platform modal is rendered via portal — nothing inline here */}

          {/* ── Facebook Embedded Signup mode ── */}
          {waConnectMode === "facebook" && (
            <div>
              <button type="button" onClick={() => { setWaConnectMode(null); setEmbeddedErr(''); setEmbeddedLoading(false); }}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 18, padding: 0 }}>
                <ChevronLeft size={13} /> Back
              </button>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 8px 24px rgba(24,119,242,0.4)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Connect via Facebook</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                  Click the button below. A Facebook popup will open — log in and select your WhatsApp Business account. We'll handle the rest automatically.
                </div>
              </div>

              {embeddedErr && (
                <div style={{ padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 12, fontWeight: 600,
                  background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                  {embeddedErr}
                </div>
              )}

              <button type="button" onClick={handleEmbeddedSignup} disabled={embeddedLoading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "13px 0", borderRadius: 14, background: "#1877F2", border: "none", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: embeddedLoading ? "not-allowed" : "pointer",
                  fontFamily: S.font, boxShadow: "0 8px 24px rgba(24,119,242,0.35)", opacity: embeddedLoading ? 0.7 : 1,
                  transition: "all 0.15s" }}>
                {embeddedLoading
                  ? <><Activity size={14} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> Connecting…</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg> Continue with Facebook</>
                }
              </button>

              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                A popup will open. Allow popups for this site if blocked.
              </p>
            </div>
          )}

          {/* ── Own account mode — credentials form ── */}
          {waConnectMode === "own" && (
            <div>
              <button type="button" onClick={() => setWaConnectMode(null)}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>
                <ChevronLeft size={13} /> Back
              </button>
              <form onSubmit={handleWaConnect}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[["Phone Number ID", "phoneNumberId", "123456…"], ["WABA ID", "wabaId", "987654…"]].map(([label, key, ph]) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontFamily: S.font }}>{label}</label>
                      <input className="dinput"
                        style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#fff", fontFamily: S.monoFont }}
                        placeholder={ph} required onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontFamily: S.font }}>Access Token</label>
                  <input type="password" className="dinput"
                    style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#fff", fontFamily: S.font }}
                    placeholder="EAAxxxxx…" required onChange={e => setForm({ ...form, accessToken: e.target.value })} />
                </div>
                <button type="submit" disabled={waLoading}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: S.greenGrad, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font, boxShadow: "0 8px 24px rgba(37,211,102,0.3)", opacity: waLoading ? 0.7 : 1 }}>
                  {waLoading ? <><Activity size={12} style={{ animation: "wpl-spin 0.8s linear infinite" }} />Connecting…</> : <><Wifi size={13} />Connect</>}
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Account Info */}
          <div style={{ borderRadius: 14, padding: "14px 16px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", marginBottom: 10, backdropFilter: "blur(4px)" }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6, fontFamily: S.monoFont }}>Active number ID</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: S.monoFont, wordBreak: "break-all" }}>{waStatus.phoneNumberId}</p>
          </div>
          {waStatus.wabaId && (
            <div style={{ borderRadius: 14, padding: "14px 16px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", marginBottom: 10, backdropFilter: "blur(4px)" }}>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6, fontFamily: S.monoFont }}>WABA ID</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: S.monoFont, wordBreak: "break-all" }}>{waStatus.wabaId}</p>
            </div>
          )}
          {waStatus.connectedAt && (
            <div style={{ borderRadius: 12, padding: "10px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={11} color="rgba(255,255,255,0.6)" />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: S.monoFont }}>
                Connected {formatRelativeTime(waStatus.connectedAt)}
              </p>
            </div>
          )}
          <button onClick={handleWaDisconnect}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
            <WifiOff size={13} /> Disconnect
          </button>
        </div>
      )}

      {waMsg.text && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "9px 14px", borderRadius: 12, background: waMsg.type === "success" ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.25)", color: "#fff", fontSize: 12, border: "1px solid rgba(255,255,255,0.2)" }}>
          {waMsg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {waMsg.text}
        </div>
      )}
    </div>

    {/* ─── Webhook Card ─── */}
    <div style={{ ...S.card, padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <Bell size={16} color={S.greenDark} />
        <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Webhook Setup</h3>
      </div>
      <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 24 }}>Paste these into your Meta App Dashboard.</p>

      {[
        { label: "Callback URL",  value: webhookUrl,                              key: "url"   },
        { label: "Verify Token",  value: webhookInfo?.verifyToken || "Loading…",  key: "token" },
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

{/* ─── Display Name Card ─── */}
<div style={{ ...S.card, padding: "32px" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <CircleDot size={16} color={S.greenDark} />
      <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Display Name</h3>
    </div>
    <button
      onClick={fetchNameStatus}
      disabled={nameStatusLoading}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 10, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
      <RefreshCw size={10} style={{ animation: nameStatusLoading ? "wpl-spin 0.8s linear infinite" : "none" }} />
      Refresh
    </button>
  </div>
  <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 24 }}>
    Request a display name change. Meta reviews and approves within 1–7 days.
  </p>

  {!waStatus?.connected ? (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a" }}>
      <AlertCircle size={13} color="#d97706" />
      <p style={{ fontSize: 12, color: "#92400e" }}>Connect WhatsApp first.</p>
    </div>
  ) : nameStatusLoading ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "40px 0", color: S.textMuted }}>
      <Activity size={16} color={S.green} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
      <span style={{ fontSize: 12 }}>Fetching from Meta…</span>
    </div>
  ) : (
    <>
      {/* Current Status Banner */}
      {nameStatus && (() => {
        const statusConfig = {
          APPROVED:       { bg: "rgba(37,211,102,0.1)",  border: "rgba(37,211,102,0.25)", color: S.greenDark,  icon: <Check size={13} />,        label: "Approved" },
          PENDING_REVIEW: { bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.3)",   color: "#a16207",    icon: <Clock size={13} />,        label: "Pending Review" },
          DECLINED:       { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",   color: "#dc2626",    icon: <AlertCircle size={13} />,  label: "Declined" },
          NONE:           { bg: "rgba(0,0,0,0.03)",      border: "rgba(0,0,0,0.08)",      color: S.textMuted,  icon: <CircleDot size={13} />,    label: "Not Set" },
        };
        const cfg = statusConfig[nameStatus.name_status] || statusConfig["NONE"];
        return (
          <div style={{ borderRadius: 16, padding: "16px", background: cfg.bg, border: `1px solid ${cfg.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: S.monoFont }}>
                Current Name
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 10, fontWeight: 700 }}>
                {cfg.icon} {cfg.label}
              </div>
            </div>
            <p style={{ fontSize: 18, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.02em", marginBottom: 10 }}>
              {nameStatus.verified_name || "—"}
            </p>

            {/* Extra info pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {nameStatus.display_phone_number && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", fontSize: 10, color: S.textMuted }}>
                  <Phone size={9} /> {nameStatus.display_phone_number}
                </div>
              )}
              {nameStatus.quality_rating && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: nameStatus.quality_rating === "GREEN" ? "rgba(37,211,102,0.08)" : nameStatus.quality_rating === "YELLOW" ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${nameStatus.quality_rating === "GREEN" ? "rgba(37,211,102,0.2)" : nameStatus.quality_rating === "YELLOW" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}`, fontSize: 10, color: nameStatus.quality_rating === "GREEN" ? S.greenDark : nameStatus.quality_rating === "YELLOW" ? "#a16207" : "#dc2626", fontWeight: 700 }}>
                  <Activity size={9} /> Quality: {nameStatus.quality_rating}
                </div>
              )}
              {nameStatus.code_verification_status && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.14)", fontSize: 10, color: "#2563eb" }}>
                  <Check size={9} /> {nameStatus.code_verification_status}
                </div>
              )}
            </div>

            {/* Declined reason hint */}
            {nameStatus.name_status === "DECLINED" && (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <p style={{ fontSize: 11, color: "#dc2626", lineHeight: 1.6 }}>
                  Your name request was declined by Meta. Common reasons: name contains restricted words, doesn't match your business, or violates WhatsApp policies. Try a different name below.
                </p>
              </div>
            )}

            {/* Pending hint */}
            {nameStatus.name_status === "PENDING_REVIEW" && (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <p style={{ fontSize: 11, color: "#a16207", lineHeight: 1.6 }}>
                  Your name is under review by Meta. This typically takes 1–7 business days. Click Refresh to check the latest status.
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Request New Name */}
      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>
          Request New Name
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            className="dinput"
            value={requestedName}
            onChange={e => setRequestedName(e.target.value)}
            placeholder="Your Business Name"
            maxLength={60}
            style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: S.greenDeep, fontFamily: S.monoFont }}
          />
          <button
            onClick={handleNameChangeRequest}
            disabled={nameReqLoading || !requestedName.trim() || requestedName.trim() === nameStatus?.verified_name}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: nameReqLoading || !requestedName.trim() ? "not-allowed" : "pointer", fontFamily: S.font, flexShrink: 0, border: "none", background: nameReqLoading || !requestedName.trim() ? "rgba(0,0,0,0.06)" : S.greenGrad, color: nameReqLoading || !requestedName.trim() ? S.textFaint : "#fff", boxShadow: nameReqLoading || !requestedName.trim() ? "none" : "0 4px 14px rgba(37,211,102,0.3)", opacity: nameReqLoading ? 0.7 : 1 }}>
            {nameReqLoading
              ? <><Activity size={12} style={{ animation: "wpl-spin 0.8s linear infinite" }} />Submitting…</>
              : <><Send size={12} />Request</>}
          </button>
        </div>
        <p style={{ fontSize: 10, color: S.textFaint, display: "flex", alignItems: "center", gap: 5 }}>
          <AlertCircle size={9} color="#d97706" />
          Name must represent your actual business. Misleading names will be declined.
        </p>
      </div>

      {/* Feedback */}
      {nameReqMsg.text && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, padding: "10px 14px", borderRadius: 12, background: nameReqMsg.type === "success" ? "rgba(37,211,102,0.12)" : "rgba(239,68,68,0.12)", color: nameReqMsg.type === "success" ? "#4ade80" : "#f87171", fontSize: 12 }}>
          {nameReqMsg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {nameReqMsg.text}
        </div>
      )}
    </>
  )}
</div>
    {/* ─── Profile Info Card ─── */}
    <div style={{ ...S.card, padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <User size={16} color={S.greenDark} />
          <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Profile Info</h3>
        </div>
        {profileFetching && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: S.greenDark }}>
            <Activity size={10} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> Syncing…
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 20 }}>Update your WhatsApp Business profile details.</p>

      {!waStatus?.connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle size={13} color="#d97706" />
          <p style={{ fontSize: 12, color: "#92400e" }}>Connect WhatsApp first to manage your profile.</p>
        </div>
      ) : (
        <>
          {/* About */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>About / Status</label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <textarea
                  value={profileForm.about}
                  onChange={e => setProfileForm({ ...profileForm, about: e.target.value })}
                  placeholder="We're here to help you 24/7…"
                  rows={3}
                  maxLength={139}
                  style={{ width: "100%", background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: S.greenDeep, fontFamily: S.monoFont, resize: "vertical" }}
                />
                <p style={{ fontSize: 10, color: S.textFaint, marginTop: 3, textAlign: "right" }}>{profileForm.about?.length || 0}/139</p>
              </div>
              <button onClick={() => handleUpdateProfile("about")} disabled={profileLoading.about}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: `1px solid ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, opacity: profileLoading.about ? 0.6 : 1 }}>
                {profileLoading.about ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : <Check size={11} />}
                {profileLoading.about ? "…" : "Save"}
              </button>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>Business Email</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="dinput" type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="support@yourbusiness.com"
                style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: S.greenDeep, fontFamily: S.monoFont }} />
              <button onClick={() => handleUpdateProfile("email")} disabled={profileLoading.email}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: `1px solid ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, opacity: profileLoading.email ? 0.6 : 1 }}>
                {profileLoading.email ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : <Check size={11} />}
                {profileLoading.email ? "…" : "Save"}
              </button>
            </div>
          </div>

          {/* Website */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>Website</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="dinput" type="url"
                value={profileForm.website}
                onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                placeholder="https://yourbusiness.com"
                style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: S.greenDeep, fontFamily: S.monoFont }} />
              <button onClick={() => handleUpdateProfile("website")} disabled={profileLoading.website}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: `1px solid ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, opacity: profileLoading.website ? 0.6 : 1 }}>
                {profileLoading.website ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : <Check size={11} />}
                {profileLoading.website ? "…" : "Save"}
              </button>
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>Business Address</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="dinput"
                value={profileForm.address}
                onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="123 Main St, City, Country"
                style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: S.greenDeep, fontFamily: S.monoFont }} />
              <button onClick={() => handleUpdateProfile("address")} disabled={profileLoading.address}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: `1px solid ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, opacity: profileLoading.address ? 0.6 : 1 }}>
                {profileLoading.address ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : <Check size={11} />}
                {profileLoading.address ? "…" : "Save"}
              </button>
            </div>
          </div>

          {/* Vertical / Category */}
          <div style={{ marginBottom: 4 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: S.monoFont }}>Business Category</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={profileForm.vertical || ""}
                onChange={e => setProfileForm({ ...profileForm, vertical: e.target.value })}
                style={{ flex: 1, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: S.greenDeep, fontFamily: S.monoFont }}>
                <option value="">Select category…</option>
                {["UNDEFINED","OTHER","AUTO","BEAUTY","APPAREL","EDU","ENTERTAIN","EVENT_PLAN","FINANCE","GROCERY","GOVT","HOTEL","HEALTH","NONPROFIT","PROF_SERVICES","RETAIL","TRAVEL","RESTAURANT","NOT_A_BIZ"].map(v => (
                  <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
                ))}
              </select>
              <button onClick={() => handleUpdateProfile("vertical")} disabled={profileLoading.vertical}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: S.font, flexShrink: 0, border: `1px solid ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, opacity: profileLoading.vertical ? 0.6 : 1 }}>
                {profileLoading.vertical ? <Activity size={11} style={{ animation: "wpl-spin 0.8s linear infinite" }} /> : <Check size={11} />}
                {profileLoading.vertical ? "…" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {profileMsg.text && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "9px 14px", borderRadius: 12, background: profileMsg.type === "success" ? "rgba(37,211,102,0.12)" : "rgba(239,68,68,0.12)", color: profileMsg.type === "success" ? "#4ade80" : "#f87171", fontSize: 12 }}>
          {profileMsg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {profileMsg.text}
        </div>
      )}
    </div>

    {/* ─── Profile Photo Card ─── */}
    <div style={{ ...S.card, padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <ImageIcon size={16} color={S.greenDark} />
        <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>Profile Photo</h3>
      </div>
      <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 24 }}>Upload a photo for your WhatsApp Business profile.</p>

      {/* Preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: S.greenBg, border: `3px solid ${S.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {profilePhoto.preview || currentPhoto
              ? <img src={profilePhoto.preview || currentPhoto} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : profileFetching
                ? <Activity size={24} color={S.greenBorder} style={{ animation: "wpl-spin 0.8s linear infinite" }} />
                : <User size={36} color={S.greenBorder} />}
          </div>
          {(profilePhoto.preview || currentPhoto) && (
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, borderRadius: "50%", background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}>
              <Check size={12} color="#fff" />
            </div>
          )}
        </div>
      </div>

      {!waStatus?.connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle size={13} color="#d97706" />
          <p style={{ fontSize: 12, color: "#92400e" }}>Connect WhatsApp first to update your photo.</p>
        </div>
      ) : (
        <>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "11px 0", borderRadius: 14, border: `1px dashed ${S.greenBorder}`, background: S.greenBg, color: S.greenDark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font, marginBottom: 8 }}>
            <Upload size={13} /> {profilePhoto.file ? profilePhoto.file.name : "Choose Image"}
            <input type="file" accept="image/jpeg,image/png" hidden onChange={handlePhotoSelect} />
          </label>
          <p style={{ fontSize: 10, color: S.textFaint, textAlign: "center", marginBottom: 16 }}>JPEG or PNG · Max 5 MB · Recommended 640×640 px</p>

          <button onClick={handlePhotoUpload}
            disabled={!profilePhoto.file || profilePhoto.uploading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: profilePhoto.file ? S.greenGrad : "rgba(0,0,0,0.06)", border: "none", color: profilePhoto.file ? "#fff" : S.textFaint, fontSize: 13, fontWeight: 700, cursor: profilePhoto.file ? "pointer" : "not-allowed", fontFamily: S.font, boxShadow: profilePhoto.file ? "0 8px 24px rgba(37,211,102,0.3)" : "none", opacity: profilePhoto.uploading ? 0.7 : 1 }}>
            {profilePhoto.uploading
              ? <><Activity size={12} style={{ animation: "wpl-spin 0.8s linear infinite" }} />Uploading…</>
              : <><Upload size={13} />Upload Photo</>}
          </button>
        </>
      )}

      {profilePhoto.msg && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "9px 14px", borderRadius: 12, background: profilePhoto.msg.type === "success" ? "rgba(37,211,102,0.12)" : "rgba(239,68,68,0.12)", color: profilePhoto.msg.type === "success" ? "#4ade80" : "#f87171", fontSize: 12 }}>
          {profilePhoto.msg.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {profilePhoto.msg.text}
        </div>
      )}
    </div>

  </div>
)}
              {/* ─── CONTACTS ─── */}
              {activeTab === "contacts" && (
                <div style={{ animation: "wpl-fadein 0.35s ease both" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: "Total Contacts",  val: contactStats?.total,         Icon: Users,      col: "#7c3aed", bg: "#ede9fe", accent: "purple" },
                      { label: "New Today",        val: contactStats?.newToday,       Icon: TrendingUp, col: "#2563eb", bg: "#dbeafe", accent: "blue" },
                      { label: "Active This Week", val: contactStats?.activeThisWeek, Icon: Activity,   col: S.greenDark, bg: S.greenBg, accent: "green" },
                    ].map(({ label, val, Icon, col, bg, accent }) => (
                      <div key={label} className={`metric-card ${accent}`} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${S.border}` }}>
                          <Icon size={18} color={col} />
                        </div>
                        <div>
                          <p style={{ fontSize: 28, fontWeight: 900, color: S.textPrimary, letterSpacing: "-0.04em", lineHeight: 1 }}>{val ?? 0}</p>
                          <p style={{ fontSize: 11.5, color: S.textMuted, marginTop: 4 }}>{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ ...S.card, overflow: "hidden" }}>
                    <div className="contacts-toolbar" style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                      <div className="table-scroll">
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
                      </div>  
                    )}

                    {isFree && contactTotal > 50 && (
                      <div
                        onClick={() => navTo("upgrade")}
                        style={{ margin: "12px 16px", padding: "18px 20px", borderRadius: 16, background: S.tealGrad, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 4px 16px rgba(7,94,84,0.25)" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 800, color: "#4ade80", marginBottom: 3 }}>
                            ⚡ {contactTotal - 50}+ contacts hidden
                          </p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                            Upgrade to Pro to view all {contactTotal} contacts
                          </p>
                        </div>
                        <div style={{ padding: "8px 16px", borderRadius: 10, background: S.greenGrad, fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>
                          Get Pro →
                        </div>
                      </div>
                    )}
                    {!isFree && contactTotal > 20 && (
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

              {/* ─── BROADCAST ─── */}
              {activeTab === "broadcast" && (() => {
                const statusBadge = (c) => (
                  <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:c.status==="done"?"rgba(37,211,102,0.1)":c.status==="running"?"rgba(234,179,8,0.1)":"rgba(239,68,68,0.1)",color:c.status==="done"?S.greenDark:c.status==="running"?"#b45309":"#dc2626"}}>
                    {c.status==="running"&&<Loader2 size={9} style={{animation:"wpl-spin 0.8s linear infinite"}}/>}
                    {c.status==="done"&&<CheckCircle2 size={9}/>}
                    {c.status==="failed"&&<XCircle size={9}/>}
                    {c.status}
                  </span>
                );

                return (
                  <div style={{ animation: "wpl-fadein 0.4s ease both", display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ ...S.card, padding: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}><Megaphone size={16} color="#fff" /></div>
                        <div>
                          <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>New Broadcast</h3>
                          <p style={{ fontSize: 11, color: S.textMuted }}>Send to your contacts — all message types supported</p>
                        </div>
                        {walletData && <div style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 20, background: S.greenBg, border: `1px solid ${S.greenBorder}` }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: S.greenDark }}>Wallet: ₹{walletData.balanceRupees}</span>
                        </div>}
                      </div>

                      {/* 24hr Filter Toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Audience</span>
                        <InfoTip title="Audience Selection" text={`All Contacts: sends a marketing message (₹0.90/msg) to everyone.\n\nActive last 24hrs: contact messaged you recently — qualifies for the cheaper service rate (₹0.20/msg) within WhatsApp's 24-hour customer service window.`} width={280} />
                      </div>
                      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                        {[{val:false,label:"All Contacts",count:contactPreview,rate:"₹0.90/msg"},{val:true,label:"Active last 24hrs",count:active24Count,rate:"₹0.20/msg"}].map(opt=>(
                          <button key={String(opt.val)} onClick={()=>setCampaignForm(f=>({...f,filterLast24hrs:opt.val}))}
                            style={{flex:1,padding:"12px 16px",borderRadius:14,border:`2px solid ${campaignForm.filterLast24hrs===opt.val?S.greenDark:S.greenBorder}`,background:campaignForm.filterLast24hrs===opt.val?S.greenBg:"#fff",cursor:"pointer",fontFamily:S.font,textAlign:"left"}}>
                            <div style={{fontSize:13,fontWeight:700,color:campaignForm.filterLast24hrs===opt.val?S.greenDark:S.textPrimary}}>{opt.label}</div>
                            <div style={{fontSize:11,color:S.textMuted,marginTop:2}}>{opt.count!=null?`${opt.count} contacts`:""} · {opt.rate}</div>
                          </button>
                        ))}
                      </div>

                      <div style={{ display: "grid", gap: 14 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Campaign Name</label>
                          <input style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, outline: "none" }} placeholder="e.g. Summer Sale" value={campaignForm.name} onChange={e=>setCampaignForm(f=>({...f,name:e.target.value}))}/>
                        </div>
                        <div>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Template <InfoTip title="Why Templates Only?" text={"Per Meta policy, messages sent outside the 24-hour service window must use pre-approved templates.\n\nOnly APPROVED MARKETING templates are shown here.\n\nCreate templates in the Templates tab and wait for Meta approval (usually 24-48 hours)."} width={280} />
                          </label>
                          <TemplateSelector value={campaignForm.message} onChange={v=>setCampaignForm(f=>({...f,message:v||{type:'template',templateName:''}}))} headers={headers} S={S} />
                        </div>
                        {availableTags.length > 0 && <div>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}><Tag size={11}/> Filter by Tags <InfoTip title="Filter by Tags" text="Select one or more tags to narrow recipients. Only contacts with ALL selected tags will receive this broadcast. Leave empty to send to the full audience." width={260} /></label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {availableTags.map(tag=>{const active=campaignForm.targetTags.includes(tag);return(<button key={tag} onClick={()=>setCampaignForm(f=>({...f,targetTags:active?f.targetTags.filter(t=>t!==tag):[...f.targetTags,tag]}))} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:S.font,border:`1px solid ${active?S.greenDark:S.greenBorder}`,background:active?S.greenGrad:"#fff",color:active?"#fff":S.textMuted}}>#{tag}</button>);})}
                          </div>
                        </div>}
                        {broadcastMsg.text && <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:12,background:broadcastMsg.type==="success"?"rgba(37,211,102,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${broadcastMsg.type==="success"?"rgba(37,211,102,0.2)":"rgba(239,68,68,0.2)"}`,color:broadcastMsg.type==="success"?S.greenDark:"#dc2626",fontSize:12,fontWeight:600}}>
                          {broadcastMsg.type==="success"?<CheckCircle2 size={13}/>:<XCircle size={13}/>} {broadcastMsg.text}
                        </div>}
                        <button onClick={handleSendBroadcast} disabled={broadcastSending}
                          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,background:broadcastSending?"rgba(0,0,0,0.06)":S.greenGrad,border:"none",color:broadcastSending?S.textMuted:"#fff",fontSize:14,fontWeight:800,cursor:broadcastSending?"not-allowed":"pointer",fontFamily:S.font,boxShadow:broadcastSending?"none":"0 8px 24px rgba(37,211,102,0.3)"}}>
                          {broadcastSending?<><Loader2 size={14} style={{animation:"wpl-spin 0.8s linear infinite"}}/>Sending…</>:<><Send size={14}/>Launch Broadcast</>}
                        </button>
                      </div>
                    </div>

                    {/* History */}
                    <div style={{ ...S.card, padding: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: S.textPrimary }}>Campaign History</h3>
                        <button onClick={refreshCampaigns} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:10,background:S.greenBg,border:`1px solid ${S.greenBorder}`,color:S.greenDark,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:S.font}}><RefreshCw size={11}/>Refresh</button>
                      </div>
                      {campaigns.length===0?<p style={{textAlign:"center",padding:"24px 0",color:S.textFaint,fontSize:13}}>No campaigns yet</p>:(
                        <div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                            <thead><tr style={{borderBottom:`1px solid ${S.border}`}}>{["Campaign","Filter","Status","Sent","Failed","Cost","Date"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:S.textFaint,textTransform:"uppercase",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                            <tbody>{campaigns.map(c=><tr key={c._id} style={{borderBottom:`1px solid ${S.border}`}}>
                              <td style={{padding:"12px",fontWeight:600,color:S.textPrimary,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</td>
                              <td style={{padding:"12px"}}><span style={{fontSize:11,color:S.textMuted}}>{c.filterLast24hrs?"24hr only":"All"}</span></td>
                              <td style={{padding:"12px"}}>{statusBadge(c)}</td>
                              <td style={{padding:"12px",color:S.greenDark,fontWeight:700}}>{c.sentCount}</td>
                              <td style={{padding:"12px",color:c.failedCount>0?"#dc2626":S.textMuted}}>{c.failedCount}</td>
                              <td style={{padding:"12px",color:S.textPrimary,fontWeight:600}}>₹{((c.costPaise||0)/100).toFixed(2)}</td>
                              <td style={{padding:"12px",color:S.textFaint,fontSize:11,fontFamily:S.monoFont}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                            </tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ─── BULK UPLOAD ─── */}
              {activeTab === "bulk" && (() => {
                const validNums   = bulkNumbers.filter(e => e.valid);
                const invalidNums = bulkNumbers.filter(e => !e.valid);
                const warnNums    = bulkNumbers.filter(e => e.valid && e.warn);
                const estCost     = validNums.length * 0.90;
                const estSecs     = Math.ceil(validNums.length * 0.25);
                const estTimeStr  = estSecs < 60 ? `~${estSecs}s` : `~${Math.ceil(estSecs/60)}m`;
                const balance     = walletData ? parseFloat(walletData.balanceRupees) : null;
                const canAfford   = balance === null || balance >= estCost;
                const msgReady    = !!(bulkForm.message?.templateName?.trim());

                return (
                    <div style={{ animation: "wpl-fadein 0.4s ease both", display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>

                      {/* ── LEFT: Form ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Header */}
                        <div style={{ ...S.card, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#dc2626,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Upload size={18} color="#fff"/></div>
                          <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: S.textPrimary, margin: 0 }}>Cold Outreach</h2>
                            <p style={{ fontSize: 12, color: S.textMuted, margin: "2px 0 0" }}>Send WhatsApp messages to any phone number list · ₹0.90 per message</p>
                          </div>
                          {walletData && (
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontSize: 10, color: S.textFaint, margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Wallet</p>
                              <p style={{ fontSize: 16, fontWeight: 800, color: canAfford && validNums.length > 0 ? S.greenDark : validNums.length > 0 ? "#dc2626" : S.textPrimary, margin: 0 }}>₹{walletData.balanceRupees}</p>
                            </div>
                          )}
                        </div>

                        {/* Step 1: Add Recipients */}
                        <div style={{ ...S.card, padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 8, background: bulkNumbers.length > 0 ? S.greenGrad : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                              {bulkNumbers.length > 0 ? <CheckCircle2 size={14} color="#fff"/> : <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>1</span>}
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary, margin: 0 }}>Add Recipients</h3>
                            <InfoTip title="Adding Phone Numbers" text={"Upload a CSV file or type numbers directly.\n\nAlways include the country code:\n• India: 91XXXXXXXXXX\n• US: 1XXXXXXXXXX\n• UK: 44XXXXXXXXXX\n\nDuplicates are removed automatically. Numbers shorter than 10 digits are rejected."} width={280} />
                          </div>

                          {/* Upload + manual input */}
                          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: `2px dashed ${S.greenBorder}`, background: S.greenBg, cursor: "pointer", fontSize: 12, color: S.greenDark, fontWeight: 700, whiteSpace: "nowrap", transition: "background 0.15s" }}>
                              <Upload size={13}/> Upload CSV
                              <input type="file" accept=".csv,.txt" hidden onChange={handleCsvUpload}/>
                            </label>
                            <input
                              style={{ flex: 1, padding: "10px 13px", fontSize: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }}
                              placeholder="Paste numbers: 919876543210, 918765432109, …"
                              value={bulkManualInput}
                              onChange={e => setBulkManualInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBulkManualNumber(); } }}
                            />
                            <button onClick={addBulkManualNumber} style={{ padding: "10px 16px", borderRadius: 10, background: S.greenGrad, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>Add</button>
                          </div>
                          <p style={{ fontSize: 10.5, color: S.textFaint, margin: "0 0 14px" }}>CSV format: one number per row — include country code (e.g. <span style={{ fontFamily: S.monoFont }}>919876543210</span>)</p>

                          {/* Number list */}
                          {bulkNumbers.length === 0 ? (
                            <div style={{ padding: "28px 20px", borderRadius: 12, border: `1.5px dashed ${S.border}`, textAlign: "center" }}>
                              <Upload size={22} color={S.textFaint} style={{ margin: "0 auto 8px" }}/>
                              <p style={{ fontSize: 13, color: S.textFaint, margin: 0 }}>No numbers added yet</p>
                              <p style={{ fontSize: 11, color: S.textFaint, margin: "4px 0 0", opacity: 0.7 }}>Upload a CSV or paste numbers above</p>
                            </div>
                          ) : (
                            <div style={{ borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                              {/* Stats bar */}
                              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 14px", background: S.greenBg, borderBottom: `1px solid ${S.border}` }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                                  <CheckCircle2 size={12}/> {validNums.length} valid
                                </span>
                                {invalidNums.length > 0 && (
                                  <button onClick={() => setBulkShowInvalid(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "none", borderRadius: 6, padding: "2px 8px", cursor: "pointer" }}>
                                    <XCircle size={12}/> {invalidNums.length} invalid {bulkShowInvalid ? "▲" : "▼"}
                                  </button>
                                )}
                                {warnNums.length > 0 && (
                                  <span style={{ fontSize: 11, color: "#b45309", fontWeight: 600 }}>⚠ {warnNums.length} warnings</span>
                                )}
                                <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, marginLeft: "auto" }}>Est. ₹{estCost.toFixed(2)}</span>
                                <button onClick={() => { setBulkNumbers([]); setBulkForm(f => ({ ...f, phoneNumbers: [] })); }} style={{ fontSize: 11, color: S.textFaint, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Clear all</button>
                              </div>

                              {/* Scrollable rows */}
                              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                                {bulkNumbers.filter(e => e.valid || bulkShowInvalid).map((e, i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderBottom: `1px solid ${S.border}`, background: !e.valid ? "rgba(220,38,38,0.02)" : "transparent" }}>
                                    {e.valid
                                      ? <CheckCircle2 size={13} color={e.warn ? "#b45309" : "#16a34a"} style={{ flexShrink: 0 }}/>
                                      : <XCircle size={13} color="#dc2626" style={{ flexShrink: 0 }}/>
                                    }
                                    <span style={{ fontSize: 12, color: !e.valid ? "#dc2626" : S.textPrimary, fontFamily: S.monoFont, flex: 1, letterSpacing: "0.03em" }}>{e.num}</span>
                                    {e.warn   && <span style={{ fontSize: 10, color: "#b45309", background: "#fef3c7", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>⚠ {e.warn}</span>}
                                    {e.reason && <span style={{ fontSize: 10, color: "#dc2626", background: "#fee2e2", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{e.reason}</span>}
                                    <button onClick={() => removeBulkNumber(e.num)} style={{ fontSize: 15, color: S.textFaint, background: "none", border: "none", cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0 }}>×</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Step 2: Compose Message */}
                        <div style={{ ...S.card, padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 8, background: msgReady ? S.greenGrad : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                              {msgReady ? <CheckCircle2 size={14} color="#fff"/> : <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>2</span>}
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary, margin: 0 }}>Select Template</h3>
                            <InfoTip title="Why Templates Only?" text={"Per Meta policy, cold outreach to numbers that haven't messaged you in the last 24 hours requires a pre-approved WhatsApp template.\n\nCreate and submit templates for approval in the Templates tab. Approval typically takes 24–48 hours."} width={290} />
                          </div>
                          <TemplateSelector value={bulkForm.message} onChange={v => setBulkForm(f => ({ ...f, message: v || { type:'template', templateName:'' } }))} headers={headers} S={S} />
                        </div>

                        {/* Step 3: Review & Launch */}
                        <div style={{ ...S.card, padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>3</span>
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary, margin: 0 }}>Review & Launch</h3>
                          </div>

                          {/* Campaign name */}
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Campaign Name</label>
                            <input
                              style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, outline: "none" }}
                              placeholder="e.g. May Promo Launch, Festive Offer 2025"
                              value={bulkForm.name}
                              onChange={e => setBulkForm(f => ({ ...f, name: e.target.value }))}
                            />
                          </div>

                          {/* Pre-launch summary */}
                          {validNums.length > 0 && (
                            <div style={{ borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden", marginBottom: 16 }}>
                              <div style={{ padding: "10px 16px", background: S.greenBg, borderBottom: `1px solid ${S.border}` }}>
                                <p style={{ fontSize: 11, fontWeight: 800, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Pre-launch Summary</p>
                              </div>
                              {[
                                { label: "Recipients",     value: `${validNums.length} valid numbers`, ok: true },
                                { label: "Skipped",        value: invalidNums.length > 0 ? `${invalidNums.length} invalid (will not be sent)` : "None", ok: true },
                                { label: "Rate",           value: "₹0.90 per message (marketing)", ok: true },
                                { label: "Estimated Cost", value: `₹${estCost.toFixed(2)}`, ok: canAfford, warn: !canAfford ? "Insufficient wallet balance" : null },
                                { label: "Your Balance",   value: balance !== null ? `₹${balance.toFixed(2)}` : "Loading…", ok: canAfford },
                                { label: "Est. Duration",  value: `${estTimeStr} (${validNums.length} msgs × 250ms delay)`, ok: true },
                              ].map(({ label, value, ok, warn }) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderBottom: `1px solid ${S.border}` }}>
                                  <span style={{ fontSize: 12, color: S.textMuted, fontWeight: 600 }}>{label}</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {warn && <span style={{ fontSize: 10, color: "#dc2626", background: "#fee2e2", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>{warn}</span>}
                                    <span style={{ fontSize: 12, fontWeight: 700, color: ok ? S.textPrimary : "#dc2626" }}>{value}</span>
                                    {ok ? <CheckCircle2 size={12} color="#16a34a"/> : <XCircle size={12} color="#dc2626"/>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Status message */}
                          {bulkMsg.text && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: bulkMsg.type === "success" ? "rgba(37,211,102,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${bulkMsg.type === "success" ? "rgba(37,211,102,0.2)" : "rgba(239,68,68,0.2)"}`, color: bulkMsg.type === "success" ? S.greenDark : "#dc2626", fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
                              {bulkMsg.type === "success" ? <CheckCircle2 size={13}/> : <XCircle size={13}/>} {bulkMsg.text}
                            </div>
                          )}

                          {/* Launch button */}
                          <button
                            onClick={handleSendBulk}
                            disabled={bulkSending || !canAfford || validNums.length === 0}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: "14px 0", borderRadius: 14, background: bulkSending || !canAfford || validNums.length === 0 ? "rgba(0,0,0,0.06)" : "linear-gradient(135deg,#dc2626,#ef4444)", border: "none", color: bulkSending || !canAfford || validNums.length === 0 ? S.textMuted : "#fff", fontSize: 14, fontWeight: 800, cursor: bulkSending || !canAfford || validNums.length === 0 ? "not-allowed" : "pointer", fontFamily: S.font, boxShadow: bulkSending || !canAfford || validNums.length === 0 ? "none" : "0 8px 24px rgba(220,38,38,0.3)", transition: "all 0.2s" }}>
                            {bulkSending
                              ? <><Loader2 size={15} style={{ animation: "wpl-spin 0.8s linear infinite" }}/> Sending… {validNums.length} messages</>
                              : <><Send size={15}/> Launch Cold Outreach{validNums.length > 0 ? ` · ${validNums.length} numbers` : ""}</>
                            }
                          </button>
                          {!canAfford && validNums.length > 0 && (
                            <p style={{ fontSize: 11, color: "#dc2626", textAlign: "center", margin: "8px 0 0", fontWeight: 600 }}>
                              Insufficient balance — need ₹{estCost.toFixed(2)}, have ₹{balance?.toFixed(2) ?? "…"}. Please recharge your wallet.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ── RIGHT: Tips + History ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Best practices */}
                        <div style={{ ...S.card, padding: 22 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Info size={14} color="#fff"/></div>
                            <h3 style={{ fontSize: 13, fontWeight: 800, color: S.textPrimary, margin: 0 }}>Maximum Delivery Rate</h3>
                          </div>
                          {[
                            { ok: true,  text: "Always include country code (91XXXXXXXXXX for India)" },
                            { ok: true,  text: "Keep message under 200 characters for best readability" },
                            { ok: true,  text: "Use a personal, conversational tone — avoid sounding like spam" },
                            { ok: true,  text: "Send to numbers that have a WhatsApp account" },
                            { ok: true,  text: "Use button/list messages to drive engagement" },
                            { ok: false, text: "Avoid all-caps, excessive punctuation or promotional buzzwords" },
                            { ok: false, text: "Don't send the same number twice in quick succession" },
                            { ok: false, text: "Avoid sending to numbers that have blocked your business" },
                          ].map(({ ok, text }, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9 }}>
                              <span style={{ fontSize: 12, color: ok ? "#16a34a" : "#dc2626", flexShrink: 0, marginTop: 1 }}>{ok ? "✓" : "✗"}</span>
                              <p style={{ fontSize: 11.5, color: S.textMuted, margin: 0, lineHeight: 1.5 }}>{text}</p>
                            </div>
                          ))}
                          <div style={{ marginTop: 14, padding: "10px 13px", borderRadius: 10, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                            <p style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, margin: "0 0 3px" }}>WhatsApp Policy</p>
                            <p style={{ fontSize: 10.5, color: "#6d28d9", margin: 0, lineHeight: 1.5 }}>Cold outreach is charged at the marketing rate (₹0.90/msg). Numbers must have opted into receiving business messages to ensure compliance and avoid account restrictions.</p>
                          </div>
                        </div>

                        {/* Campaign history */}
                        <div style={{ ...S.card, padding: 22 }}>
                          <h3 style={{ fontSize: 13, fontWeight: 800, color: S.textPrimary, marginBottom: 16 }}>Campaign History</h3>
                          {bulkCampaigns.length === 0 ? (
                            <div style={{ padding: "24px 0", textAlign: "center" }}>
                              <p style={{ fontSize: 13, color: S.textFaint, margin: 0 }}>No campaigns yet</p>
                            </div>
                          ) : bulkCampaigns.map(c => {
                            const delivRate = c.sentCount > 0 ? Math.round((c.deliveredCount || 0) / c.sentCount * 100) : 0;
                            const readRate  = c.sentCount > 0 ? Math.round((c.readCount || 0) / c.sentCount * 100) : 0;
                            const statusColor = c.status === "done" ? "#16a34a" : c.status === "running" ? "#b45309" : "#dc2626";
                            const statusBg    = c.status === "done" ? "#dcfce7" : c.status === "running" ? "#fef3c7" : "#fee2e2";
                            return (
                              <div key={c._id} style={{ padding: 16, borderRadius: 14, border: `1px solid ${S.border}`, marginBottom: 10 }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary, margin: 0, flex: 1, lineHeight: 1.3 }}>{c.name}</p>
                                  <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, background: statusBg, padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{c.status}</span>
                                </div>

                                {/* Stats row */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
                                  {[
                                    { l: "Sent",      v: c.sentCount,          col: S.greenDark },
                                    { l: "Delivered", v: c.deliveredCount || 0, col: "#2563eb" },
                                    { l: "Read",      v: c.readCount || 0,      col: "#7c3aed" },
                                    { l: "Failed",    v: c.failedCount,         col: "#dc2626" },
                                  ].map(({ l, v, col }) => (
                                    <div key={l} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 9, background: S.greenBg }}>
                                      <p style={{ fontSize: 15, fontWeight: 800, color: col, margin: 0 }}>{v}</p>
                                      <p style={{ fontSize: 8.5, color: S.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", margin: "2px 0 0" }}>{l}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Delivery rate bar */}
                                {c.sentCount > 0 && (
                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                      <span style={{ fontSize: 10, color: S.textFaint, fontWeight: 600 }}>Delivery rate</span>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb" }}>{delivRate}%</span>
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: S.border, overflow: "hidden" }}>
                                      <div style={{ height: "100%", width: `${delivRate}%`, background: "linear-gradient(90deg,#2563eb,#60a5fa)", borderRadius: 3, transition: "width 0.4s" }}/>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                                      <span style={{ fontSize: 10, color: S.textFaint, fontWeight: 600 }}>Read rate</span>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed" }}>{readRate}%</span>
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: S.border, overflow: "hidden", marginTop: 4 }}>
                                      <div style={{ height: "100%", width: `${readRate}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 3, transition: "width 0.4s" }}/>
                                    </div>
                                  </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontSize: 10.5, color: S.textMuted }}>{c.totalCount} numbers · ₹{((c.costPaise || 0) / 100).toFixed(2)} spent</span>
                                  <span style={{ fontSize: 10, color: S.textFaint }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
              })()}

              {/* ─── TEMPLATES ─── */}
              {activeTab === "templates" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both", display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ ...S.card, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={16} color="#fff" /></div>
                        <div>
                          <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary }}>Message Templates</h3>
                          <p style={{ fontSize: 11, color: S.textMuted }}>Managed via your Meta WhatsApp Business account</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={()=>{setTemplatesLoading(true);axios.get(`${API}/api/templates`,{headers}).then(r=>setTemplates(r.data)).catch(()=>{}).finally(()=>setTemplatesLoading(false));}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,background:S.greenBg,border:`1px solid ${S.greenBorder}`,color:S.greenDark,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:S.font}}><RefreshCw size={11}/>Refresh</button>
                        <button onClick={()=>setShowCreateTpl(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,background:S.greenGrad,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:S.font,boxShadow:"0 4px 14px rgba(37,211,102,0.3)"}}><Plus size={12}/>Create Template</button>
                      </div>
                    </div>

                    {showCreateTpl && (
                      <div style={{ padding: "20px", borderRadius: 16, background: S.greenBg, border: `1px solid ${S.greenBorder}`, marginBottom: 20 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: S.textPrimary, marginBottom: 16 }}>New Template</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textMuted, marginBottom: 4, textTransform: "uppercase" }}>Name *</label>
                            <input style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }} placeholder="my_template_name" value={tplForm.name} onChange={e=>setTplForm(f=>({...f,name:e.target.value}))}/>
                          </div>
                          <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: S.textMuted, marginBottom: 4, textTransform: "uppercase" }}>Category * <InfoTip title="Template Category" text="Marketing: promotional content. Utility: transactional alerts. Authentication: OTP/login codes. Meta reviews templates before approval — matching the correct category speeds up review." width={270} position="right" /></label>
                            <select style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }} value={tplForm.category} onChange={e=>setTplForm(f=>({...f,category:e.target.value}))}>
                              <option value="MARKETING">Marketing</option>
                              <option value="UTILITY">Utility</option>
                              <option value="AUTHENTICATION">Authentication</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: S.textMuted, marginBottom: 4, textTransform: "uppercase" }}>Language *</label>
                            <select style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }} value={tplForm.language} onChange={e=>setTplForm(f=>({...f,language:e.target.value}))}>
                              <option value="en">English</option>
                              <option value="en_US">English (US)</option>
                              <option value="hi">Hindi</option>
                              <option value="mr">Marathi</option>
                              <option value="gu">Gujarati</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                          <input style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }} placeholder="Header (optional text)" value={tplForm.header} onChange={e=>setTplForm(f=>({...f,header:e.target.value}))}/>
                          <div style={{ position: "relative" }}>
                            <textarea rows={4} style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, resize: "vertical", outline: "none" }} placeholder="Body * — use {{1}} {{2}} for variables" value={tplForm.body} onChange={e=>setTplForm(f=>({...f,body:e.target.value}))}/>
                            <span style={{ position: "absolute", top: 8, right: 8 }}><InfoTip title="Template Variables" text="Use {{1}}, {{2}}, etc. as placeholders. When sending, these get replaced with actual values per contact. Example: 'Hi {{1}}, your order {{2}} is ready!'" width={260} position="left" /></span>
                          </div>
                          <input style={{ width: "100%", padding: "9px 12px", fontSize: 12, background: "#fff", border: `1px solid ${S.greenBorder}`, borderRadius: 10, color: S.textPrimary, fontFamily: S.font, outline: "none" }} placeholder="Footer (optional)" value={tplForm.footer} onChange={e=>setTplForm(f=>({...f,footer:e.target.value}))}/>
                        </div>
                        {tplMsg.text && <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,marginTop:10,background:tplMsg.type==="success"?"rgba(37,211,102,0.08)":"rgba(239,68,68,0.08)",color:tplMsg.type==="success"?S.greenDark:"#dc2626",fontSize:12,fontWeight:600}}>{tplMsg.type==="success"?<CheckCircle2 size={12}/>:<XCircle size={12}/>}{tplMsg.text}</div>}
                        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                          <button onClick={()=>setShowCreateTpl(false)} style={{padding:"9px 20px",borderRadius:10,background:"#fff",border:`1px solid ${S.border}`,color:S.textMuted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:S.font}}>Cancel</button>
                          <button onClick={handleCreateTemplate} disabled={tplSaving} style={{flex:1,padding:"9px 0",borderRadius:10,background:tplSaving?"rgba(0,0,0,0.06)":S.greenGrad,border:"none",color:tplSaving?S.textMuted:"#fff",fontSize:12,fontWeight:700,cursor:tplSaving?"not-allowed":"pointer",fontFamily:S.font}}>
                            {tplSaving?<><Loader2 size={11} style={{animation:"wpl-spin 0.8s linear infinite"}}/>Submitting…</>:"Submit to Meta"}
                          </button>
                        </div>
                      </div>
                    )}

                    {templatesLoading ? <div style={{ textAlign: "center", padding: "32px 0" }}><Loader2 size={20} style={{ animation: "wpl-spin 0.8s linear infinite", color: S.greenDark }} /></div> : templates.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "24px 0", color: S.textFaint, fontSize: 13 }}>No templates found. Create one above.</p>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {templates.map(t => {
                          const statusColor = t.status==="APPROVED"?S.greenDark:t.status==="PENDING"?"#b45309":"#dc2626";
                          const statusBg = t.status==="APPROVED"?"rgba(37,211,102,0.1)":t.status==="PENDING"?"rgba(234,179,8,0.1)":"rgba(239,68,68,0.1)";
                          const body = t.components?.find(c=>c.type==="BODY")?.text || "";
                          return (
                            <div key={t.id||t.name} style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${S.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary, fontFamily: S.monoFont }}>{t.name}</p>
                                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: statusBg, color: statusColor }}>{t.status}</span>
                                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: "rgba(0,0,0,0.04)", color: S.textFaint }}>{t.category}</span>
                                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, background: "rgba(0,0,0,0.04)", color: S.textFaint }}>{t.language}</span>
                                </div>
                                {body && <p style={{ fontSize: 12, color: S.textMuted, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>{body}</p>}
                              </div>
                              <button onClick={()=>handleDeleteTemplate(t.name)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Trash size={12} color="#dc2626"/></button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── WALLET ─── */}
              {activeTab === "wallet" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, alignItems: "start" }}>
                  {/* Balance & Recharge */}
                  <div style={{ ...S.card, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}><Wallet size={16} color="#fff" /></div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary }}>Your Wallet</h3>
                        <p style={{ fontSize: 11, color: S.textMuted }}>Recharge to send campaigns</p>
                      </div>
                    </div>

                    {walletLoading ? <div style={{ textAlign: "center", padding: "20px" }}><Loader2 size={20} style={{ animation: "wpl-spin 0.8s linear infinite", color: S.greenDark }} /></div> : walletData && (
                      <>
                        <div style={{ textAlign: "center", padding: "24px 0", marginBottom: 20, background: S.greenBg, borderRadius: 20, border: `1px solid ${S.greenBorder}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 6 }}>
                            <p style={{ fontSize: 11, color: S.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Available Balance</p>
                            <InfoTip title="Available Balance" text="Pre-paid balance deducted per message sent. Add funds via Razorpay (UPI, card, netbanking). Balance never expires." position="bottom" width={230} />
                          </div>
                          <p style={{ fontSize: 40, fontWeight: 900, color: S.greenDark, letterSpacing: "-0.04em" }}>₹{walletData.balanceRupees}</p>
                        </div>

                        {/* Pricing Table */}
                        <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 14, background: "#fff8f0", border: "1px solid #fed7aa" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em" }}>Pricing (incl. 25% markup over Meta)</p>
                            <InfoTip title="Pricing" text="Marketing rate applies to broadcasts sent outside the 24-hour window. Service rate applies when a contact messaged you in the last 24 hours — Meta allows cheaper service-category messages in that window." width={280} position="bottom" />
                          </div>
                          {[
                            { label: "Broadcast / Bulk (marketing)", rate: walletData.pricing.marketing.rupees, meta: walletData.pricing.metaBase.marketing },
                            { label: "24hr Active contacts (service)", rate: walletData.pricing.service.rupees, meta: walletData.pricing.metaBase.service },
                          ].map(({ label, rate, meta }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                              <span style={{ fontSize: 12, color: "#78350f" }}>{label}</span>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: 13, fontWeight: 800, color: "#92400e" }}>₹{rate}</span>
                                <span style={{ fontSize: 10, color: "#b45309", marginLeft: 4 }}>/ msg</span>
                                <span style={{ fontSize: 9, color: "#d97706", display: "block" }}>Meta: ₹{meta}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recharge */}
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Recharge</label>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                            {["100","500","1000","2000"].map(amt => (
                              <button key={amt} onClick={() => setRechargeAmount(amt)}
                                style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${rechargeAmount===amt?S.greenDark:S.greenBorder}`, background: rechargeAmount===amt?S.greenGrad:"#fff", color: rechargeAmount===amt?"#fff":S.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
                                ₹{amt}
                              </button>
                            ))}
                          </div>
                          <input type="number" min="10" style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, outline: "none" }} placeholder="Or enter custom amount (₹)" value={rechargeAmount} onChange={e => setRechargeAmount(e.target.value)}/>
                          {rechargeAmount && <p style={{ fontSize: 11, color: S.textMuted, marginTop: 4 }}>≈ {Math.floor(parseFloat(rechargeAmount) / 0.90)} marketing messages or {Math.floor(parseFloat(rechargeAmount) / 0.20)} service messages</p>}
                        </div>

                        {walletMsg.text && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, marginBottom: 12, background: walletMsg.type==="success"?"rgba(37,211,102,0.08)":"rgba(239,68,68,0.08)", color: walletMsg.type==="success"?S.greenDark:"#dc2626", fontSize: 12, fontWeight: 600 }}>{walletMsg.type==="success"?<CheckCircle2 size={12}/>:<XCircle size={12}/>}{walletMsg.text}</div>}

                        <button onClick={handleRecharge} disabled={recharging || !rechargeAmount}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 14, background: rechargeAmount?S.greenGrad:"rgba(0,0,0,0.06)", border: "none", color: rechargeAmount?"#fff":S.textFaint, fontSize: 14, fontWeight: 800, cursor: rechargeAmount?"pointer":"not-allowed", fontFamily: S.font, boxShadow: rechargeAmount?"0 8px 24px rgba(37,211,102,0.3)":"none" }}>
                          {recharging?<><Loader2 size={14} style={{animation:"wpl-spin 0.8s linear infinite"}}/>Opening payment…</>:<><Wallet size={14}/>Recharge via Razorpay</>}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Transaction History */}
                  <div style={{ ...S.card, padding: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.textPrimary, marginBottom: 18 }}>Transaction History</h3>
                    {!walletData?.transactions?.length ? <p style={{ textAlign: "center", padding: "24px 0", color: S.textFaint, fontSize: 13 }}>No transactions yet</p> : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {walletData.transactions.map(tx => (
                          <div key={tx._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}` }}>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 600, color: S.textPrimary }}>{tx.description || (tx.type==="credit"?"Recharge":"Debit")}</p>
                              <p style={{ fontSize: 10, color: S.textFaint, fontFamily: S.monoFont, marginTop: 2 }}>{new Date(tx.createdAt).toLocaleString()}</p>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 800, color: tx.type==="credit"?S.greenDark:"#dc2626" }}>
                              {tx.type==="credit"?"+":"-"}₹{(tx.amount/100).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── SHOP ─── */}
              {activeTab === "shop" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both" }}>
                  <ShopPage />
                </div>
              )}

              {/* ─── QR CODE & LINKS ─── */}
              {activeTab === "qrcode" && (
                <div style={{ animation: "wpl-fadein 0.4s ease both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, alignItems: "start" }}>

                  {/* Generator Card */}
                  <div style={{ ...S.card, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: S.greenGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <QrCode size={16} color="#fff" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em" }}>QR Code Generator</h3>
                        <p style={{ fontSize: 11, color: S.textMuted }}>Generate a scan-to-chat QR for your business</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 14 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>WhatsApp Phone Number</label>
                        <input
                          style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, outline: "none" }}
                          placeholder="e.g. 919876543210 (with country code, no +)"
                          value={qrPhone}
                          onChange={e => setQrPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pre-filled Message <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                        <textarea
                          rows={3}
                          style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, color: S.textPrimary, fontFamily: S.font, resize: "none", outline: "none" }}
                          placeholder="Hi, I'm interested in your services!"
                          value={qrMessage}
                          onChange={e => setQrMessage(e.target.value)}
                        />
                      </div>

                      <button onClick={generateQr} disabled={!qrPhone.trim()}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 14, background: qrPhone.trim() ? S.greenGrad : "rgba(0,0,0,0.06)", border: "none", color: qrPhone.trim() ? "#fff" : S.textFaint, fontSize: 14, fontWeight: 800, cursor: qrPhone.trim() ? "pointer" : "not-allowed", fontFamily: S.font, boxShadow: qrPhone.trim() ? "0 8px 24px rgba(37,211,102,0.3)" : "none" }}>
                        <QrCode size={14} /> Generate QR Code
                      </button>
                    </div>

                    {qrUrl && (
                      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                        <div style={{ padding: 16, background: "#fff", borderRadius: 20, border: `2px solid ${S.greenBorder}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                            alt="WhatsApp QR Code"
                            style={{ width: 200, height: 200, display: "block" }}
                          />
                        </div>
                        <div style={{ width: "100%", display: "grid", gap: 8 }}>
                          <div style={{ padding: "10px 14px", borderRadius: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}`, fontSize: 11, color: S.greenDeep, fontFamily: S.monoFont, wordBreak: "break-all" }}>
                            {qrUrl}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={copyQrLink}
                              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 12, background: qrCopied ? S.greenGrad : "#fff", border: `1px solid ${S.greenBorder}`, color: qrCopied ? "#fff" : S.greenDark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
                              {qrCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                            </button>
                            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrUrl)}`} download="qrcode.png" target="_blank" rel="noreferrer"
                              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 12, background: S.greenBg, border: `1px solid ${S.greenBorder}`, color: S.greenDark, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: S.font }}>
                              <Download size={12} /> Download PNG
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tips Card */}
                  <div style={{ ...S.card, padding: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.textPrimary, letterSpacing: "-0.02em", marginBottom: 16 }}>How to use QR codes</h3>
                    <div style={{ display: "grid", gap: 14 }}>
                      {[
                        { icon: "🖨️", title: "Print it", desc: "Add to business cards, flyers, or in-store posters so customers can scan and chat instantly." },
                        { icon: "🌐", title: "Embed on website", desc: "Add the WhatsApp link button or QR code to your website's contact section." },
                        { icon: "📱", title: "Share on social", desc: "Post the link on Instagram bio, Facebook page, or any social profile." },
                        { icon: "📧", title: "Email signatures", desc: "Add the link to your email signature for one-click WhatsApp contact." },
                      ].map(({ icon, title, desc }) => (
                        <div key={title} style={{ display: "flex", gap: 14, padding: "14px", borderRadius: 14, background: S.greenBg, border: `1px solid ${S.greenBorder}` }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: S.textPrimary, marginBottom: 3 }}>{title}</p>
                            <p style={{ fontSize: 12, color: S.textMuted, lineHeight: 1.5 }}>{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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