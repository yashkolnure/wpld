import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

/* ─── Blog post data ───────────────────────────────────────────────── */
const POSTS = [
  {
    slug: "how-to-create-whatsapp-bot-free",
    title: "How to Create a WhatsApp Bot for Free in 5 Minutes (No Code)",
    metaTitle: "How to Create a WhatsApp Bot for Free — No Code | WPLeads",
    metaDescription:
      "Step-by-step guide to building a WhatsApp chatbot for free without any coding. WPLeads gives you a visual flow builder + free API setup. Live in under 5 minutes.",
    date: "2026-05-20",
    category: "Tutorials",
    readTime: "5 min read",
    excerpt:
      "Want to automate your WhatsApp replies without hiring a developer? In this guide, we show you exactly how to build a fully working WhatsApp bot in under 5 minutes — completely free.",
    body: [
      {
        type: "p",
        text: "WhatsApp has over 500 million users in India alone. Automating it isn't just a nice-to-have anymore — it's a competitive edge. The good news: you don't need to write a single line of code.",
      },
      {
        type: "h2",
        text: "Step 1: Sign up for WPLeads (Free)",
      },
      {
        type: "p",
        text: "Go to wpleads.in and create a free account. No credit card needed. You get access to the Pro plan free during the launch period.",
      },
      {
        type: "h2",
        text: "Step 2: Connect your WhatsApp via Meta",
      },
      {
        type: "p",
        text: "Paste your Meta App credentials into WPLeads. The platform guides you through the exact fields — it takes about 2 minutes. WPLeads is an official Meta Tech Provider, so the process is streamlined.",
      },
      {
        type: "h2",
        text: "Step 3: Register the Webhook",
      },
      {
        type: "p",
        text: "Copy the WPLeads webhook URL and paste it into your Meta App settings. This is a one-time step. Hit verify and you're connected.",
      },
      {
        type: "h2",
        text: "Step 4: Build Your Flow",
      },
      {
        type: "p",
        text: "Open the Visual Flow Builder. Drag a Keyword Trigger node onto the canvas — this fires when someone messages a specific word (like 'hi', 'menu', or 'order'). Then add Text Message nodes, Button nodes, or List nodes to design your conversation.",
      },
      {
        type: "h2",
        text: "Step 5: Hit Save — You're Live",
      },
      {
        type: "p",
        text: "That's it. Your WhatsApp bot is live immediately. No deployment, no server setup. Test it by sending the trigger keyword to your WhatsApp number.",
      },
      {
        type: "h2",
        text: "Available across India",
      },
      {
        type: "p",
        text: "WPLeads WhatsApp API works pan-India — whether you're in Pune, Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Ahmedabad or anywhere else. Free setup, instant activation.",
      },
    ],
  },
  {
    slug: "whatsapp-api-free-india",
    title: "Free WhatsApp Business API in India — No Approval Wait (2026 Guide)",
    metaTitle: "Free WhatsApp Business API India 2026 — Instant Setup | WPLeads",
    metaDescription:
      "Get a free WhatsApp Business API in India without the long Meta approval process. WPLeads offers instant setup across Pune, Bangalore, Mumbai, Delhi & all cities. Official Meta partner.",
    date: "2026-05-28",
    category: "WhatsApp API",
    readTime: "6 min read",
    excerpt:
      "Getting a WhatsApp Business API used to take days of approvals. WPLeads has changed that — free API, instant activation, works pan-India. Here's everything you need to know.",
    body: [
      {
        type: "p",
        text: "The WhatsApp Business API is the most powerful channel for reaching customers in India. But historically, getting access meant weeks of waiting, complex BSP agreements, and high monthly fees. Not anymore.",
      },
      {
        type: "h2",
        text: "What is the WhatsApp Business API?",
      },
      {
        type: "p",
        text: "The WhatsApp Business API (now called Cloud API) is Meta's official developer platform for sending automated, high-volume messages through WhatsApp. Unlike the regular WhatsApp Business app, the API lets you send thousands of messages, create chatbots, and integrate with your CRM.",
      },
      {
        type: "h2",
        text: "Why WPLeads Gives You Free API Access",
      },
      {
        type: "p",
        text: "WPLeads is an official Meta Tech Provider. We've simplified the provisioning process so you can connect your Meta credentials and get a live WhatsApp API in under 5 minutes — no waiting period, no manual review, no setup fee.",
      },
      {
        type: "h2",
        text: "WhatsApp API Pricing in India",
      },
      {
        type: "p",
        text: "Meta charges for conversation-based messaging. In India: ₹1.09 per marketing conversation, ₹0.145 for utility or authentication conversations. WPLeads adds a 25% markup only on broadcast messages — inbound messages and workflow replies are always free.",
      },
      {
        type: "h2",
        text: "Cities Where WPLeads Operates",
      },
      {
        type: "p",
        text: "WPLeads is available across all of India — WhatsApp API in Pune, WhatsApp API in Bangalore, WhatsApp API in Mumbai, WhatsApp API in Delhi, WhatsApp API in Hyderabad, WhatsApp API in Chennai, WhatsApp API in Ahmedabad, WhatsApp API in Kolkata, and every other city. Since it's a cloud platform, location doesn't matter.",
      },
    ],
  },
  {
    slug: "wpleads-vs-aisensy",
    title: "WPLeads vs AiSensy — Which WhatsApp Platform is Better in 2026?",
    metaTitle: "WPLeads vs AiSensy 2026 — Honest Comparison | WPLeads Blog",
    metaDescription:
      "Comparing WPLeads and AiSensy for WhatsApp automation in India. Pricing, features, free plan, API setup time, and verdict. Updated for 2026.",
    date: "2026-06-01",
    category: "Comparisons",
    readTime: "7 min read",
    excerpt:
      "Both WPLeads and AiSensy offer WhatsApp automation for Indian businesses. But they're very different in pricing, ease of use, and free plan generosity. Here's a side-by-side breakdown.",
    body: [
      {
        type: "p",
        text: "If you're evaluating WhatsApp automation tools for your business in India, WPLeads and AiSensy are two names you'll keep running into. Both are Meta-approved BSPs. But the similarities end there.",
      },
      {
        type: "h2",
        text: "Pricing — Free Plan Comparison",
      },
      {
        type: "p",
        text: "WPLeads offers a truly free Pro plan with no subscription fee — you only pay per broadcast message sent (25% markup). AiSensy charges a subscription starting at ₹999/month after a 14-day trial. For bootstrapped businesses and startups, WPLeads is dramatically cheaper.",
      },
      {
        type: "h2",
        text: "WhatsApp API Setup Speed",
      },
      {
        type: "p",
        text: "WPLeads: under 5 minutes, self-serve. AiSensy: ~10 minutes with some manual steps. Both are fast, but WPLeads has a slight edge with the guided setup flow.",
      },
      {
        type: "h2",
        text: "Visual Flow Builder",
      },
      {
        type: "p",
        text: "WPLeads has a drag-and-drop canvas with full branching logic, keyword triggers, and media nodes. AiSensy offers a more linear chatbot builder. If you need complex conversation flows, WPLeads is better suited.",
      },
      {
        type: "h2",
        text: "Verdict",
      },
      {
        type: "p",
        text: "For Indian SMBs and startups: WPLeads wins on price and flexibility. For enterprises needing a large support ecosystem and integrations: AiSensy has a larger partner network. But for most businesses getting started with WhatsApp automation, WPLeads' free plan and 5-minute setup make it the obvious starting point.",
      },
    ],
  },
  {
    slug: "whatsapp-automation-for-ecommerce-india",
    title: "WhatsApp Automation for E-Commerce in India — Complete 2026 Guide",
    metaTitle: "WhatsApp Automation for E-Commerce India 2026 | WPLeads",
    metaDescription:
      "How Indian e-commerce stores use WhatsApp automation to send order updates, recover abandoned carts, and grow sales. Free setup with WPLeads.",
    date: "2026-06-04",
    category: "Use Cases",
    readTime: "6 min read",
    excerpt:
      "Indian e-commerce brands using WhatsApp automation see 3x higher conversion rates than email. Here's exactly how to set it up for your store — for free.",
    body: [
      {
        type: "p",
        text: "In India, WhatsApp has an 80%+ message open rate — compared to 20% for email. For e-commerce businesses, this is a game-changer. Every order confirmation, shipping update, and cart recovery message you send on WhatsApp is almost guaranteed to be read.",
      },
      {
        type: "h2",
        text: "Key WhatsApp Automation Flows for E-Commerce",
      },
      {
        type: "p",
        text: "1. Order Confirmation: Instantly send order details with invoice link the moment a purchase is made. 2. Shipping Updates: Automated messages when the order is packed, shipped, and delivered. 3. Abandoned Cart Recovery: Message customers who added to cart but didn't checkout — offer a 10% discount. 4. Product Catalog: Let customers browse and order directly inside WhatsApp with image + button messages.",
      },
      {
        type: "h2",
        text: "Setup in 5 Minutes with WPLeads",
      },
      {
        type: "p",
        text: "With WPLeads, you don't need a developer to set any of this up. The visual flow builder lets you drag and drop the entire customer journey. Connect your WhatsApp API (free), build the flow, and it's live.",
      },
    ],
  },
];

