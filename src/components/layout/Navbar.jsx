import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radar, LayoutDashboard } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Markets", href: "#markets" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.isAuthenticated().then(setAuthed);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleNav = (href) => {
    setOpen(false);
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Radar className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Scouty<span className="text-blue-600">Go</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {authed && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </button>
          <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
            Get Access
          </button>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left text-sm font-medium text-slate-700 py-1"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            {authed && (
              <Link to="/dashboard" className="flex items-center gap-1.5 text-left text-sm font-medium text-slate-600">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
            <button className="text-left text-sm font-medium text-slate-600">Sign In</button>
            <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold">
              Get Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
}