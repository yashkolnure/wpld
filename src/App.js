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

const marketingPaths = [
  "/", "/login", "/register", "/login-success", "/forgot-password",
  "/about", "/privacy", "/terms", "/faq",
  "/help-center", "/contact", "/api-docs", "/blog",
];

// Header is hidden on all workspace paths (dashboard has its own sidebar)
const shouldHideHeader = (pathname) => {
  const hiddenPaths = ["/dashboard", "/workflow", "/blog-admin"];
  if (hiddenPaths.some(p => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/blog/") || pathname.startsWith("/reset-password/")) return false;
  if (!marketingPaths.includes(pathname)) return true;
  return false;
};

// Footer is hidden on workflow builder, blog-admin, and unknown slugs
// but IS shown on /dashboard so logged-in users can navigate
const shouldHideFooter = (pathname) => {
  const hiddenPaths = ["/workflow", "/blog-admin"];
  if (hiddenPaths.some(p => pathname.startsWith(p))) return true;
  if (
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/reset-password/") ||
    pathname.startsWith("/dashboard")
  ) return false;
  if (!marketingPaths.includes(pathname)) return true;
  return false;
};

function HeaderWrapper() {
  const location = useLocation();
  if (shouldHideHeader(location.pathname)) return null;
  return <Header />;
}

function FooterWrapper() {
  const location = useLocation();
  if (shouldHideFooter(location.pathname)) return null;
  return <Footer />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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