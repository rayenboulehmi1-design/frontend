import React from "react";
import { AlertCircle, SearchX, RotateCcw, Database, Lock } from "lucide-react";
import { SkeletonCard, SkeletonSection } from "./Skeleton";

/**
 * Universal state wrapper for loading / empty / error / unsupported / populated states.
 * Ensures every section handles all states — no blank cards.
 *
 * status values:
 *   'loading'       — request in flight (shows skeleton)
 *   'success'       — data received (renders children)
 *   'empty'         — request succeeded but no data (e.g. "no decision makers found")
 *   'notfound'      — specific resource not found
 *   'unsupported'   — endpoint/capability not implemented on backend (e.g. "decision-maker discovery not available")
 *   'auth_required' — user not authenticated
 *   'error'         — server error, timeout, or retry exhaustion
 *
 * Key distinction:
 *   'empty'        = "We searched and found no results."
 *   'unsupported'  = "This capability is not available yet."
 *   'error'        = "The system could not retrieve data."
 */
export default function StateWrapper({
  status,
  loading,
  empty,
  error,
  populated,
  onRetry,
  skeletonVariant = 'card',
  skeletonCount = 3,
  emptyTitle = 'No data available',
  emptyMessage = 'Data will appear here when the Intelligence Engine provides it.',
  errorTitle = 'Something went wrong',
  errorMessage = 'We couldn\'t load this data. Please try again.',
  unsupportedTitle = 'Not available yet',
  unsupportedMessage = 'This capability is not yet supported by the Intelligence Engine.',
}) {
  if (status === 'loading') {
    if (loading) return <>{loading}</>;
    if (skeletonVariant === 'section') {
      return (
        <div className="space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonSection key={i} />)}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (status === 'error') {
    if (error) return <>{error}</>;
    return (
      <div className="rounded-2xl border border-rose-100 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-rose-500 dark:text-rose-400" />
        </div>
        <p className="text-sm font-bold text-rose-900 dark:text-rose-300 mb-1">{errorTitle}</p>
        <p className="text-xs text-rose-500 dark:text-rose-400 mb-4 max-w-sm mx-auto">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
        )}
      </div>
    );
  }

  if (status === 'unsupported') {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
          <Database className="w-6 h-6 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{unsupportedTitle}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">{unsupportedMessage}</p>
      </div>
    );
  }

  if (status === 'auth_required') {
    return (
      <div className="rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
        </div>
        <p className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">Authentication required</p>
        <p className="text-xs text-amber-500 dark:text-amber-400 max-w-sm mx-auto">Please sign in to access this data.</p>
      </div>
    );
  }

  if (status === 'empty' || status === 'notfound') {
    if (empty) return <>{empty}</>;
    return (
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{emptyTitle}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return populated ? <>{populated}</> : null;
}