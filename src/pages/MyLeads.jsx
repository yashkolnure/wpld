import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Type, Mail, Phone, Hash, Activity, MessageSquare, Trash2, 
  Save, GripVertical, ExternalLink, Copy, Layout, ClipboardList, 
  ChevronRight, Search, PlusCircle, Settings2, Zap, Users, TrendingUp,
  Calendar, Download, Eye, BarChart3, MessageCircle
} from "lucide-react";

const API = "";

// WhatsApp-inspired color scheme for wpleads.in
const COLORS = {
  primary: "#25D366",        // WhatsApp green
  primaryHover: "#20BA5A",
  primaryLight: "#E8F8F0",
  secondary: "#128C7E",      // Dark teal
  accent: "#34B7F1",         // Light blue accent
  bg: "#F0F2F5",            // Light gray background
  cardBg: "#FFFFFF",
  border: "#E4E6EB",
  textMain: "#1C1E21",
  textMuted: "#65676B",
  success: "#25D366",
  warning: "#FFA033",
  danger: "#DC2626",
  gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
};

const FIELD_TYPES = [
  { type: "text", icon: Type, label: "Short Text", defaultLabel: "Full Name", color: "#8B5CF6" },
  { type: "email", icon: Mail, label: "Email Address", defaultLabel: "Email", color: "#3B82F6" },
  { type: "tel", icon: Phone, label: "Phone Number", defaultLabel: "WhatsApp Number", color: "#25D366" },
  { type: "number", icon: Hash, label: "Number", defaultLabel: "Budget/Qty", color: "#F59E0B" },
  { type: "textarea", icon: MessageSquare, label: "Long Text", defaultLabel: "Requirements", color: "#EC4899" },
];

/* ─── COMPONENT: Stats Card ─── */
function StatsCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div style={{
      background: COLORS.cardBg,
      borderRadius: "16px",
      padding: "24px",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "all 0.3s ease",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Icon size={24} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500, marginBottom: "4px" }}>{label}</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.textMain }}>{value}</div>
        </div>
      </div>
      {trend && (
        <div style={{ fontSize: "12px", color: COLORS.success, fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
          <TrendingUp size={14} /> {trend}
        </div>
      )}
    </div>
  );
}

