import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WaIcon } from "./Icons";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Features", id: "features" },
    { name: "Builder",  id: "builder"  },
    { name: "Pricing",  id: "pricing"  },
    { name: "Reviews",  id: "reviews"  },
  ];

  const handleNav = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      {/* ── DESKTOP / TABLET HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-[1000] flex justify-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isScrolled ? "pt-4 px-5" : "pt-6 px-5"}`}>
        <nav
          style={{ maxWidth: isScrolled ? "900px" : "1300px" }}
          className={`w-full h-16 flex items-center justify-between px-6 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] border border-white/30 backdrop-blur-xl saturate-[180%] ${
            isScrolled
              ? "rounded-full bg-white/75 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
              : "rounded-[20px] bg-white/40 shadow-sm"
          }`}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <WaIcon size={16} color="#fff" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-900 leading-none">
                WP<span className="text-[#25d366]">Leads</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 rounded-full bg-[#25d366] animate-ping" />
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">System Live</span>
              </div>
            </div>
          </Link>

          {/* NAV LINKS — desktop only */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-black/5 rounded-full relative">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNav(e, link.id)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative z-10 text-[13px] font-bold px-4 py-2 transition-colors duration-300 ${
                  hoveredIdx === idx ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {link.name}
              </a>
            ))}
            {/* Sliding pill */}
            <div
              style={{
                left: hoveredIdx !== null ? `${hoveredIdx * 84 + 4}px` : "0px",
                opacity: hoveredIdx !== null ? 1 : 0,
                width: "80px",
              }}
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
            />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* Sign in — hidden on small mobile, visible md+ */}
            <Link
              to="/login"
              className="hidden md:block text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>

            {/* Get Started — always visible */}
            <Link
              to="/register"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Get Started
            </Link>

            {/* Hamburger — lg hidden */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
              aria-label="Open menu"
            >
              <div className="w-4 h-[2px] bg-slate-900 shadow-[0_5px_0_#0f172a,0_-5px_0_#0f172a]" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-white/98 backdrop-blur-2xl">

          {/* Top bar */}
          <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center shadow-md">
                <WaIcon size={16} color="#fff" />
              </div>
              <span className="font-black text-xl text-slate-900">
                WP<span className="text-[#25d366]">Leads</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-2xl font-light hover:bg-slate-200 transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col px-7 pt-8 gap-2 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNav(e, link.id)}
                className="text-3xl font-black text-slate-900 tracking-tighter py-3 border-b border-slate-50 hover:text-[#25d366] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bottom auth buttons */}
          <div className="px-7 pb-10 pt-6 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 rounded-2xl border-2 border-slate-200 text-center text-[15px] font-bold text-slate-700 hover:border-slate-400 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 rounded-2xl bg-[#25d366] text-center text-[15px] font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-[#1db954] transition-colors"
            >
              Get Started — It's Free 🚀
            </Link>
          </div>

        </div>
      )}
    </>
  );
}
