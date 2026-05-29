import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5002";

export default function BlogPost() {
  const { slug }         = useParams();
  const [blog, setBlog]  = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    axios.get(`${API}/api/blogs/${slug}`)
      .then(r => {
        setBlog(r.data);
        return axios.get(`${API}/api/blogs/${slug}/related`);
      })
      .then(r => setRelated(r.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] font-sans">
        <div className="max-w-3xl mx-auto px-4 py-24 animate-pulse space-y-6">
          <div className="h-4 bg-slate-100 rounded w-1/4" />
          <div className="h-10 bg-slate-100 rounded" />
          <div className="h-10 bg-slate-100 rounded w-3/4" />
          <div className="aspect-[16/9] bg-slate-100 rounded-2xl" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📭</p>
          <h1 className="text-2xl font-black text-[#0f172a] mb-2">Article not found</h1>
          <p className="text-slate-500 mb-6">This article may have been moved or deleted.</p>
          <Link to="/blog" className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const metaTitle       = blog.metaTitle       || blog.title;
  const metaDescription = blog.metaDescription || blog.excerpt || "";
  const metaKeywords    = blog.metaKeywords    || "";
  const canonicalUrl    = `https://wpleads.in/blog/${blog.slug}`;

  return (
    <>
      <Helmet>
        <title>{metaTitle} | WPLeads Blog</title>
        <meta name="description"        content={metaDescription} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <link rel="canonical"           href={canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {blog.thumbnail && <meta property="og:image" content={blog.thumbnail} />}
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:site_name"   content="WPLeads" />
        {/* Article meta */}
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:author"         content={blog.author} />
        <meta property="article:section"        content={blog.category} />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.thumbnail && <meta name="twitter:image" content={blog.thumbnail} />}
        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: metaDescription,
          image: blog.thumbnail,
          author: { "@type": "Person", name: blog.author },
          publisher: { "@type": "Organization", name: "WPLeads", url: "https://wpleads.in" },
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt,
          url: canonicalUrl,
          keywords: blog.tags?.join(", "),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-[#f8fafc] font-sans">

        {/* ── Dark hero banner ── */}
        <div className="bg-[#0f172a] pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
              <Link to="/" className="hover:text-[#25d366] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[#25d366] transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-slate-300 truncate max-w-[260px]">{blog.title}</span>
            </div>

            {/* Featured badge */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {blog.featured && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  ★ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 max-w-3xl">
              {blog.title}
            </h1>

            {/* Author / Date / Read time */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-white text-xs font-black">
                  {blog.author[0]}
                </div>
                <span className="font-semibold text-slate-200">{blog.author}</span>
              </div>
              <span>·</span>
              <time dateTime={blog.publishedAt}>
                {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{blog.readingTime} min read</span>
              <span>·</span>
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* ── Two-column content ── */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex gap-8 items-start">

            {/* ── LEFT: Article ── */}
            <article className="flex-1 min-w-0">

              {/* Thumbnail */}
              {blog.thumbnail && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-md -mt-6 border border-slate-100">
                  <img src={blog.thumbnail} alt={blog.title} className="w-full object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-10">
                <div
                  className="blog-content prose"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-slate-100">
                    {blog.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors cursor-default">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Share */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex flex-wrap items-center gap-3">
                <span className="text-sm font-black text-[#0f172a] mr-1">Share this article:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1DA1F2] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Twitter / X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + canonicalUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  WhatsApp
                </a>
              </div>

              {/* Back to blog */}
              <div className="mt-6">
                <Link to="/blog" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-[#25d366] transition-colors text-sm">
                  ← Back to Blog
                </Link>
              </div>

              {/* Related posts — mobile only */}
              {related.length > 0 && (
                <div className="lg:hidden mt-10 pt-8 border-t border-slate-100">
                  <h2 className="text-lg font-black text-[#0f172a] mb-5">More Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map(r => (
                      <Link
                        key={r._id}
                        to={`/blog/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                          {r.thumbnail ? (
                            <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <span className="text-2xl">📝</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#25d366]">{r.category}</span>
                          <h3 className="font-black text-[#0f172a] text-sm mt-1 leading-snug group-hover:text-[#25d366] transition-colors line-clamp-2">{r.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{r.readingTime} min read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── RIGHT: Sticky Sidebar — desktop only ── */}
            {related.length > 0 && (
              <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-8 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-[#25d366] rounded-full" />
                  <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-widest">
                    More Articles
                  </h2>
                </div>
                {related.map(r => (
                  <Link
                    key={r._id}
                    to={`/blog/${r.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#25d366]/30 transition-all overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                      {r.thumbnail ? (
                        <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <span className="text-2xl">📝</span>
                        </div>
                      )}
                    </div>
                    {/* Text */}
                    <div className="p-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#25d366]">{r.category}</span>
                      <h3 className="font-black text-[#0f172a] text-sm leading-snug mt-1 mb-2 group-hover:text-[#25d366] transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-400">
                          {new Date(r.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <span className="text-[10px] font-bold text-[#25d366] group-hover:underline">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </aside>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