/* ─── Blog Index Page ──────────────────────────────────────────────── */
function BlogIndex() {
  useEffect(() => {
    document.title = "Blog – WhatsApp Automation Tips & Guides | WPLeads";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "WPLeads blog — WhatsApp automation guides, API setup tutorials, comparisons, and tips for Indian businesses. Free resources to grow with WhatsApp.");
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: 100 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 100, padding: "5px 14px", fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 500, letterSpacing: 2, color: "#16a34a", textTransform: "uppercase", marginBottom: 18 }}>
            Blog
          </div>
          <h1 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", marginBottom: 14 }}>
            WhatsApp Automation Guides
          </h1>
          <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", lineHeight: 1.7, maxWidth: 560 }}>
            Tutorials, comparisons, and tips for Indian businesses using WhatsApp API, chatbots, and automation tools.
          </p>
        </div>

        {/* Post Grid */}
        <div style={{ display: "grid", gap: 28 }}>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <article
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 20,
                  padding: "32px 36px",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(37,211,102,0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: 100, fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", fontWeight: 500 }}>{post.date}</span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", fontWeight: 500 }}>· {post.readTime}</span>
                </div>
                <h2 style={{ fontSize: "clamp(18px,2.2vw,22px)", fontWeight: 800, color: "#0a0a0a", marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: 0 }}>
                  {post.excerpt}
                </p>
                <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: "#25d366", display: "flex", alignItems: "center", gap: 6 }}>
                  Read article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Individual Blog Post Page ────────────────────────────────────── */
