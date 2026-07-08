import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Bookmark, BookmarkCheck, Brain, Radio, Lightbulb, Zap, BarChart3, ArrowRight } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle, getSignalTagStyle, whyItMatters } from "@/lib/dealUtils";

export default function DealCard({ deal }) {
  const { isSaved, toggleSave } = useSavedOpportunities();
  const saved = isSaved(deal.id);
  const typeStyle = getTypeStyle(deal.type || deal.category);
  const locationText = deal.city && deal.country ? `${deal.city}, ${deal.country}` : deal.location || deal.country || "Global";
  const analysisText = deal.explanation || deal.summary;
  const signals = (deal.signals || []).slice(0, 6);
  const detectedText = deal.time_ago || "recently";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl border border-border bg-card p-5 hover:shadow-xl hover:border-primary/30 transition-all flex flex-col"
    >
      <AnimatePresence>
        {deal.isNew && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2.5 -right-2.5 z-10 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1 shadow-lg"
          >
            ✨ NEW
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${typeStyle.badge}`}>
              {deal.type || deal.category}
            </span>
            <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {locationText}
            </span>
          </div>
          <h3 className="font-bold text-foreground text-base leading-snug">
            {deal.company || deal.entity_name || deal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground/70">
            <Clock className="w-3 h-3" /> {detectedText}
            {deal.marketSize && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-medium text-muted-foreground">{deal.marketSize}</span>
              </>
            )}
          </div>
        </div>
        <ConfidenceBadge score={deal.confidence} size="md" />
      </div>

      {analysisText && (
        <div className="rounded-xl bg-muted p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">AI Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{analysisText}</p>
        </div>
      )}

      {signals.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Radio className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Signal Intelligence</span>
            <span className="text-[10px] text-muted-foreground/40">{signals.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {signals.map((tag) => (
              <span key={tag} className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${getSignalTagStyle(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-accent/5 p-3 mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-accent-foreground">Why It Matters</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{whyItMatters(deal)}</p>
      </div>

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground min-w-0">
          {deal.timeline && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-accent" /> {deal.timeline}
            </span>
          )}
          {deal.marketSize && (
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-primary" /> {deal.marketSize}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => toggleSave(deal)}
            className="p-2 rounded-lg border border-border hover:border-primary/30 transition-colors"
            aria-label={saved ? "Remove from saved" : "Save opportunity"}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4 text-muted-foreground/70" />}
          </button>
          <Link
            to={`/opportunities/${deal.id}`}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Full Brief <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}