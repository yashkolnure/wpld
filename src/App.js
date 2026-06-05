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
import { BlogIndex, BlogPost } from "./pages/Blog";

// Updated Helper: 
// We hide the Layout if it's a Workspace (/dashboard, /workflow) 
// OR if it's a dynamic slug (any path NOT in our marketing list)
const shouldHideLayout = (pathname) => {
  const workspacePaths = ["/dashboard", "/workflow", "/whatsapp-manager", "/yashkolnure"];
  // Marketing + blog paths — show Header/Footer on all of these
  const marketingPaths = ["/", "/login", "/register", "/login-success", "/shop", "/thankyou", "/blog"];

  // 1. Hide if it starts with a workspace path
  if (workspacePaths.some(path => pathname.startsWith(path))) return true;

  // 2. Show on blog paths (index + individual posts)
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return false;

  // 3. Hide on dynamic public form slugs (any path NOT in marketing list)
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

function App() {
  return (
    <BrowserRouter>
      {/* Top Global Navigation - Hidden on Dashboard, Workflows, and Public Forms */}
      <HeaderWrapper />
      
      {/* Main Page Content */}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow/new" element={<WorkflowBuilder />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/workflow/:id" element={<WorkflowBuilder />} />
          <Route path="/yashkolnure" element={<AdminDashboard />} />
          <Route path="/whatsapp-manager" element={<WhatsAppManager />} />
          <Route path="/shop" element={<ShopPage />} />

          {/* Blog routes */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Dynamic Catch-all Slug — must be last */}
          <Route path="/:slug" element={<PublicForm />} />
        </Routes>
      </main>

      {/* Bottom Global Footer - Hidden on Dashboard, Workflows, and Public Forms */}
      <FooterWrapper />
    </BrowserRouter>
  );
}

export default App;