function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", post.metaDescription);
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute("href", `https://wpleads.in/blog/${post.slug}`);
    }
  }, [post]);

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 100, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0a0a0a", marginBottom: 14 }}>Post not found</h1>
          <Link to="/blog" style={{ color: "#25d366", fontWeight: 700, textDecoration: "none" }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: 100 }}
    >
      {/* Hidden machine-readable metadata */}
      <meta itemProp="datePublished" content={post.date} />
      <meta itemProp="author" content="WPLeads" />
      <meta itemProp="publisher" content="WPLeads" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ marginBottom: 32, fontSize: 13, color: "rgba(0,0,0,0.4)" }}>
          <Link to="/" style={{ color: "rgba(0,0,0,0.4)", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link to="/blog" style={{ color: "rgba(0,0,0,0.4)", textDecoration: "none" }}>Blog</Link>
          {" / "}
          <span style={{ color: "#0a0a0a" }}>{post.category}</span>
        </nav>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(37,211,102,0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: 100, fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
            {post.category}
          </span>
          <time dateTime={post.date} style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>{post.date}</time>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>· {post.readTime}</span>
        </div>

        {/* Title */}
        <h1 itemProp="headline" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.15, marginBottom: 28 }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p style={{ fontSize: 17, color: "rgba(0,0,0,0.6)", lineHeight: 1.7, marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(0,0,0,0.07)", fontStyle: "italic" }}>
          {post.excerpt}
        </p>

        {/* Body */}
        <div itemProp="articleBody">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 800, color: "#0a0a0a", marginTop: 40, marginBottom: 14, letterSpacing: "-0.02em" }}>
                  {block.text}
                </h2>
              );
            }
            return (
              <p key={i} style={{ fontSize: 16, color: "rgba(0,0,0,0.65)", lineHeight: 1.75, marginBottom: 20 }}>
                {block.text}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56, padding: "36px", background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 20, textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a", marginBottom: 10 }}>
            Ready to build your WhatsApp bot?
          </h3>
          <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.55)", marginBottom: 24, lineHeight: 1.6 }}>
            Free forever plan · No credit card · Live in 5 minutes · Official Meta partner
          </p>
          <a
            href="/register"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25d366", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 50, fontSize: 14, fontWeight: 800, boxShadow: "0 8px 20px rgba(37,211,102,0.3)" }}
          >
            Get Free WhatsApp API →
          </a>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: 40 }}>
          <Link to="/blog" style={{ color: "#25d366", fontWeight: 700, textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Router-aware export ──────────────────────────────────────────── */
export { BlogIndex, BlogPost };
