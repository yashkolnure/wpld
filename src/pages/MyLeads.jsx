import React, { useState, useEffect, useNavigate } from "react";
import axios from "axios";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Type, Mail, Phone, Hash, Activity, MessageSquare, Trash2, 
  Save, GripVertical, ExternalLink, Copy, Layout, ClipboardList, 
  ChevronRight, Search, PlusCircle, Settings2
} from "lucide-react";

const API = "";

// Brand Colors
const COLORS = {
  primary: "#16a34a", // wpleads green
  primaryHover: "#15803d",
  bg: "#f8fafc",
  border: "#e2e8f0",
  textMain: "#1e293b",
  textMuted: "#64748b"
};

const getLocalUserId = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsed = JSON.parse(userData);
    return parsed._id || parsed.id;
  }
  return localStorage.getItem("userId");
};

const FIELD_TYPES = [
  { type: "text", icon: Type, label: "Short Text", defaultLabel: "Full Name" },
  { type: "email", icon: Mail, label: "Email Address", defaultLabel: "Email" },
  { type: "tel", icon: Phone, label: "Phone Number", defaultLabel: "WhatsApp Number" },
  { type: "number", icon: Hash, label: "Number", defaultLabel: "Budget/Qty" },
  { type: "textarea", icon: MessageSquare, label: "Long Text", defaultLabel: "Requirements" },
];

