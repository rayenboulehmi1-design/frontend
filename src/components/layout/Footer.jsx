import React from "react";
import { Link } from "react-router-dom";
import { Radar, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Radar className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Scouty<span className="text-blue-500">Go</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Turning fragmented public information into actionable intelligence across global markets.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Github].map((IconComponent, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Products", links: [
              { label: "Real Estate", to: "/intelligence-feed?category=Real Estate" },
              { label: "Business Deals", to: "/intelligence-feed?category=Business" },
              { label: "Investment", to: "/intelligence-feed?category=Investment" },
            ] },
            { title: "Company", links: [
              { label: "How It Works", to: "/#how-it-works" },
              { label: "Markets", to: "/#markets" },
              { label: "Pricing", to: "/#pricing" },
            ] },
            { title: "Resources", links: [
              { label: "FAQ", to: "/#faq" },
              { label: "Sign Up", to: "/register" },
              { label: "Sign In", to: "/login" },
            ] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 ScoutyGo. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}