import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const SUPERADMIN = "yash@gmail.com";

const API = process.env.REACT_APP_API_URL || "http://localhost:5005";

function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
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

function FeaturedCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 mb-10"
    >
      <div className="aspect-[16/9] md:aspect-auto bg-slate-100 overflow-hidden">
        {blog.thumbnail ? (
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-6xl">📝</span>
          </div>
        )}
      </div>
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#25d366] bg-emerald-50 px-2 py-1 rounded-full">
            {blog.category}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            ★ Featured
          </span>
        </div>
        <h2 className="font-black text-[#0f172a] text-2xl md:text-3xl leading-snug mb-3 group-hover:text-[#25d366] transition-colors">
          {blog.title}
        </h2>
        <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
          <span>{blog.author}</span>
          <span>·</span>
          <span>{new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>·</span>
          <span>{blog.readingTime} min read</span>
        </div>
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#0f172a] group-hover:text-[#25d366] transition-colors">
          Read article →
        </span>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [blogs, setBlogs]           = useState([]);
  const [featured, setFeatured]     = useState(null);
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
    axios.get(`${API}/api/blogs?featured=true&limit=1`)
      .then(r => setFeatured(r.data.blogs[0] || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (activeCategory !== "All") params.set("category", activeCategory);
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

      <div className="min-h-screen bg-[#fcfcfd] font-sans">
        {/* Hero */}
        <div className="bg-[#0f172a] pt-24 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-[#25d366] uppercase mb-6">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              WhatsApp Automation <span className="text-[#25d366]">Insights</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Expert guides, strategies, and case studies to grow your business with WhatsApp.
            </p>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 outline-none focus:border-[#25d366] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#25d366] text-white font-bold hover:bg-emerald-500 transition-colors"
              >
                Search
              </button>
            </form>
            {/* Admin button — only visible to superadmin */}
            {isAdmin && (
              <div className="mt-4">
                <Link
                  to="/blog-admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  ⚙️ Manage Blog
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0f172a] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-[#0f172a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured blog (only on All + no search) */}
          {featured && activeCategory === "All" && !search && page === 1 && (
            <FeaturedCard blog={featured} />
          )}

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
                    page === i + 1
                      ? "bg-[#0f172a] text-white"
                      : "border hover:border-[#0f172a]"
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
