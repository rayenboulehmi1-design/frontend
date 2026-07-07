import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, ArrowLeft, Plus, Trash2, MapPin, Tag, SlidersHorizontal } from "lucide-react";

const STORAGE_KEY = "scouty_alerts";
const categories = ["Real Estate", "Investment", "Business"];

export default function Alerts() {
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", location: "", keywords: "", minConfidence: 50 });

  const persist = (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAlerts(next);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const alert = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString() };
    persist([alert, ...alerts]);
    setForm({ name: "", category: "", location: "", keywords: "", minConfidence: 50 });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    persist(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Alerts</h1>
          </div>
          <p className="text-slate-500 text-sm">Get notified when new signals match your criteria.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Alert
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-100 bg-white p-6 mb-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">Alert Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Dubai Real Estate"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 bg-white"
              >
                <option value="">Any</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Dubai, UAE"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Keywords</label>
              <input
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="e.g. off-plan, launch"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Min Confidence: {form.minConfidence}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={form.minConfidence}
                onChange={(e) => setForm({ ...form, minConfidence: Number(e.target.value) })}
                className="mt-3 w-full accent-blue-600"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Create Alert
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No alerts configured yet.</p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Create Alert
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const alertParams = new URLSearchParams();
            if (alert.category) alertParams.set("category", alert.category);
            if (alert.keywords || alert.location) {
              alertParams.set("search", [alert.keywords, alert.location].filter(Boolean).join(" "));
            }
            return (
              <Link key={alert.id} to={`/intelligence-feed?${alertParams.toString()}`}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center justify-between gap-4 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{alert.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      {alert.category && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {alert.category}</span>}
                      {alert.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location}</span>}
                      {alert.keywords && <span>Keywords: {alert.keywords}</span>}
                      <span className="flex items-center gap-1"><SlidersHorizontal className="w-3 h-3" /> {alert.minConfidence}%+ confidence</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(alert.id); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}