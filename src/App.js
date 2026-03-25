import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkflowBuilder from './pages/WorkflowBuilder';
import LandingPage from './pages/LandingPage';
import Header from "./components/Header";
import LoginSuccess from "./pages/LoginSuccess";
import Footer from "./components/Footer";

// Helper to determine if we are in a "Workspace" (Dashboard/Builder)
// where we want to hide the global Navigation and Footer
const isWorkspacePath = (pathname) => {
  const excludePaths = ["/dashboard", "/workflow"];
  return excludePaths.some(path => pathname.startsWith(path));
};

function HeaderWrapper() {
  const location = useLocation();
  if (isWorkspacePath(location.pathname)) return null;
  return <Header />;
}

function FooterWrapper() {
  const location = useLocation();
  if (isWorkspacePath(location.pathname)) return null;
  return <Footer />;
}

function App() {
  return (
    <BrowserRouter>
      {/* Top Global Navigation */}
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
        </Routes>
      </main>

      {/* Bottom Global Footer */}
      <FooterWrapper />
    </BrowserRouter>
  );
}

export default App;