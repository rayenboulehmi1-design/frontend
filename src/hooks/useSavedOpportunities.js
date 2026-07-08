import { useState, useCallback, useEffect } from "react";
import { useDemoMode } from "@/lib/demoMode";

const PROD_STORAGE = "scouty_saved_opportunities";
const PROD_EVENT = "scouty-saved-change";
const DEMO_STORAGE = "demo_scouty_saved_opportunities";
const DEMO_EVENT = "demo-scouty-saved-change";

export function useSavedOpportunities() {
  const isDemo = useDemoMode();
  const STORAGE_KEY = isDemo ? DEMO_STORAGE : PROD_STORAGE;
  const EVENT = isDemo ? DEMO_EVENT : PROD_EVENT;

  const readSaved = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }, [STORAGE_KEY]);

  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    setSaved(readSaved());
    const handler = () => setSaved(readSaved());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [EVENT, readSaved]);

  const isSaved = useCallback((id) => saved.some((s) => s.id === id), [saved]);

  const toggleSave = useCallback((signal) => {
    const current = readSaved();
    const exists = current.some((s) => s.id === signal.id);
    const next = exists ? current.filter((s) => s.id !== signal.id) : [signal, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, [STORAGE_KEY, EVENT, readSaved]);

  const removeSaved = useCallback((id) => {
    const next = readSaved().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, [STORAGE_KEY, EVENT, readSaved]);

  const bulkSave = useCallback((signals) => {
    const current = readSaved();
    const existingIds = new Set(current.map((s) => s.id));
    const toAdd = signals.filter((s) => !existingIds.has(s.id));
    if (toAdd.length === 0) return;
    const next = [...toAdd, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, [STORAGE_KEY, EVENT, readSaved]);

  const bulkRemove = useCallback((ids) => {
    const idSet = new Set(ids);
    const next = readSaved().filter((s) => !idSet.has(s.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, [STORAGE_KEY, EVENT, readSaved]);

  return { saved, isSaved, toggleSave, removeSaved, bulkSave, bulkRemove, savedCount: saved.length };
}