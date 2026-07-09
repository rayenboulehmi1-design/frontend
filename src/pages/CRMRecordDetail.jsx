import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, GitBranch, Building2, User, Lightbulb, ShieldCheck, Mail,
  FileSearch, Sparkles, StickyNote, Target, Radar, Calendar, CheckSquare,
  Clock, Database, ChevronDown,
} from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { getRecord, getActivities, getTasks, getMeetings, getNotes, changeStage, updateRecord, deleteRecord } from "@/lib/crmStore";
import { CRM_STAGES, STAGE_META } from "@/lib/crmConfig";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";
import StageBadge from "@/components/crm/StageBadge";
import PriorityBadge from "@/components/crm/PriorityBadge";
import CRMIntelligenceStatus from "@/components/crm/CRMIntelligenceStatus";
import CRMActivityTimeline from "@/components/crm/CRMActivityTimeline";
import CRMTaskPanel from "@/components/crm/CRMTaskPanel";
import CRMMeetingPanel from "@/components/crm/CRMMeetingPanel";
import CRMNotesPanel from "@/components/crm/CRMNotesPanel";
import CRMAssistant from "@/components/crm/CRMAssistant";
import CRMEmptyState from "@/components/crm/CRMEmptyState";

function DetailSection({ number, title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">{number}</div>
        <div className="w-px flex-1 bg-gradient-to-b from-slate-200 to-slate-100 min-h-[1.5rem] my-1" />
      </div>
      <div className="flex-1 pb-6 min-w-0">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 mb-2.5 flex-wrap w-full text-left">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-300 ml-auto transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && children}
      </div>
    </motion.div>
  );
}

