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

// Updated Helper: 
// We hide the Layout if it's a Workspace (/dashboard, /workflow) 
// OR if it's a dynamic slug (any path NOT in our marketing list)
const shouldHideLayout = (pathname) => {
  const workspacePaths = ["/dashboard", "/workflow"];
  const marketingPaths = ["/", "/login", "/register", "/login-success"];

  // 1. Hide if it starts with dashboard or workflow
  if (workspacePaths.some(path => pathname.startsWith(path))) return true;

  // 2. Hide if it is NOT one of our main marketing/auth pages
  // This effectively catches the "/:slug" routes
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
          <Route path="/workflow/:id" element={<WorkflowBuilder />} />
          
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