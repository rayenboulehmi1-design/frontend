import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import SignalCard from "@/components/SignalCard";

export default function SavedOpportunities() {
  const { saved } = useSavedOpportunities();

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Saved Opportunities</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {saved.length > 0
            ? `${saved.length} saved opportunity${saved.length !== 1 ? "s" : ""}`
            : "Bookmark signals to revisit them here."}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Bookmark className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground/70 mb-4">No saved opportunities yet.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Browse Intelligence
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((signal, i) => (
            <motion.div key={signal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SignalCard signal={signal} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}