import React from "react";
import { Link } from "react-router-dom";
import { Building2, User, Radar } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import StageBadge from "./StageBadge";
import PriorityBadge from "./PriorityBadge";
import CRMIntelligenceStatus from "./CRMIntelligenceStatus";
import CRMEmptyState from "./CRMEmptyState";

const COLUMNS = [
  { key: "title", label: "Record" },
  { key: "companyName", label: "Company" },
  { key: "personName", label: "Decision Maker" },
  { key: "stage", label: "Stage" },
  { key: "priority", label: "Priority" },
  { key: "nextAction", label: "Next Action" },
  { key: "intelligenceStatus", label: "Intel" },
];

export default function CRMList({ records }) {
  const demoLink = useDemoLink();

  if (records.length === 0) {
    return <CRMEmptyState variant="noResults" />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              {COLUMNS.map((col) => (
                <th key={col.key} className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <Link to={demoLink(`/crm/${record.id}`)} className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors">
                    {record.title}
                  </Link>
                  {record.entity_name && <p className="text-[11px] text-slate-400 dark:text-slate-500">{record.entity_name}</p>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                  {record.companyName ? (
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" /> {record.companyName}</span>
                  ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                  {record.personName ? (
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {record.personName}</span>
                  ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3"><StageBadge stage={record.stage} size="xs" /></td>
                <td className="px-4 py-3"><PriorityBadge priority={record.priority} /></td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[160px] truncate">
                  {record.nextAction ? (
                    <span>
                      {record.nextAction}
                      {record.nextActionDate && <span className="text-slate-400 dark:text-slate-500 ml-1 text-[10px]">· {new Date(record.nextActionDate).toLocaleDateString()}</span>}
                    </span>
                  ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <CRMIntelligenceStatus status={record.intelligenceStatus} size="xs" />
                    {record.missionId && <Radar className="w-3 h-3 text-slate-300 dark:text-slate-600" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-2">
        {records.map((record) => (
          <Link key={record.id} to={demoLink(`/crm/${record.id}`)} className="block rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{record.title}</p>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <StageBadge stage={record.stage} size="xs" />
              <PriorityBadge priority={record.priority} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>{record.companyName || "No company"}</span>
              <CRMIntelligenceStatus status={record.intelligenceStatus} size="xs" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}