import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Save, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setFullName(u?.full_name || "");
    }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(false);
    try {
      await base44.auth.updateMe({ full_name: fullName });
      setUser((prev) => ({ ...prev, full_name: fullName }));
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch {}
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const initial = (user.full_name || user.email || "?")[0].toUpperCase();

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <User className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">{initial}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user.full_name || "—"}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{user.email}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Role</label>
            <div className="mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-sm text-slate-500 capitalize">{user.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            {savedMsg && <span className="text-sm text-emerald-600 font-medium">Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}