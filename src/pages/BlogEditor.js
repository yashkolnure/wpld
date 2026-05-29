import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

const toSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const calcReadingTime = (html) => {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const TOOLBAR_ITEMS = [
  { label: "B",      tag: "strong",     title: "Bold"       },
  { label: "I",      tag: "em",         title: "Italic"     },
  { label: "H1",     tag: "h1",         title: "Heading 1"  },
  { label: "H2",     tag: "h2",         title: "Heading 2"  },
  { label: "H3",     tag: "h3",         title: "Heading 3"  },
  { label: "P",      tag: "p",          title: "Paragraph"  },
  { label: "UL",     tag: "ul/li",      title: "Bullet list"},
  { label: "OL",     tag: "ol/li",      title: "Numbered list"},
  { label: "Code",   tag: "code",       title: "Inline code"},
  { label: "Pre",    tag: "pre",        title: "Code block" },
  { label: "HR",     tag: "hr",         title: "Divider"    },
  { label: "IMG",    tag: "img",        title: "Image"      },
];

function insertTag(textarea, tag, setContent) {
  const start  = textarea.selectionStart;
  const end    = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  let replacement = "";

  if (tag === "ul/li")  replacement = `<ul>\n  <li>${selected || "Item 1"}</li>\n  <li>Item 2</li>\n</ul>`;
  else if (tag === "ol/li") replacement = `<ol>\n  <li>${selected || "Item 1"}</li>\n  <li>Item 2</li>\n</ol>`;
  else if (tag === "hr")    replacement = `<hr />\n`;
  else if (tag === "pre")   replacement = `<pre><code>${selected || "code here"}</code></pre>`;
  else if (tag === "img")   replacement = `<img src="${selected || 'https://...'}" alt="description" style="width:100%;border-radius:12px;margin:16px 0" />`;
  else replacement = `<${tag}>${selected}</${tag}>`;

  const newVal = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  setContent(newVal);

  // Restore focus
  setTimeout(() => {
    textarea.focus();
    const newCursor = start + replacement.length;
    textarea.setSelectionRange(newCursor, newCursor);
  }, 0);
}

const EMPTY = {
  title: "", slug: "", content: "", excerpt: "", thumbnail: "",
  author: "WPLeads Team", category: "", tags: "",
  status: "draft", featured: false,
  metaTitle: "", metaDescription: "", metaKeywords: "",
};

export default function BlogEditor() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = Boolean(id);

  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [preview, setPreview] = useState(false);
  const token = localStorage.getItem("token");

  // Load blog for editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    axios.get(`${API}/api/blogs/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        const b = r.data;
        setForm({
          ...EMPTY,
          ...b,
          tags:            (b.tags || []).join(", "),
          metaTitle:       b.metaTitle       || "",
          metaDescription: b.metaDescription || "",
          metaKeywords:    b.metaKeywords    || "",
          excerpt:         b.excerpt         || "",
          thumbnail:       b.thumbnail       || "",
          category:        b.category        || "",
        });
        setSlugManual(true);
      })
      .catch(() => alert("Failed to load blog."))
      .finally(() => setLoading(false));
  }, [id, isEdit, token]);

  // Auto-generate slug from title
  const set = useCallback((key, val) => {
    setForm(prev => {
      const updated = { ...prev, [key]: val };
      if (key === "title" && !slugManual) {
        updated.slug = toSlug(val);
      }
      return updated;
    });
  }, [slugManual]);

  const save = async (publish = false) => {
    if (!form.title.trim()) return alert("Title is required.");
    if (!form.content.trim()) return alert("Content is required.");

    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: publish ? "published" : form.status,
    };

    try {
      if (isEdit) {
        await axios.put(`${API}/api/blogs/admin/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/api/blogs/admin`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/blog-admin");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-400 font-medium">Loading blog...</p>
      </div>
    );
  }

  const readingTime = calcReadingTime(form.content);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <div className="bg-[#0f172a] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/blog-admin" className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
          <h1 className="text-white font-black">{isEdit ? "Edit Post" : "New Post"}</h1>
          <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded-full">{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(p => !p)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors"
          >
            {preview ? "✏ Edit" : "👁 Preview"}
          </button>
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
          >
            {saving ? "Publishing..." : "Publish →"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* ── Left: Main content ── */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Post title..."
              value={form.title}
              onChange={e => set("title", e.target.value)}
              className="w-full text-3xl font-black text-[#0f172a] bg-transparent border-0 border-b-2 border-slate-200 focus:border-[#25d366] outline-none pb-3 placeholder-slate-200 transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Slug:</span>
            <span className="text-slate-400">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugManual(true); set("slug", toSlug(e.target.value)); }}
              className="flex-1 bg-slate-100 rounded-lg px-3 py-1.5 font-mono text-sm text-slate-700 outline-none focus:ring-2 ring-[#25d366]/20"
            />
            <button
              onClick={() => { setSlugManual(false); set("slug", toSlug(form.title)); }}
              className="text-xs text-slate-400 hover:text-[#25d366] transition-colors"
            >
              ↺ Regenerate
            </button>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Excerpt (shown in blog list)</label>
            <textarea
              rows={2}
              placeholder="Short description of this post..."
              value={form.excerpt}
              onChange={e => set("excerpt", e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 outline-none focus:border-[#25d366] transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content (HTML)</label>
              <span className="text-xs text-slate-400">{form.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length} words</span>
            </div>

            {/* Toolbar */}
            {!preview && (
              <div className="flex flex-wrap gap-1 mb-2">
                {TOOLBAR_ITEMS.map(item => (
                  <button
                    key={item.tag}
                    title={item.title}
                    type="button"
                    onClick={() => {
                      const ta = document.getElementById("blog-content-textarea");
                      if (ta) insertTag(ta, item.tag, (v) => set("content", v));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[#25d366] hover:text-[#25d366] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {preview ? (
              <div
                className="blog-content prose min-h-[400px] bg-white border border-slate-200 rounded-xl p-6"
                dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-slate-300'>Nothing to preview yet...</p>" }}
              />
            ) : (
              <textarea
                id="blog-content-textarea"
                rows={22}
                placeholder={`<h2>Introduction</h2>\n<p>Start writing your blog post here...</p>`}
                value={form.content}
                onChange={e => set("content", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-mono text-sm outline-none focus:border-[#25d366] transition-colors resize-y"
              />
            )}
          </div>
        </div>

        {/* ── Right: Settings sidebar ── */}
        <div className="space-y-5">
          {/* Publish status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-black text-[#0f172a] mb-4">Publish</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={form.status === "draft"}
                  onChange={() => set("status", "draft")}
                  className="accent-[#25d366]"
                />
                <div>
                  <p className="font-bold text-sm text-slate-700">Draft</p>
                  <p className="text-xs text-slate-400">Not visible to readers</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={form.status === "published"}
                  onChange={() => set("status", "published")}
                  className="accent-[#25d366]"
                />
                <div>
                  <p className="font-bold text-sm text-slate-700">Published</p>
                  <p className="text-xs text-slate-400">Live and indexable</p>
                </div>
              </label>
            </div>
            <label className="flex items-center gap-3 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set("featured", e.target.checked)}
                className="w-4 h-4 rounded accent-[#25d366]"
              />
              <span className="text-sm font-bold text-slate-700">★ Featured post</span>
            </label>
          </div>

          {/* Post details */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-[#0f172a]">Post Details</h3>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thumbnail URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.thumbnail}
                onChange={e => set("thumbnail", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="thumbnail preview" className="mt-2 rounded-lg w-full aspect-video object-cover" onError={e => e.target.style.display = "none"} />
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={e => set("author", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <input
                type="text"
                placeholder="e.g. WhatsApp Tips"
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="whatsapp, automation, crm"
                value={form.tags}
                onChange={e => set("tags", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-[#0f172a]">SEO</h3>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Meta Title <span className={`ml-1 ${(form.metaTitle || form.title).length > 60 ? "text-red-400" : "text-slate-300"}`}>
                  {(form.metaTitle || form.title).length}/60
                </span>
              </label>
              <input
                type="text"
                placeholder={form.title || "SEO title..."}
                value={form.metaTitle}
                onChange={e => set("metaTitle", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Meta Description <span className={`ml-1 ${(form.metaDescription).length > 160 ? "text-red-400" : "text-slate-300"}`}>
                  {form.metaDescription.length}/160
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Description for search engines..."
                value={form.metaDescription}
                onChange={e => set("metaDescription", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keywords</label>
              <input
                type="text"
                placeholder="whatsapp automation, chatbot..."
                value={form.metaKeywords}
                onChange={e => set("metaKeywords", e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-[#25d366] transition-colors"
              />
            </div>
            {/* SERP preview */}
            {(form.metaTitle || form.title) && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">SERP Preview</p>
                <p className="text-[#1a0dab] text-sm font-medium leading-tight">{form.metaTitle || form.title}</p>
                <p className="text-[#006621] text-xs mt-0.5">wpleads.in/blog/{form.slug || "your-slug"}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{form.metaDescription || form.excerpt || "No description yet."}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