/* ─── COMPONENT: Leads Table ─── */
function LeadsTable({ userId }) {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API}/api/leads?userId=${userId}`).then((res) => setLeads(res.data));
  }, [userId]);

  const filteredLeads = leads.filter(lead => 
    Object.values(lead.data).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      {/* Stats Row */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "20px", 
        marginBottom: "32px" 
      }}>
        <StatsCard icon={Users} label="Total Leads" value={leads.length} trend="+12% this week" color={COLORS.primary} />
        <StatsCard icon={TrendingUp} label="Conversion Rate" value="24%" trend="+5% increase" color={COLORS.accent} />
        <StatsCard icon={MessageCircle} label="Active Chats" value="48" color={COLORS.secondary} />
      </div>

      {/* Leads Table */}
      <div style={{ 
        background: COLORS.cardBg, 
        borderRadius: "16px", 
        border: `1px solid ${COLORS.border}`, 
        overflow: "hidden", 
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)" 
      }}>
        <div style={{ 
          padding: "24px", 
          borderBottom: `1px solid ${COLORS.border}`, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: COLORS.textMain }}>
              Incoming Leads
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: COLORS.textMuted }}>
              Track and manage your form submissions
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ 
              position: "relative", 
              minWidth: "250px",
              maxWidth: "350px"
            }}>
              <Search size={18} style={{ 
                position: "absolute", 
                left: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: COLORS.textMuted 
              }} />
              <input 
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: "100%",
                  padding: "10px 12px 10px 42px", 
                  borderRadius: "10px", 
                  border: `1px solid ${COLORS.border}`, 
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>
    
          </div>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: COLORS.bg }}>
              <tr>
                <th style={{ 
                  padding: "16px 24px", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  color: COLORS.textMuted, 
                  borderBottom: `1px solid ${COLORS.border}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>Customer Data</th>
                <th style={{ 
                  padding: "16px 24px", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  color: COLORS.textMuted, 
                  borderBottom: `1px solid ${COLORS.border}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>Captured On</th>
                <th style={{ 
                  padding: "16px 24px", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  color: COLORS.textMuted, 
                  borderBottom: `1px solid ${COLORS.border}`, 
                  textAlign: "right",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? filteredLeads.map((l, idx) => (
                <tr key={l._id} style={{ 
                  borderBottom: `1px solid ${COLORS.bg}`,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryLight}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "20px 24px" }}>
                    {Object.entries(l.data).map(([k, v]) => (
                      <div key={k} style={{ fontSize: "14px", marginBottom: "6px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ 
                          color: COLORS.textMuted, 
                          textTransform: "capitalize", 
                          fontWeight: 600,
                          minWidth: "120px"
                        }}>{k}:</span> 
                        <span style={{ color: COLORS.textMain, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={16} color={COLORS.textMuted} />
                      <span style={{ fontSize: "14px", color: COLORS.textMain, fontWeight: 500 }}>
                        {new Date(l.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button style={{ 
                      background: COLORS.primaryLight, 
                      border: "none", 
                      color: COLORS.primary, 
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      fontWeight: 600,
                      transition: "all 0.2s"
                    }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primaryLight; e.currentTarget.style.color = COLORS.primary; }}>
                      View <ChevronRight size={16}/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ padding: "60px", textAlign: "center" }}>
                    <ClipboardList size={48} color={COLORS.textMuted} style={{ opacity: 0.3, marginBottom: "16px" }} />
                    <p style={{ color: COLORS.textMuted, fontSize: "16px", margin: 0 }}>
                      {searchTerm ? "No leads match your search." : "No leads captured yet."}
                    </p>
                    {!searchTerm && (
                      <p style={{ color: COLORS.textMuted, fontSize: "14px", margin: "8px 0 0" }}>
                        Build your form and start capturing leads!
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPONENT: Sortable Field Item ─── */
function SortableItem({ field, isSelected, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const fieldType = FIELD_TYPES.find(t => t.type === field.type);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isSelected ? COLORS.primaryLight : COLORS.cardBg,
    border: isSelected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    boxShadow: isSelected ? `0 4px 12px ${COLORS.primary}30` : "0 2px 4px rgba(0,0,0,0.04)"
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelect(field)}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: COLORS.textMuted }}>
        <GripVertical size={20} />
      </div>
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: `${fieldType?.color || COLORS.primary}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {fieldType && <fieldType.icon size={20} color={fieldType.color} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "15px", color: COLORS.textMain, marginBottom: "2px" }}>
          {field.label}
        </div>
        <div style={{ fontSize: "13px", color: COLORS.textMuted }}>
          {field.placeholder || "No placeholder set"}
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(field.id); }} 
        style={{ 
          border: 'none', 
          background: '#FEE2E2', 
          color: COLORS.danger, 
          cursor: 'pointer', 
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s"
        }}
        // Change this:
onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.danger; e.currentTarget.style.color = "#fff"; }}
onMouseLeave={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = COLORS.danger; }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

