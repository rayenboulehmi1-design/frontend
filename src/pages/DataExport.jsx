import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Filter, Loader2 } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";

const categories = ["Real Estate", "Investment", "Business"];

const timeRanges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "All time", days: null },
];

function exportToCSV(signals, filename) {
  const headers = ["Title", "Category", "Location", "Entity", "Confidence (%)", "Detected", "Summary"];
  const rows = signals.map((s) => [
    s.title || "",
    s.category || "",
    s.location || "",
    s.entity_name || "",
    s.confidence ?? "",
    s.created_date || s.time_ago || "",
    (s.summary || "").replace(/\n/g, " "),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DataExport() {
  const { saved } = useSavedOpportunities();
  const [selectedCategories, setSelectedCategories] = useState(["Real Estate", "Investment", "Business"]);
  const [rangeDays, setRangeDays] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const filtered = useMemo(() => {
    const now = Date.now();
    return saved.filter((s) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(s.category);
      if (!matchesCategory) return false;
      if (rangeDays == null) return true;
      const detected = new Date(s.created_date || 0).getTime();
      return now - detected <= rangeDays * 86400000;
    });
  }, [saved, selectedCategories, rangeDays]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleExport = () => {
    setExporting(true);
    setExported(false);
    const filename = `scoutygo-signals-${new Date().toISOString().split("T")[0]}.csv`;
    setTimeout(() => {
      exportToCSV(filtered, filename);
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 400);
  };

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Download className="w-5 h-5 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Data Export</h1>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground/70 mb-4">No saved signals to export.</p>
          <Link to="/intelligence-feed" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Browse Intelligence
          </Link>
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground/70" />
              <h2 className="font-semibold text-foreground">Time Range</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setRangeDays(range.days)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    rangeDays === range.days
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border border-border hover:border-primary/30"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4">Categories</h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Export Preview</h2>
              <span className="text-sm text-muted-foreground/70">{filtered.length} signal{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground/70 py-6 text-center">No signals match your filters.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filtered.slice(0, 20).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                    <span className="text-xs text-muted-foreground/70 shrink-0">{s.category}</span>
                  </div>
                ))}
                {filtered.length > 20 && (
                  <p className="text-xs text-muted-foreground/70 text-center pt-2">+{filtered.length - 20} more...</p>
                )}
              </div>
            )}
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              disabled={filtered.length === 0 || exporting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? "Exporting..." : "Download CSV"}
            </button>
            {exported && <span className="text-sm text-primary font-medium">Downloaded!</span>}
          </div>
        </>
      )}
    </div>
  );
}