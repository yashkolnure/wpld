import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const SUPERADMIN = "yash@gmail.com";
const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-4xl">📝</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#25d366] bg-emerald-50 px-2 py-1 rounded-full">
            {blog.category}
          </span>
          {blog.featured && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              ★ Featured
            </span>
          )}
        </div>
        <h3 className="font-black text-[#0f172a] text-lg leading-snug mb-2 group-hover:text-[#25d366] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
          <span>{blog.author}</span>
          <span>·</span>
          <span>{new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>·</span>
          <span>{blog.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCarousel({ featuredList }) {
  const [idx, setIdx] = useState(0);
  const total = featuredList.length;

  if (total === 0) return null;

  const prev = () => setIdx(i => (i === 0 ? total - 1 : i - 1));
  const next = () => setIdx(i => (i === total - 1 ? 0 : i + 1));
  const blog = featuredList[idx];

  return (
    <div style={{ marginBottom: 44 }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 18, borderRadius: 4, background: "#25d366", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>Featured</span>
        </div>
        {total > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={prev}
              style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#475569", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
              aria-label="Previous"
            >‹</button>
            <button
              onClick={next}
              style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#475569", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
              aria-label="Next"
            >›</button>
          </div>
        )}
      </div>

      {/* Card */}
      <div style={{ overflow: "hidden", borderRadius: 20 }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${idx * 100}%)`,
            transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {featuredList.map((b) => (
            <Link
              key={b._id}
              to={`/blog/${b.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minWidth: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                textDecoration: "none",
              }}
              className="group featured-slide"
            >
              {/* Thumbnail */}
              <div style={{ aspectRatio: "16/9", background: "#f1f5f9", overflow: "hidden", minHeight: 200 }}>
                {b.thumbnail ? (
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    className="group-hover:scale-105"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1e293b,#0f172a)" }}>
                    <span style={{ fontSize: 48 }}>📝</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#25d366", background: "rgba(37,211,102,0.08)", padding: "4px 10px", borderRadius: 100 }}>
                    {b.category}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", background: "rgba(251,191,36,0.1)", padding: "4px 10px", borderRadius: 100 }}>
                    ★ Featured
                  </span>
                </div>
                <h2
                  style={{ fontSize: "clamp(17px,2vw,22px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.3, marginBottom: 10, letterSpacing: "-0.02em", transition: "color 0.2s" }}
                  className="group-hover:text-[#25d366]"
                >
                  {b.title}
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {b.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 18 }}>
                  <span>{b.author}</span>
                  <span>·</span>
                  <span>{new Date(b.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>·</span>
                  <span>{b.readingTime} min read</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.2s" }} className="group-hover:text-[#25d366]">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dots */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {featuredList.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 100,
                background: i === idx ? "#0f172a" : "#cbd5e1",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s ease",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Blog() {
  const [blogs, setBlogs]           = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]         = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const isAdmin = localStorage.getItem("userEmail") === SUPERADMIN;

  useEffect(() => {
    axios.get(`${API}/api/blogs/categories`).then(r => setCategories(r.data)).catch(() => {});
    axios.get(`${API}/api/blogs?featured=true&limit=6`)
      .then(r => setFeaturedList(r.data.blogs || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (activeCategory === "Featured") {
      params.set("featured", "true");
    } else if (activeCategory !== "All") {
      params.set("category", activeCategory);
    }
    if (search) params.set("search", search);

    axios.get(`${API}/api/blogs?${params}`)
      .then(r => {
        setBlogs(r.data.blogs);
        setTotalPages(r.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, activeCategory, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    setSearch("");
    setSearchInput("");
  };

  return (
    <>
      <Helmet>
        <title>Blog — WPLeads | WhatsApp Automation Tips & Guides</title>
        <meta name="description" content="Expert guides, tips, and strategies for WhatsApp Business automation, chatbots, and lead generation." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes wpl-ping-blog { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes wpl-fadeup-blog { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .featured-slide { display: grid !important; }
        @media (max-width: 640px) {
          .featured-slide { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── HERO ── */}
        <section style={{
          background: "linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)",
          padding: "clamp(80px,10vw,110px) clamp(20px,5vw,60px) 50px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Grid pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", animation: "wpl-fadeup-blog 0.7s ease both" }}>

            {/* Ping-dot badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 100, padding: "5px 13px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: 1.4, color: "#16a34a", textTransform: "uppercase", marginBottom: 20 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#25d366", animation: "wpl-ping-blog 1.5s ease-in-out infinite" }} />
              WPLeads Blog
            </div>

            {/* Main heading */}
            <h1 style={{ fontSize: "clamp(30px,4.5vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#0a0a0a", marginBottom: 16 }}>
              WhatsApp Automation{" "}
              <span style={{ background: "linear-gradient(135deg,#25d366 0%,#059669 60%,#16a34a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Insights
              </span>
            </h1>

            <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 28px" }}>
              Expert guides, strategies, and case studies to grow your business with WhatsApp.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto" }}>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.12)", outline: "none", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#0f172a", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#25d366"}
                onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
              />
              <button
                type="submit"
                style={{ padding: "11px 20px", borderRadius: 12, background: "#0f172a", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                onMouseOver={e => e.currentTarget.style.background = "#1e293b"}
                onMouseOut={e => e.currentTarget.style.background = "#0f172a"}
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px clamp(16px,4vw,40px)" }}>

          {/* Featured Carousel — only on All + no search + page 1 */}
          {activeCategory === "All" && !search && page === 1 && (
            <FeaturedCarousel featuredList={featuredList} />
          )}

          {/* Category tabs row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["All", "Featured", ...categories.filter(c => c && c !== "Featured")].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: activeCategory === cat ? "none" : "1.5px solid rgba(0,0,0,0.1)",
                    background: activeCategory === cat ? "#0f172a" : "#fff",
                    color: activeCategory === cat ? "#fff" : "#475569",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {isAdmin && (
              <Link
                to="/blog-admin"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 100, background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "background 0.2s", flexShrink: 0 }}
                onMouseOver={e => e.currentTarget.style.background = "#1e293b"}
                onMouseOut={e => e.currentTarget.style.background = "#0f172a"}
              >
                ⚙️ Manage Blog
              </Link>
            )}
          </div>

          {/* Blog grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 rounded" />
                    <div className="h-5 bg-slate-100 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-slate-500 font-medium">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl border font-bold text-sm disabled:opacity-40 hover:border-[#0f172a] transition-colors"
              >
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    page === i + 1 ? "bg-[#0f172a] text-white" : "border hover:border-[#0f172a]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 rounded-xl border font-bold text-sm disabled:opacity-40 hover:border-[#0f172a] transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
