import { useState, useEffect, useCallback } from "react";
import { useDemoMode } from "@/lib/demoMode";

const STORAGE_KEY = "scouty_missions";
const DEMO_STORAGE_KEY = "scouty_demo_missions";

function loadMissions(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveMissions(key, missions) {
  try {
    localStorage.setItem(key, JSON.stringify(missions));
  } catch (e) {
    console.error("Failed to save missions:", e);
  }
}

function generateId() {
  return `mission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function addActivity(mission, type, description, opportunityId = null) {
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    description,
    timestamp: new Date().toISOString(),
    opportunity_id: opportunityId,
  };
}

export function useMissions() {
  const isDemo = useDemoMode();
  const storageKey = isDemo ? DEMO_STORAGE_KEY : STORAGE_KEY;
  const [missions, setMissions] = useState(() => loadMissions(storageKey));

  useEffect(() => {
    setMissions(loadMissions(storageKey));
  }, [storageKey]);

  const persist = useCallback(
    (newMissions) => {
      setMissions(newMissions);
      saveMissions(storageKey, newMissions);
    },
    [storageKey]
  );

  const createMission = useCallback(
    (data) => {
      const now = new Date().toISOString();
      const mission = {
        id: generateId(),
        name: data.name || "Untitled Mission",
        objective: data.objective || "",
        industry: data.industry || "",
        countries: data.countries || [],
        regions: data.regions || [],
        categories: data.categories || [],
        keywords: data.keywords || [],
        excluded_keywords: data.excluded_keywords || [],
        company_names: data.company_names || [],
        opportunity_types: data.opportunity_types || [],
        min_confidence: data.min_confidence || 0,
        status: "running",
        priority_level: data.priority_level || "medium",
        notification_preference: data.notification_preference || "immediate",
        created_date: now,
        last_scan: now,
        last_match: null,
        matches_found: 0,
        saved_opportunities: 0,
        plan_owner: data.plan_owner || "",
        source_opportunity_id: data.source_opportunity_id || null,
        activity: [addActivity(null, "created", "Mission created")],
      };
      persist([...missions, mission]);
      return mission;
    },
    [missions, persist]
  );

  const updateMission = useCallback(
    (id, updates) => {
      let updatedMission = null;
      const newMissions = missions.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        const activityEntries = [];
        if (updates.status && updates.status !== m.status) {
          const desc = {
            paused: "Mission paused",
            running: "Mission resumed",
            completed: "Mission completed",
            archived: "Mission archived",
          }[updates.status] || "Mission updated";
          activityEntries.push(addActivity(null, updates.status, desc));
        } else if (Object.keys(updates).some((k) => !["last_scan", "last_match", "matches_found", "saved_opportunities"].includes(k))) {
          activityEntries.push(addActivity(null, "updated", "Mission updated"));
        }
        if (activityEntries.length > 0) {
          updated.activity = [...(m.activity || []), ...activityEntries];
        }
        updatedMission = updated;
        return updated;
      });
      persist(newMissions);
      return updatedMission;
    },
    [missions, persist]
  );

  const deleteMission = useCallback(
    (id) => {
      persist(missions.filter((m) => m.id !== id));
    },
    [missions, persist]
  );

  const duplicateMission = useCallback(
    (id) => {
      const original = missions.find((m) => m.id === id);
      if (!original) return null;
      const now = new Date().toISOString();
      const copy = {
        ...original,
        id: generateId(),
        name: `${original.name} (Copy)`,
        status: "paused",
        created_date: now,
        last_scan: now,
        last_match: null,
        matches_found: 0,
        saved_opportunities: 0,
        activity: [addActivity(null, "created", "Mission duplicated from existing mission")],
      };
      persist([...missions, copy]);
      return copy;
    },
    [missions, persist]
  );

  const pauseMission = useCallback((id) => updateMission(id, { status: "paused" }), [updateMission]);
  const resumeMission = useCallback((id) => updateMission(id, { status: "running" }), [updateMission]);
  const archiveMission = useCallback((id) => updateMission(id, { status: "archived" }), [updateMission]);

  const getMission = useCallback((id) => missions.find((m) => m.id === id), [missions]);

  const activeMissions = missions.filter((m) => m.status !== "archived");
  const archivedMissions = missions.filter((m) => m.status === "archived");

  return {
    missions: activeMissions,
    archivedMissions,
    allMissions: missions,
    getMission,
    createMission,
    updateMission,
    deleteMission,
    duplicateMission,
    pauseMission,
    resumeMission,
    archiveMission,
  };
}