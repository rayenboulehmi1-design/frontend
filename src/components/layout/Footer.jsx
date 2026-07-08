import React from "react";
import { Link } from "react-router-dom";
import { Radar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Radar className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-background">
                Scouty<span className="text-primary">Go</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Turning fragmented public information into actionable intelligence across global markets.
            </p>
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
              <h4 className="text-background font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 ScoutyGo. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <Link to="/privacy-policy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}