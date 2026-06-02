import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkflowBuilder from './pages/WorkflowBuilder';
import LandingPage from './pages/LandingPage';
import Header from "./components/Header";
import LoginSuccess from "./pages/LoginSuccess";
import Footer from "./components/Footer";
import PublicForm from "./pages/PublicForm";
import WhatsAppManager from "./pages/WhatsAppManager";
import ThankYou from "./pages/thankyou";
import AdminDashboard from "./pages/yashkolnure";
import ShopPage from "./pages/ShopPage";
import AboutUs from "./pages/AboutUs";
import Partners from "./pages/Partners";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import ApiDocs from "./pages/ApiDocs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import BlogEditor from "./pages/BlogEditor";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Updated Helper:
// We hide the Layout if it's a Workspace (/dashboard, /workflow) 
// OR if it's a dynamic slug (any path NOT in our marketing list)
const shouldHideLayout = (pathname) => {
  const workspacePaths = ["/dashboard", "/workflow", "/blog-admin"];
  const marketingPaths = [
    "/", "/login", "/register", "/login-success", "/forgot-password",
    "/about", "/privacy", "/terms", "/faq",
    "/help-center", "/contact", "/api-docs", "/blog", "/partners",
  ];

  // 1. Hide if it starts with a workspace path
  if (workspacePaths.some(path => pathname.startsWith(path))) return true;

  // 2. Blog posts and reset-password keep header/footer
  if (pathname.startsWith("/blog/") || pathname.startsWith("/reset-password/")) return false;

  // 3. Hide if it is NOT one of our main marketing/auth pages
  if (!marketingPaths.includes(pathname)) return true;

  return false;
};

function HeaderWrapper() {
  const location = useLocation();
  if (shouldHideLayout(location.pathname)) return null;
  return <Header />;
}

function FooterWrapper() {
  const location = useLocation();
  if (shouldHideLayout(location.pathname)) return null;
  return <Footer />;
}

// Shown app-wide while a super admin is impersonating a user (set in /yashkolnure).
function ImpersonationBanner() {
  const email = typeof window !== "undefined" ? localStorage.getItem("wpl_impersonating") : null;
  const back = typeof window !== "undefined" ? localStorage.getItem("wpl_admin_return") : null;
  if (!email || !back) return null;
  const exit = () => {
    localStorage.setItem("token", back);
    localStorage.removeItem("wpl_admin_return");
    localStorage.removeItem("wpl_impersonating");
    window.location.href = "/yashkolnure";
  };
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999, background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "7px 14px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif", boxShadow: "0 2px 10px rgba(0,0,0,0.25)" }}>
      <span>👁️ Viewing as <b>{email}</b></span>
      <button onClick={exit} style={{ background: "#fff", color: "#7c3aed", border: "none", borderRadius: 8, padding: "5px 12px", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>Exit to Super Admin</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ImpersonationBanner />
      {/* Top Global Navigation - Hidden on Dashboard, Workflows, and Public Forms */}
      <HeaderWrapper />
      
      {/* Main Page Content */}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog-admin" element={<BlogAdmin />} />
          <Route path="/blog-admin/new" element={<BlogEditor />} />
          <Route path="/blog-admin/edit/:id" element={<BlogEditor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow/new" element={<WorkflowBuilder />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/workflow/:id" element={<WorkflowBuilder />} />
          <Route path="/yashkolnure" element={<AdminDashboard />} />
          <Route path="/whatsapp-manager" element={<WhatsAppManager />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about"       element={<AboutUs />} />
          <Route path="/partners"    element={<Partners />} />
          <Route path="/privacy"     element={<PrivacyPolicy />} />
          <Route path="/terms"       element={<TermsAndConditions />} />
          <Route path="/faq"         element={<FAQ />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/api-docs"    element={<ApiDocs />} />

          {/* Dynamic Catch-all Slug */}
          <Route path="/:slug" element={<PublicForm />} />
        </Routes>
      </main>

      {/* Bottom Global Footer - Hidden on Dashboard, Workflows, and Public Forms */}
      <FooterWrapper />
    </BrowserRouter>
  );
}

export default App;