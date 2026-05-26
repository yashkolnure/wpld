import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

const ADMIN_PASSWORD = "yash1234";
const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}

export default function BlogAdmin() {
  const [inputPass, setInputPass] = useState("");
  const [isUnlocked, setIsUnlocked]  = useState(false);
  const [blogs, setBlogs]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/blogs/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch {
      alert("Failed to load blogs. Make sure you are logged in as superadmin.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputPass === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      fetchBlogs();
    } else {
      alert("Wrong password.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActionId(id);
    try {
      await axios.delete(`${API}/api/blogs/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleToggleStatus = async (id) => {
    setActionId(id);
    try {
      const res = await axios.patch(`${API}/api/blogs/admin/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: res.data.status } : b));
    } catch {
      alert("Failed to toggle status.");
    } finally {
      setActionId(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    setActionId(id);
    try {
      const res = await axios.patch(`${API}/api/blogs/admin/${id}/toggle-featured`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, featured: res.data.featured } : b));
    } catch {
      alert("Failed to toggle featured.");
    } finally {
      setActionId(null);
    }
  };

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <form onSubmit={handleUnlock} className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center">
          <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock size={20} color="#fff" />
          </div>
          <h2 className="text-xl font-black text-[#0f172a] mb-1">Blog Admin</h2>
          <p className="text-slate-400 text-sm mb-6">Enter password to continue</p>
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={e => setInputPass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border mb-4 outline-none focus:border-[#25d366]"
          />
          <button type="submit" className="w-full py-3 rounded-xl bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition-colors">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  const published = blogs.filter(b => b.status === "published").length;
  const drafts    = blogs.filter(b => b.status === "draft").length;
  const featured  = blogs.filter(b => b.featured).length;

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <div className="bg-[#0f172a] px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Blog Admin</h1>
          <p className="text-slate-400 text-xs mt-0.5">Content Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchBlogs} className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">
            ↻ Refresh
          </button>
          <Link
            to="/blog-admin/new"
            className="px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
          >
            + New Post
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Posts"  value={blogs.length}  color="text-[#0f172a]" />
          <StatCard label="Published"    value={published}     color="text-[#25d366]" />
          <StatCard label="Drafts"       value={drafts}        color="text-amber-500" />
          <StatCard label="Featured"     value={featured}      color="text-violet-500" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-[#0f172a]">All Posts ({blogs.length})</h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 mb-4">No blog posts yet.</p>
              <Link to="/blog-admin/new" className="px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-bold">
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Post</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {blogs.map(blog => (
                    <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                      {/* Post */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            {blog.thumbnail
                              ? <img src={blog.thumbnail} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-lg">📝</div>
                            }
                          </div>
                          <div>
                            <p className="font-bold text-[#0f172a] line-clamp-1 max-w-[240px]">{blog.title}</p>
                            <p className="text-xs text-slate-400">{blog.readingTime} min · {blog.author}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-[#25d366] bg-emerald-50 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleStatus(blog._id)}
                          disabled={actionId === blog._id}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                            blog.status === "published"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {blog.status === "published" ? "● Published" : "○ Draft"}
                        </button>
                      </td>
                      {/* Featured */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleFeatured(blog._id)}
                          disabled={actionId === blog._id}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                            blog.featured
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {blog.featured ? "★ Yes" : "☆ No"}
                        </button>
                      </td>
                      {/* Views */}
                      <td className="px-4 py-4 text-slate-500">{blog.views.toLocaleString()}</td>
                      {/* Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/blog-admin/edit/${blog._id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id, blog.title)}
                            disabled={actionId === blog._id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            Delete
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
      </div>
    </div>
  );
}
