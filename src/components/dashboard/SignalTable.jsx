import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, MapPin, Building2 } from "lucide-react";

const CATEGORY_STYLES = {
  "Real Estate": "bg-blue-50 text-blue-700 border-blue-100",
  "Investment": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Business": "bg-violet-50 text-violet-700 border-violet-100",
};

export default function SignalTable({ signals, loading }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("time_ago");
  const [sortDir, setSortDir] = useState("desc");

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

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 border-b border-slate-50 bg-slate-50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3 font-semibold text-slate-500">
                <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-slate-700">
                  Signal <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">Location</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">Entity</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">
                <button onClick={() => toggleSort("confidence")} className="flex items-center gap-1 hover:text-slate-700">
                  Confidence <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">
                <button onClick={() => toggleSort("time_ago")} className="flex items-center gap-1 hover:text-slate-700">
                  Detected <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((signal) => (
              <tr key={signal.id} onClick={() => navigate(`/opportunities/${signal.id}`)} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer">
                <td className="px-5 py-3 max-w-xs">
                  <p className="font-medium text-slate-900 truncate">{signal.title}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_STYLES[signal.category] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                    {signal.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {signal.location}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {signal.entity_name ? (
                    <span className="flex items-center gap-1 truncate max-w-[160px]">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      {signal.entity_name}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {signal.confidence != null ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${signal.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{signal.confidence}%</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{signal.time_ago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}