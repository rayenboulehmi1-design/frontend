/**
 * Opportunity CRM configuration constants.
 * Centralized stage, priority, status, and activity type definitions.
 */

export const CRM_STAGES = [
  "Discovered",
  "Researching",
  "Qualified",
  "Contacted",
  "Meeting",
  "Negotiation",
  "Won",
  "Lost",
];

export const STAGE_META = {
  Discovered: { dot: "bg-slate-400 dark:bg-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" },
  Researching: { dot: "bg-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-900" },
  Qualified: { dot: "bg-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-900" },
  Contacted: { dot: "bg-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/50", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-900" },
  Meeting: { dot: "bg-violet-400", bg: "bg-violet-50 dark:bg-violet-950/50", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-900" },
  Negotiation: { dot: "bg-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900" },
  Won: { dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900" },
  Lost: { dot: "bg-rose-400", bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-900" },
};

export const PRIORITIES = ["low", "medium", "high", "urgent"];

export const PRIORITY_META = {
  low: { label: "Low", cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" },
  medium: { label: "Medium", cls: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" },
  high: { label: "High", cls: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" },
  urgent: { label: "Urgent", cls: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400" },
};

export const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"];

export const TASK_STATUS_META = {
  "Pending": { dot: "bg-slate-400 dark:bg-slate-500", text: "text-slate-600 dark:text-slate-400" },
  "In Progress": { dot: "bg-blue-400", text: "text-blue-600 dark:text-blue-400" },
  "Completed": { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  "Cancelled": { dot: "bg-rose-400", text: "text-rose-500 dark:text-rose-400" },
};

export const INTELLIGENCE_STATUSES = {
  monitoring: { label: "Monitoring", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-100 dark:border-blue-900", dot: "bg-blue-400" },
  new_intelligence: { label: "New Intelligence", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/50", border: "border-violet-100 dark:border-violet-900", dot: "bg-violet-400" },
  review_required: { label: "Review Required", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-100 dark:border-amber-900", dot: "bg-amber-400" },
  no_recent: { label: "No Recent Changes", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-100 dark:border-slate-700", dot: "bg-slate-300 dark:bg-slate-600" },
  paused: { label: "Monitoring Paused", color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-100 dark:border-slate-700", dot: "bg-slate-300 dark:bg-slate-600" },
};

export const INTELLIGENCE_STATUS_KEYS = Object.keys(INTELLIGENCE_STATUSES);

export const ACTIVITY_TYPES = [
  "CRM Record Created",
  "Stage Changed",
  "Note Added",
  "Task Created",
  "Task Completed",
  "Meeting Scheduled",
  "Meeting Completed",
  "Opportunity Updated",
  "Intelligence Update Detected",
  "Lead Verified",
  "Outreach Draft Generated",
  "Outreach Started",
  "Follow-up Scheduled",
  "Record Won",
  "Record Lost",
];

/**
 * Ownership fields prepared for the future Replit backend.
 * These are documented here for frontend architecture readiness;
 * actual ownership enforcement will be server-side.
 */
export const OWNERSHIP_FIELDS = [
  "ownerUserId",
  "workspaceId",
  "clientWorkspaceId",
  "createdBy",
  "assignedTo",
];