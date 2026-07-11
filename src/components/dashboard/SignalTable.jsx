import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, MapPin, Building2, Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useDemoLink } from "@/lib/demoMode";

const CATEGORY_STYLES = {
  "Real Estate": "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  "Investment": "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  "Business": "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900",
};

export default function SignalTable({ signals, loading }) {
  const navigate = useNavigate();
  const demoLink = useDemoLink();
  const [sortBy, setSortBy] = useState("time_ago");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(new Set());
  const { isSaved, bulkSave, bulkRemove } = useSavedOpportunities();

  const sorted = useMemo(() => {
    const arr = [...signals];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "confidence") {
        cmp = (a.confidence || 0) - (b.confidence || 0);
      } else if (sortBy === "title") {
        cmp = (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "time_ago") {
        cmp = new Date(a.created_date || 0).getTime() - new Date(b.created_date || 0).getTime();
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [signals, sortBy, sortDir]);

  // Keep selection in sync with currently displayed signals
  const validIds = useMemo(() => new Set(sorted.map((s) => s.id)), [sorted]);
  const cleanedSelected = useMemo(() => {
    const next = new Set();
    selected.forEach((id) => { if (validIds.has(id)) next.add(id); });
    return next;
  }, [selected, validIds]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (cleanedSelected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((s) => s.id)));
    }
  };

  const handleBulkSave = () => {
    const toSave = sorted.filter((s) => cleanedSelected.has(s.id) && !isSaved(s.id));
    if (toSave.length === 0) return;
    bulkSave(toSave);
    setSelected(new Set());
  };

  const handleBulkRemove = () => {
    const toRemove = sorted.filter((s) => cleanedSelected.has(s.id) && isSaved(s.id));
    if (toRemove.length === 0) return;
    bulkRemove(toRemove.map((s) => s.id));
    setSelected(new Set());
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const allChecked = sorted.length > 0 && cleanedSelected.size === sorted.length;
  const someChecked = cleanedSelected.size > 0 && !allChecked;
  const selectedCount = cleanedSelected.size;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Bulk action bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => { if (el) el.indeterminate = someChecked; }}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
          </span>
        </label>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Save Selected
            </button>
            <button
              onClick={handleBulkRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Saved
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">
                <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                  Signal <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">Location</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">Entity</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">
                <button onClick={() => toggleSort("confidence")} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                  Confidence <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400">
                <button onClick={() => toggleSort("time_ago")} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                  Detected <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((signal) => {
              const checked = cleanedSelected.has(signal.id);
              const saved = isSaved(signal.id);
              return (
                <tr
                  key={signal.id}
                  onClick={() => navigate(demoLink(`/opportunities/${signal.id}`))}
                  className={`border-b border-slate-50 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer ${checked ? "bg-blue-50/30 dark:bg-blue-950/20" : ""}`}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(signal.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      {saved && <Bookmark className="w-3.5 h-3.5 fill-blue-600 text-blue-600 shrink-0" />}
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{signal.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_STYLES[signal.category] || "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700"}`}>
                      {signal.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {signal.location}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                    {signal.entity_name ? (
                      <span className="flex items-center gap-1 truncate max-w-[160px]">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        {signal.entity_name}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {signal.confidence != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${signal.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{signal.confidence}%</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400 dark:text-slate-500 whitespace-nowrap">{signal.time_ago}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}