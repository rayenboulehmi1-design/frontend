import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon, Bell, Globe } from "lucide-react";

const STORAGE_KEY = "scouty_settings";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  });

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSettings(next);
  };

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-5 h-5 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "emailAlerts", label: "Email Alerts", desc: "Receive email when new signals match your alerts", default: true },
            { key: "pushNotifications", label: "Push Notifications", desc: "Get push notifications in your browser", default: false },
            { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of top signals every week", default: true },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground/70">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key] ?? item.default} onChange={(v) => update(item.key, v)} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="font-semibold text-foreground">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Default Category</p>
              <p className="text-xs text-muted-foreground/70">Filter dashboard by default</p>
            </div>
            <select
              value={settings.defaultCategory || "All"}
              onChange={(e) => update("defaultCategory", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border text-sm outline-none bg-card"
            >
              <option value="All">All</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Investment">Investment</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Min Confidence Threshold</p>
              <p className="text-xs text-muted-foreground/70">Hide signals below this score</p>
            </div>
            <select
              value={String(settings.minConfidence || 0)}
              onChange={(e) => update("minConfidence", Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border text-sm outline-none bg-card"
            >
              <option value="0">All</option>
              <option value="50">50%+</option>
              <option value="70">70%+</option>
              <option value="85">85%+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}