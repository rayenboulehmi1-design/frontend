import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GitBranch, Loader2, Check, AlertCircle } from "lucide-react";
import { CRM_STAGES, PRIORITIES } from "@/lib/crmConfig";
import { createRecord } from "@/lib/crmStore";
import { useDemoLink } from "@/lib/demoMode";

export default function AddToCRMDialog({ open, onOpenChange, opportunity, lead, missionId, onSaved }) {
  const demoLink = useDemoLink();
  const [stage, setStage] = useState("Discovered");
  const [priority, setPriority] = useState("medium");
  const [note, setNote] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    if (open) {
      setStage("Discovered");
      setPriority("medium");
      setNote("");
      setNextAction("");
      setNextActionDate("");
      setSaving(false);
      setSaved(false);
      setSavedId(null);
    }
  }, [open]);

  const title = lead?.title || opportunity?.title || "CRM Record";
  const companyName = lead?.company?.companyName || lead?.companyName || "";
  const personName = lead?.decisionMaker?.fullName || lead?.personName || "";

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const record = createRecord({
        signalId: opportunity?.id || lead?.opportunityId || null,
        title,
        category: opportunity?.category || "",
        location: opportunity?.location || "",
        entity_name: opportunity?.entity_name || "",
        confidence: opportunity?.confidence || null,
        stage,
        priority,
        note,
        nextAction,
        nextActionDate,
        companyId: lead?.company?.companyId || lead?.companyId || null,
        companyName,
        personId: lead?.decisionMaker?.personId || lead?.personId || null,
        personName,
        leadId: lead?.leadId || lead?.id || null,
        missionId: missionId || lead?.missionId || null,
      });
      setSaving(false);
      setSaved(true);
      setSavedId(record.id);
      window.dispatchEvent(new Event("crm-updated"));
      if (onSaved) onSaved(record);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-600" /> Add to CRM
          </DialogTitle>
          <DialogDescription>
            Create a CRM record linked to this {lead ? "verified lead" : "opportunity"}.
          </DialogDescription>
        </DialogHeader>

        {saved ? (
          <div className="py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Record Added to CRM</p>
            <p className="text-xs text-slate-400 mt-1">"{title}" is now in your pipeline at stage {stage}.</p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-medium text-slate-700">{title}</p>
              {(companyName || personName) && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {companyName}{companyName && personName ? " · " : ""}{personName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Initial Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400 bg-white">
                {CRM_STAGES.filter((s) => s !== "Won" && s !== "Lost").map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400 bg-white capitalize">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Next Action (optional)</label>
              <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="e.g. Send introductory email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Next Action Date (optional)</label>
              <input type="date" value={nextActionDate} onChange={(e) => setNextActionDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an initial note..." className="w-full min-h-[60px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400 resize-none" />
            </div>
          </div>
        )}

        <DialogFooter>
          {saved ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={() => { onOpenChange(false); window.location.href = savedId ? demoLink(`/crm/${savedId}`) : demoLink("/crm"); }}>
                View Record
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <GitBranch className="w-4 h-4 mr-1" />}
                {saving ? "Saving..." : "Add to CRM"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}