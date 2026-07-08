import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Check, Sparkles, Radar } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import UsageMeter from "@/components/entitlement/UsageMeter";
import { NOTIFICATION_CONFIG } from "@/lib/missionUtils";

const EXAMPLE_OBJECTIVES = [
  "Find hotel construction opportunities in Saudi Arabia.",
  "Monitor procurement opportunities for Turkish furniture suppliers.",
  "Detect companies expanding into Qatar that may require logistics partners.",
  "Find renewable energy projects in Africa.",
];

const TOTAL_STEPS = 4;

function parseCommaList(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CreateMissionWizard({ open, onClose, prefill = null }) {
  const { createMission, missions } = useMissions();
  const { tier, checkAccess, plan } = useEntitlement();
  const missionsAccess = checkAccess("missions");
  const missionsLimit = plan?.features?.missions?.limit;

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [industry, setIndustry] = useState("");
  const [countries, setCountries] = useState("");
  const [regions, setRegions] = useState("");
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [excludedKeywords, setExcludedKeywords] = useState("");
  const [companyNames, setCompanyNames] = useState("");
  const [opportunityTypes, setOpportunityTypes] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);
  const [notificationPref, setNotificationPref] = useState("immediate");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (open && prefill) {
      setName("");
      setObjective(prefill.objective || "");
      setIndustry(prefill.industry || "");
      setCountries(prefill.countries?.join(", ") || "");
      setCategories(prefill.categories || []);
      setKeywords(prefill.keywords?.join(", ") || "");
      setStep(0);
    } else if (open) {
      setName("");
      setObjective("");
      setIndustry("");
      setCountries("");
      setRegions("");
      setCategories([]);
      setKeywords("");
      setExcludedKeywords("");
      setCompanyNames("");
      setOpportunityTypes("");
      setMinConfidence(0);
      setNotificationPref("immediate");
      setPriority("medium");
      setStep(0);
    }
  }, [open, prefill]);

  const canCreate = missionsAccess !== "LOCKED" && (missionsLimit == null || missions.length < missionsLimit);

  const handleCreate = () => {
    const mission = createMission({
      name: name.trim(),
      objective: objective.trim(),
      industry: industry.trim(),
      countries: parseCommaList(countries),
      regions: parseCommaList(regions),
      categories,
      keywords: parseCommaList(keywords),
      excluded_keywords: parseCommaList(excludedKeywords),
      company_names: parseCommaList(companyNames),
      opportunity_types: parseCommaList(opportunityTypes),
      min_confidence: minConfidence,
      notification_preference: notificationPref,
      priority_level: priority,
      plan_owner: tier,
      source_opportunity_id: prefill?.source_opportunity_id || null,
    });
    onClose();
    return mission;
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0 && objective.trim().length > 0;
    return true;
  };

  const toggleCategory = (cat) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Radar className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-xl">Create AI Mission</DialogTitle>
          </div>
          <DialogDescription>
            Define a business objective and ScoutyGo will continuously search for matching opportunities.
          </DialogDescription>
        </DialogHeader>

        {/* Plan limit check */}
        {!canCreate && missionsAccess === "LOCKED" ? (
          <LockedFeature featureKey="missions" title="AI Missions" description="AI Missions are available on Pro and higher plans. Upgrade to start creating autonomous intelligence objectives.">
            <div className="h-8" />
          </LockedFeature>
        ) : !canCreate ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-center">
            <p className="text-sm font-semibold text-rose-600 mb-1">Mission limit reached</p>
            <p className="text-xs text-rose-400 mb-3">Your {tier} plan allows {missionsLimit} active AI Mission(s). Upgrade to create more.</p>
            <Button size="sm" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            {/* Usage meter for limited plans */}
            {missionsLimit != null && (
              <div className="mb-4">
                <UsageMeter label="Mission slots" used={missions.length} limit={missionsLimit} icon={Radar} />
              </div>
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                      i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < TOTAL_STEPS - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? "bg-blue-600" : "bg-slate-100"}`} />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Name & Objective */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mission-name">Mission Name</Label>
                  <Input id="mission-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hotel Expansion GCC" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="mission-objective">Describe your objective</Label>
                  <Textarea
                    id="mission-objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. Find hotel construction opportunities in Saudi Arabia."
                    className="mt-1 min-h-[120px] resize-none"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-slate-400">Examples:</p>
                    {EXAMPLE_OBJECTIVES.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setObjective(ex)}
                        className="block text-xs text-blue-600 hover:underline text-left"
                      >
                        "{ex}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Optional Filters */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optional — refine the mission to improve precision</span>
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Hospitality, Construction, Logistics" className="mt-1" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="countries">Countries</Label>
                    <Input id="countries" value={countries} onChange={(e) => setCountries(e.target.value)} placeholder="Saudi Arabia, UAE, Qatar" className="mt-1" />
                    <p className="text-[10px] text-slate-400 mt-1">Separate with commas</p>
                  </div>
                  <div>
                    <Label htmlFor="regions">Regions</Label>
                    <Input id="regions" value={regions} onChange={(e) => setRegions(e.target.value)} placeholder="GCC, East Africa, Southeast Asia" className="mt-1" />
                    <p className="text-[10px] text-slate-400 mt-1">Separate with commas</p>
                  </div>
                </div>
                <div>
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Real Estate", "Investment", "Business"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          categories.includes(cat) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="hotel, construction, tender" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="excluded">Excluded Keywords</Label>
                    <Input id="excluded" value={excludedKeywords} onChange={(e) => setExcludedKeywords(e.target.value)} placeholder="residential, retrofit" className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companies">Company Names</Label>
                    <Input id="companies" value={companyNames} onChange={(e) => setCompanyNames(e.target.value)} placeholder="Hilton, Marriott, Accor" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="opp-types">Opportunity Types</Label>
                    <Input id="opp-types" value={opportunityTypes} onChange={(e) => setOpportunityTypes(e.target.value)} placeholder="Expansion, Franchise, Tender" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Minimum Confidence: <span className="font-bold text-blue-600">{minConfidence}%</span></Label>
                  <Slider value={[minConfidence]} onValueChange={(v) => setMinConfidence(v[0])} max={100} step={5} className="mt-2" />
                </div>
              </div>
            )}

            {/* Step 3: Notifications & Priority */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <Label>Notification Preference</Label>
                  <RadioGroup value={notificationPref} onValueChange={setNotificationPref} className="mt-2 space-y-2">
                    {Object.entries(NOTIFICATION_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <label
                          key={key}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            notificationPref === key ? "border-blue-300 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <RadioGroupItem value={key} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-sm font-medium text-slate-900">{config.label}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </RadioGroup>
                  <p className="text-[10px] text-slate-300 mt-2">
                    Future channels: Email, Push, Slack, Microsoft Teams
                  </p>
                </div>
                <div>
                  <Label>Priority Level</Label>
                  <RadioGroup value={priority} onValueChange={setPriority} className="mt-2 flex gap-2">
                    {[
                      { key: "low", label: "Low", color: "text-slate-500" },
                      { key: "medium", label: "Medium", color: "text-amber-500" },
                      { key: "high", label: "High", color: "text-rose-500" },
                    ].map((p) => (
                      <label
                        key={p.key}
                        className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          priority === p.key ? "border-blue-300 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <RadioGroupItem value={p.key} />
                        <span className={`text-sm font-medium ${p.color}`}>{p.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Mission Name</p>
                    <p className="text-sm font-semibold text-slate-900">{name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Objective</p>
                    <p className="text-sm text-slate-700">{objective || "—"}</p>
                  </div>
                  {(industry || countries || keywords || categories.length > 0 || minConfidence > 0) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Filters</p>
                      <div className="flex flex-wrap gap-1.5">
                        {industry && <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs border border-slate-100">Industry: {industry}</span>}
                        {countries && <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs border border-slate-100">{countries}</span>}
                        {keywords && <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs border border-slate-100">Keywords: {keywords}</span>}
                        {categories.map((c) => <span key={c} className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs border border-slate-100">{c}</span>)}
                        {minConfidence > 0 && <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs border border-slate-100">Min Confidence: {minConfidence}%</span>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Notifications</p>
                      <p className="text-sm text-slate-700">{NOTIFICATION_CONFIG[notificationPref]?.label}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Priority</p>
                      <p className="text-sm text-slate-700 capitalize">{priority}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-blue-50/50 border border-blue-100 p-3">
                  <Radar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Once created, the ScoutyGo Intelligence Engine will continuously scan for opportunities matching this objective. You can pause, edit, or archive at any time.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => (step === 0 ? onClose() : setStep(step - 1))} disabled={false}>
                <ChevronLeft className="w-4 h-4" /> {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < TOTAL_STEPS - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                  <Radar className="w-4 h-4" /> Create AI Mission
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}