/* ─── COMPONENT: Leads Table ─── */
function LeadsTable() {
  const [leads, setLeads] = useState([]);
  const userId = getLocalUserId();

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API}/api/leads?userId=${userId}`).then((res) => setLeads(res.data));
  }, [userId]);

  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: `1px solid ${COLORS.border}`, overflow: "hidden", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
      <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", color: COLORS.textMain }}>Incoming Leads</h3>
        <span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>Total: {leads.length}</span>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: COLORS.bg }}>
            <tr>
              <th style={{ padding: "12px 20px", fontSize: "13px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>CUSTOMER DATA</th>
              <th style={{ padding: "12px 20px", fontSize: "13px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>CAPTURED ON</th>
              <th style={{ padding: "12px 20px", fontSize: "13px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? leads.map((l) => (
              <tr key={l._id} style={{ borderBottom: `1px solid ${COLORS.bg}` }}>
                <td style={{ padding: "15px 20px" }}>
                  {Object.entries(l.data).map(([k, v]) => (
                    <div key={k} style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <span style={{ color: COLORS.textMuted, textTransform: "capitalize", fontWeight: 500 }}>{k}:</span> 
                      <span style={{ color: COLORS.textMain, marginLeft: "8px" }}>{v}</span>
                    </div>
                  ))}
                </td>
                <td style={{ padding: "15px 20px", fontSize: "14px", color: COLORS.textMain }}>
                  {new Date(l.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </td>
                <td style={{ padding: "15px 20px", textAlign: "right" }}>
                  <button style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer" }}><ChevronRight size={18}/></button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted }}>No leads captured yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── COMPONENT: Sortable Field Item ─── */
function SortableItem({ field, isSelected, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isSelected ? "#f0fdf4" : "#fff",
    border: isSelected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: isSelected ? "0 4px 12px rgba(22, 163, 74, 0.1)" : "none"
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelect(field)}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#cbd5e1" }}><GripVertical size={20} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "14px", color: COLORS.textMain }}>{field.label}</div>
        <div style={{ fontSize: "12px", color: COLORS.textMuted }}>{field.placeholder || "No placeholder set"}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onRemove(field.id); }} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: "5px" }}><Trash2 size={16} /></button>
    </div>
  );
}

/* ─── COMPONENT: Form Builder ─── */
function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formTitle, setFormTitle] = useState("My Lead Form");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const userId = getLocalUserId();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API}/api/leads/config?userId=${userId}`).then((res) => {
      if (res.data.fields) setFields(res.data.fields);
      if (res.data.formTitle) setFormTitle(res.data.formTitle);
      if (res.data.slug) setSlug(res.data.slug);
    });
  }, [userId]);

  const addField = (t) => {
    const newF = { id: Date.now().toString(), type: t.type, label: t.defaultLabel, placeholder: "Enter " + t.defaultLabel, required: false };
    setFields([...fields, newF]);
    setSelected(newF);
  };

  const handleLivePreview = () => {
    if (!slug) return alert("Please set a URL slug first!");
    window.open(`${window.location.origin}/${slug}`, "_blank");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/leads/config`, { fields, formTitle, slug, userId });
      alert("Config Saved!");
    } catch (e) { alert("Save failed"); }
    setSaving(false);
  };

  return (
    <div className="builder-grid">
      <style>{`
        .builder-grid {
            display: grid;
            grid-template-columns: 260px 1fr 300px;
            gap: 24px;
            min-height: 80vh;
        }
        @media (max-width: 1024px) {
            .builder-grid {
                grid-template-columns: 1fr;
            }
            .order-mobile-1 { order: 1; }
            .order-mobile-2 { order: 2; }
            .order-mobile-3 { order: 3; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Left: Palette */}
      <div className="order-mobile-2" style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${COLORS.border}`, alignSelf: "start" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textMuted, marginBottom: "16px", letterSpacing: "0.05em" }}>FIELD ELEMENTS</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            {FIELD_TYPES.map((t) => (
            <button key={t.type} onClick={() => addField(t)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 500, color: COLORS.textMain, transition: "0.2s" }} onMouseOver={(e)=>e.currentTarget.style.borderColor = COLORS.primary} onMouseOut={(e)=>e.currentTarget.style.borderColor = COLORS.border}>
                <div style={{ color: COLORS.primary }}><t.icon size={16} /></div> {t.label}
            </button>
            ))}
        </div>
      </div>

      {/* Middle: Canvas */}
      <div className="order-mobile-3" style={{ overflowY: "auto" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: `1px solid ${COLORS.border}`, marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ fontSize: "22px", fontWeight: 700, border: "none", outline: "none", width: "100%", color: COLORS.textMain }} placeholder="Untitled Form" />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
          if (active.id !== over.id) {
            setFields((items) => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id)));
          }
        }}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((f) => (
              <SortableItem key={f.id} field={f} isSelected={selected?.id === f.id} onSelect={setSelected} onRemove={(id) => setFields(fields.filter(x => x.id !== id))} />
            ))}
          </SortableContext>
        </DndContext>
        
        {fields.length === 0 && <div style={{ padding: "60px 20px", textAlign: "center", border: `2px dashed ${COLORS.border}`, borderRadius: "12px", color: COLORS.textMuted, background: "#fff" }}>
            <PlusCircle size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p>Your form is empty. Click a field on the left to start.</p>
        </div>}
      </div>

      {/* Right: Inspector - MOVES TO TOP ON MOBILE IF SELECTED */}
      <div className="order-mobile-1" style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${COLORS.border}`, alignSelf: "start", position: "sticky", top: "20px" }}>
        {selected ? (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <Settings2 size={16} color={COLORS.primary} />
                <p style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textMuted, margin: 0 }}>FIELD PROPERTIES</p>
            </div>
            
            <label style={{ fontSize: "12px", fontWeight: 600, color: COLORS.textMain }}>Label Name</label>
            <input value={selected.label} onChange={(e) => {
              const val = e.target.value;
              setFields(fields.map(f => f.id === selected.id ? { ...f, label: val } : f));
              setSelected({ ...selected, label: val });
            }} style={{ width: "100%", padding: "10px", marginTop: "6px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${COLORS.border}`, boxSizing: "border-box" }} />

            <label style={{ fontSize: "12px", fontWeight: 600, color: COLORS.textMain }}>Placeholder Text</label>
            <input value={selected.placeholder} onChange={(e) => {
              const val = e.target.value;
              setFields(fields.map(f => f.id === selected.id ? { ...f, placeholder: val } : f));
              setSelected({ ...selected, placeholder: val });
            }} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: `1px solid ${COLORS.border}`, boxSizing: "border-box" }} />
            
            <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "20px 0" }} />
          </div>
        ) : null}

        <p style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textMuted, marginBottom: "15px" }}>PUBLISH SETTINGS</p>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>Slug URL</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "6px" }}>
            <span style={{ background: COLORS.bg, padding: "10px", border: `1px solid ${COLORS.border}`, borderRight: "none", borderRadius: "6px 0 0 6px", fontSize: "12px", color: COLORS.textMuted }}>/</span>
            <input 
              value={slug} 
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} 
              style={{ flex: 1, padding: "10px", borderRadius: "0 6px 6px 0", border: `1px solid ${COLORS.border}`, fontSize: "13px", width: "100%" }} 
              placeholder="my-form" 
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={handleLivePreview} disabled={!slug} style={{ width: "100%", padding: "10px", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: COLORS.textMain }}>
            <ExternalLink size={14} /> Preview Form
          </button>
          
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${slug}`); alert("Copied!"); }} disabled={!slug} style={{ width: "100%", padding: "10px", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: COLORS.textMain }}>
            <Copy size={14} /> Copy Link
          </button>

          <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "12px", marginTop: "10px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }}>
            {saving ? <Activity size={16} className="spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Config"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT COMPONENT ─── */
export default function MyLeads() {
  const [tab, setTab] = useState("builder");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Ensure you're using react-router-dom

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API}/api/user/me`, { headers })
      .then(r => {
        setUser(r.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Verifying Session...</div>;

  // Pass the user._id down to components
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", padding: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ... Header Code ... */}
        
        {tab === "builder" 
          ? <FormBuilder userId={user._id || user.id} /> 
          : <LeadsTable userId={user._id || user.id} />
        }
      </div>
    </div>
  );
}