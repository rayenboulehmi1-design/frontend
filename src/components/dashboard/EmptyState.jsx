import React from "react";
import { motion } from "framer-motion";
import { SearchX, RotateCcw } from "lucide-react";

export default function EmptyState({ onClearFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No signals match your filters</h3>
      <p className="text-sm text-muted-foreground/70 mb-6 max-w-sm mx-auto">
        Try adjusting your search query or clearing some filters to see more results.
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Clear all filters
        </button>
      )}
    </motion.div>
  );
}