/* ─── COMPONENT: Form Builder ─── */
function FormBuilder({ userId }) {
  const [fields, setFields] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formTitle, setFormTitle] = useState("My Lead Form");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

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
    const newF = { 
      id: Date.now().toString(), 
      type: t.type, 
      label: t.defaultLabel, 
      placeholder: "Enter " + t.defaultLabel, 
      required: false 
    };
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
      const token = localStorage.getItem("token");
      await axios.post(`${API}/api/leads/config`, 
        { fields, formTitle, slug, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Config Saved!");
    } catch (e) { alert("Save failed"); }
    setSaving(false);
  };

  return (
    <div className="builder-grid">
      <style>{`
      .btn-action-view:hover {
  background: ${COLORS.primary} !important;
  color: #fff !important;
}

.btn-danger-trash:hover {
  background: ${COLORS.danger} !important;
  color: #fff !important;
}
        .builder-grid { 
          display: grid; 
          grid-template-columns: 280px 1fr 320px; 
          gap: 24px; 
          min-height: 80vh; 
        }
        @media (max-width: 1200px) { 
          .builder-grid { 
            grid-template-columns: 260px 1fr 300px; 
            gap: 20px; 
          } 
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
      <div className="order-mobile-2" style={{ 
        background: COLORS.cardBg, 
        padding: "24px", 
        borderRadius: "16px", 
        border: `1px solid ${COLORS.border}`, 
        alignSelf: "start",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          marginBottom: "20px" 
        }}>
          <Zap size={18} color={COLORS.primary} />
          <p style={{ 
            fontSize: "12px", 
            fontWeight: 700, 
            color: COLORS.textMuted, 
            margin: 0,
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}>Field Elements</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
          {FIELD_TYPES.map((t) => (
            <button 
              key={t.type} 
              onClick={() => addField(t)} 
              style={{ 
                width: "100%", 
                padding: "14px", 
                borderRadius: "10px", 
                border: `1px solid ${COLORS.border}`, 
                background: COLORS.cardBg, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                fontSize: "14px", 
                fontWeight: 600, 
                color: COLORS.textMain, 
                transition: "all 0.2s"
              }} 
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = t.color;
                e.currentTarget.style.background = `${t.color}08`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.background = COLORS.cardBg;
              }}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px", 
                background: `${t.color}15`, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <t.icon size={16} color={t.color} />
              </div>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Canvas */}
      <div className="order-mobile-3" style={{ overflowY: "auto" }}>
        <div style={{ 
          background: COLORS.cardBg, 
          padding: "28px", 
          borderRadius: "16px", 
          border: `1px solid ${COLORS.border}`, 
          marginBottom: "20px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)" 
        }}>
          <input 
            value={formTitle} 
            onChange={(e) => setFormTitle(e.target.value)} 
            style={{ 
              fontSize: "24px", 
              fontWeight: 700, 
              border: "none", 
              outline: "none", 
              width: "100%", 
              color: COLORS.textMain,
              background: "transparent"
            }} 
            placeholder="Untitled Form" 
          />
          <div style={{ 
            fontSize: "14px", 
            color: COLORS.textMuted, 
            marginTop: "8px" 
          }}>
            Drag and drop fields below to customize your form
          </div>
        </div>

        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={({ active, over }) => {
            if (active.id !== over.id) {
              setFields((items) => arrayMove(
                items, 
                items.findIndex(i => i.id === active.id), 
                items.findIndex(i => i.id === over.id)
              ));
            }
          }}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((f) => (
              <SortableItem 
                key={f.id} 
                field={f} 
                isSelected={selected?.id === f.id} 
                onSelect={setSelected} 
                onRemove={(id) => {
                  setFields(fields.filter(x => x.id !== id));
                  if (selected?.id === id) setSelected(null);
                }} 
              />
            ))}
          </SortableContext>
        </DndContext>
        
        {fields.length === 0 && (
          <div style={{ 
            padding: "80px 20px", 
            textAlign: "center", 
            border: `2px dashed ${COLORS.border}`, 
            borderRadius: "16px", 
            color: COLORS.textMuted, 
            background: COLORS.cardBg 
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              background: COLORS.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <PlusCircle size={32} color={COLORS.primary} />
            </div>
            <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 8px", color: COLORS.textMain }}>
              Start Building Your Form
            </p>
            <p style={{ fontSize: "14px", margin: 0 }}>
              Click a field element on the left to add it to your form
            </p>
          </div>
        )}
      </div>

      {/* Right: Inspector */}
      <div className="order-mobile-1" style={{ 
        background: COLORS.cardBg, 
        padding: "24px", 
        borderRadius: "16px", 
        border: `1px solid ${COLORS.border}`, 
        alignSelf: "start", 
        position: "sticky", 
        top: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        {selected ? (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: `2px solid ${COLORS.bg}`
            }}>
              <Settings2 size={18} color={COLORS.primary} />
              <p style={{ 
                fontSize: "12px", 
                fontWeight: 700, 
                color: COLORS.textMuted, 
                margin: 0,
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>Field Properties</p>
            </div>
            
            <label style={{ 
              fontSize: "13px", 
              fontWeight: 600, 
              color: COLORS.textMain, 
              display: "block", 
              marginBottom: "8px" 
            }}>Label Name</label>
            <input 
              value={selected.label} 
              onChange={(e) => {
                const val = e.target.value;
                setFields(fields.map(f => f.id === selected.id ? { ...f, label: val } : f));
                setSelected({ ...selected, label: val });
              }} 
              style={{ 
                width: "100%", 
                padding: "12px", 
                marginBottom: "20px", 
                borderRadius: "8px", 
                border: `1px solid ${COLORS.border}`, 
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
            
            <label style={{ 
              fontSize: "13px", 
              fontWeight: 600, 
              color: COLORS.textMain, 
              display: "block", 
              marginBottom: "8px" 
            }}>Placeholder Text</label>
            <input 
              value={selected.placeholder} 
              onChange={(e) => {
                const val = e.target.value;
                setFields(fields.map(f => f.id === selected.id ? { ...f, placeholder: val } : f));
                setSelected({ ...selected, placeholder: val });
              }} 
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "8px", 
                border: `1px solid ${COLORS.border}`, 
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>
        ) : (
          <div style={{ 
            padding: "32px 16px", 
            textAlign: "center", 
            color: COLORS.textMuted,
            marginBottom: "24px"
          }}>
            <Settings2 size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
            <p style={{ fontSize: "14px", margin: 0 }}>
              Select a field to edit its properties
            </p>
          </div>
        )}

        <div style={{ 
          paddingTop: "24px", 
          borderTop: `2px solid ${COLORS.bg}` 
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            marginBottom: "20px" 
          }}>
            <ExternalLink size={18} color={COLORS.primary} />
            <p style={{ 
              fontSize: "12px", 
              fontWeight: 700, 
              color: COLORS.textMuted, 
              margin: 0,
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}>Publish Settings</p>
          </div>
          
          <label style={{ 
            fontSize: "13px", 
            fontWeight: 600, 
            color: COLORS.textMain, 
            display: "block", 
            marginBottom: "8px" 
          }}>Form URL Slug</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "20px" }}>
            <span style={{ 
              background: COLORS.bg, 
              padding: "12px", 
              border: `1px solid ${COLORS.border}`, 
              borderRight: "none", 
              borderRadius: "8px 0 0 8px", 
              fontSize: "13px", 
              color: COLORS.textMuted,
              fontWeight: 600
            }}>/</span>
            <input 
              value={slug} 
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} 
              style={{ 
                flex: 1, 
                padding: "12px", 
                borderRadius: "0 8px 8px 0", 
                border: `1px solid ${COLORS.border}`, 
                fontSize: "14px", 
                width: "100%",
                outline: "none",
                transition: "all 0.2s"
              }} 
              placeholder="my-form"
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button 
              onClick={handleLivePreview} 
              disabled={!slug} 
              style={{ 
                width: "100%", 
                padding: "12px", 
                background: COLORS.cardBg, 
                border: `1px solid ${COLORS.border}`, 
                borderRadius: "10px", 
                fontSize: "14px", 
                fontWeight: 600, 
                cursor: slug ? "pointer" : "not-allowed", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px", 
                color: COLORS.textMain,
                opacity: slug ? 1 : 0.5,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => slug && (e.currentTarget.style.borderColor = COLORS.primary)}
              onMouseLeave={(e) => slug && (e.currentTarget.style.borderColor = COLORS.border)}>
              <Eye size={16} /> Preview Form
            </button>
            
            <button 
              onClick={() => { 
                navigator.clipboard.writeText(`${window.location.origin}/${slug}`); 
                alert("Link copied to clipboard!"); 
              }} 
              disabled={!slug} 
              style={{ 
                width: "100%", 
                padding: "12px", 
                background: COLORS.cardBg, 
                border: `1px solid ${COLORS.border}`, 
                borderRadius: "10px", 
                fontSize: "14px", 
                fontWeight: 600, 
                cursor: slug ? "pointer" : "not-allowed", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px", 
                color: COLORS.textMain,
                opacity: slug ? 1 : 0.5,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => slug && (e.currentTarget.style.borderColor = COLORS.primary)}
              onMouseLeave={(e) => slug && (e.currentTarget.style.borderColor = COLORS.border)}>
              <Copy size={16} /> Copy Link
            </button>
            
            <button 
              onClick={handleSave} 
              disabled={saving} 
              style={{ 
                width: "100%", 
                padding: "14px", 
                marginTop: "12px", 
                background: COLORS.gradient, 
                color: "#fff", 
                border: "none", 
                borderRadius: "10px", 
                fontWeight: 700, 
                cursor: saving ? "not-allowed" : "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px", 
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                fontSize: "15px"
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.transform = "translateY(-2px)", e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 211, 102, 0.4)")}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.3)")}>
              {saving ? <Activity size={18} className="spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT COMPONENT ─── */
export default function MyLeads() {
  const [tab, setTab] = useState("leads");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

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

  if (loading) {
    return (
      <div style={{ 
        padding: "100px 20px", 
        textAlign: "center",
        background: COLORS.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div>
          <Activity size={48} color={COLORS.primary} className="spin" style={{ marginBottom: "20px" }} />
          <p style={{ color: COLORS.textMuted, fontSize: "16px" }}>Verifying Session...</p>
        </div>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const activeUserId = user?._id || user?.id;

  return (
    <div style={{ 
      background: COLORS.bg, 
      minHeight: "100vh", 
      padding: "24px", 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "20px" 
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "32px", 
              fontWeight: 800, 
              color: COLORS.textMain,
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: COLORS.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <MessageCircle size={28} color="#fff" />
              </div>
              wpleads <span style={{ 
                background: COLORS.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Forms</span>
            </h1>
            <p style={{ 
              margin: "8px 0 0", 
              fontSize: "15px", 
              color: COLORS.textMuted,
              paddingLeft: "60px"
            }}>
              Build powerful lead capture forms for WhatsApp
            </p>
          </div>

          <div style={{ 
            background: COLORS.cardBg, 
            padding: "6px", 
            borderRadius: "12px", 
            border: `1px solid ${COLORS.border}`, 
            display: "flex", 
            gap: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <button 
              onClick={() => setTab("builder")} 
              style={{ 
                padding: "10px 20px", 
                borderRadius: "10px", 
                border: "none", 
                background: tab === "builder" ? COLORS.gradient : "transparent", 
                color: tab === "builder" ? "#fff" : COLORS.textMuted, 
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: "14px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                transition: "all 0.3s",
                boxShadow: tab === "builder" ? "0 2px 8px rgba(37, 211, 102, 0.3)" : "none"
              }}>
              <Layout size={18} /> Builder
            </button>
            <button 
              onClick={() => setTab("leads")} 
              style={{ 
                padding: "10px 20px", 
                borderRadius: "10px", 
                border: "none", 
                background: tab === "leads" ? COLORS.gradient : "transparent", 
                color: tab === "leads" ? "#fff" : COLORS.textMuted, 
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: "14px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                transition: "all 0.3s",
                boxShadow: tab === "leads" ? "0 2px 8px rgba(37, 211, 102, 0.3)" : "none"
              }}>
              <ClipboardList size={18} /> Leads
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === "builder" 
          ? <FormBuilder userId={activeUserId} /> 
          : <LeadsTable userId={activeUserId} />
        }
      </div>
    </div>
  );
}