export default function CRMRecordDetail() {
  const { recordId } = useParams();
  const demoLink = useDemoLink();
  const [record, setRecord] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    const r = getRecord(recordId);
    setRecord(r);
    if (r) {
      setActivities(getActivities(recordId));
      setTasks(getTasks(recordId));
      setMeetings(getMeetings(recordId));
      setNotes(getNotes(recordId));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [recordId]);

  const handleStageChange = (newStage) => {
    if (!record || record.stage === newStage) return;
    changeStage(record.id, newStage);
    loadAll();
  };

  const handleDelete = () => {
    if (!record) return;
    deleteRecord(record.id);
    window.location.href = demoLink("/crm");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-5 sm:p-8 max-w-4xl mx-auto">
        <Link to={demoLink("/crm")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to CRM
        </Link>
        <CRMEmptyState variant="notFound" action={<Link to={demoLink("/crm")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">Back to Pipeline</Link>} />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to={demoLink("/crm")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to CRM
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">CRM Record</h1>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stage={record.stage} />
          <PriorityBadge priority={record.priority} />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-700 mb-1">{record.title}</p>
      <p className="text-xs text-slate-400 mb-6">
        Created {new Date(record.createdAt).toLocaleDateString()} · Last activity {record.lastActivityAt ? new Date(record.lastActivityAt).toLocaleDateString() : "—"}
      </p>

      {/* Stage selector */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Move to Stage</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {CRM_STAGES.map((stage, i) => {
            const meta = STAGE_META[stage];
            const active = record.stage === stage;
            return (
              <React.Fragment key={stage}>
                <button
                  onClick={() => handleStageChange(stage)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap border transition-colors ${
                    active ? `${meta.bg} ${meta.text} ${meta.border} font-bold` : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {stage}
                </button>
                {i < CRM_STAGES.length - 1 && <span className="text-slate-200 text-xs">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div>
        <DetailSection number={1} title="CRM Record Overview" icon={Target}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Priority</span><p className="font-medium text-slate-700 capitalize mt-0.5"><PriorityBadge priority={record.priority} /></p></div>
              <div><span className="text-slate-400">Owner</span><p className="font-medium text-slate-700 mt-0.5">{record.owner || "Unassigned"}</p></div>
              <div><span className="text-slate-400">Next Action</span><p className="font-medium text-slate-700 mt-0.5">{record.nextAction || "—"}</p></div>
              <div><span className="text-slate-400">Next Action Date</span><p className="font-medium text-slate-700 mt-0.5">{record.nextActionDate ? new Date(record.nextActionDate).toLocaleDateString() : "—"}</p></div>
            </div>
            {record.note && <div className="mt-3 pt-3 border-t border-slate-50"><span className="text-slate-400 text-xs">Initial Note</span><p className="text-sm text-slate-600 mt-1">{record.note}</p></div>}
          </div>
        </DetailSection>

        <DetailSection number={2} title="Current Stage" icon={GitBranch}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <StageBadge stage={record.stage} />
            <p className="text-xs text-slate-400 mt-2">Use the stage selector above to advance this record through the pipeline.</p>
          </div>
        </DetailSection>

        <DetailSection number={3} title="Related Opportunity" icon={Lightbulb}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {record.signalId ? (
              <Link to={demoLink(`/opportunities/${record.signalId}`)} className="text-sm font-medium text-blue-600 hover:underline">
                {record.entity_name || record.title} →
              </Link>
            ) : (
              <EnginePlaceholder message="The source opportunity will be linked here when the backend provides relationship data." />
            )}
            {record.category && <p className="text-xs text-slate-400 mt-1">Category: {record.category} · Location: {record.location || "N/A"}</p>}
          </div>
        </DetailSection>

        <DetailSection number={4} title="Company" icon={Building2}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {record.companyName ? (
              <div>
                <p className="text-sm font-medium text-slate-900">{record.companyName}</p>
                <p className="text-xs text-slate-400 mt-1">Company ID: {record.companyId || "pending"}</p>
              </div>
            ) : (
              <EnginePlaceholder message="Company will be linked here when the Leads Intelligence Engine provides matched company data." />
            )}
          </div>
        </DetailSection>

        <DetailSection number={5} title="Decision Maker / Lead" icon={User}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {record.personName ? (
              <div>
                <p className="text-sm font-medium text-slate-900">{record.personName}</p>
                <p className="text-xs text-slate-400 mt-1">Person ID: {record.personId || "pending"}{record.leadId ? ` · Lead ID: ${record.leadId}` : ""}</p>
              </div>
            ) : (
              <EnginePlaceholder message="Decision maker will be linked here when the Leads Intelligence Engine provides verified contact data." />
            )}
          </div>
        </DetailSection>

        <DetailSection number={6} title="Intelligence Context" icon={Radar}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <CRMIntelligenceStatus status={record.intelligenceStatus} />
            </div>
            <p className="text-xs text-slate-400">Intelligence context from the source opportunity and linked AI Mission will appear here when the engine evaluates updates.</p>
          </div>
        </DetailSection>

        <DetailSection number={7} title="Supporting Evidence" icon={FileSearch}>
          <EnginePlaceholder message="Source evidence supporting this CRM record will be provided by the Intelligence Engine." />
        </DetailSection>

        <DetailSection number={8} title="Activity Timeline" icon={Clock}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <CRMActivityTimeline activities={activities} />
          </div>
        </DetailSection>

        <DetailSection number={9} title="Tasks" icon={CheckSquare}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <CRMTaskPanel recordId={record.id} tasks={tasks} onChanged={loadAll} />
          </div>
        </DetailSection>

        <DetailSection number={10} title="Meetings" icon={Calendar}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <CRMMeetingPanel recordId={record.id} meetings={meetings} onChanged={loadAll} />
          </div>
        </DetailSection>

        <DetailSection number={11} title="Notes" icon={StickyNote}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <CRMNotesPanel recordId={record.id} notes={notes} onChanged={loadAll} />
          </div>
        </DetailSection>

        <DetailSection number={12} title="AI Assistance" icon={Sparkles}>
          <CRMAssistant record={record} activities={activities} tasks={tasks} meetings={meetings} />
        </DetailSection>

        <DetailSection number={13} title="Related AI Mission" icon={Radar}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {record.missionId ? (
              <Link to={demoLink("/missions")} className="text-sm font-medium text-blue-600 hover:underline">View Mission →</Link>
            ) : (
              <EnginePlaceholder message="Link an AI Mission to monitor intelligence updates connected to this CRM record." />
            )}
          </div>
        </DetailSection>

        <DetailSection number={14} title="Intelligence Monitoring Status" icon={ShieldCheck}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <CRMIntelligenceStatus status={record.intelligenceStatus} />
            <p className="text-xs text-slate-400 mt-2">When the Intelligence Engine detects updates related to this record's linked opportunity or mission, the status will change and a review prompt will appear.</p>
          </div>
        </DetailSection>

        <DetailSection number={15} title="Outcome" icon={Target} defaultOpen={record.stage === "Won" || record.stage === "Lost"}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {record.stage === "Won" || record.stage === "Lost" ? (
              <div className="flex items-center gap-2">
                <StageBadge stage={record.stage} />
                <span className="text-xs text-slate-400">Record outcome recorded on {new Date(record.updatedAt).toLocaleDateString()}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Move this record to Won or Lost to record the final outcome. Continued intelligence monitoring remains active regardless of outcome.</p>
            )}
          </div>
        </DetailSection>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button onClick={handleDelete} className="text-xs font-medium text-rose-400 hover:text-rose-600 transition-colors">
          Delete Record
        </button>
      </div>
    </div>
  );
}