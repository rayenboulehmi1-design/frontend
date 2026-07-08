import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "scouty_saved_opportunities";
const EVENT = "scouty-saved-change";

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useSavedOpportunities() {
  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    const handler = () => setSaved(readSaved());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isSaved = useCallback((id) => saved.some((s) => s.id === id), [saved]);

  const toggleSave = useCallback((signal) => {
    const current = readSaved();
    const exists = current.some((s) => s.id === signal.id);
    const next = exists ? current.filter((s) => s.id !== signal.id) : [signal, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, []);

  const removeSaved = useCallback((id) => {
    const next = readSaved().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, []);

  const bulkSave = useCallback((signals) => {
    const current = readSaved();
    const existingIds = new Set(current.map((s) => s.id));
    const toAdd = signals.filter((s) => !existingIds.has(s.id));
    if (toAdd.length === 0) return;
    const next = [...toAdd, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, []);

  const bulkRemove = useCallback((ids) => {
    const idSet = new Set(ids);
    const next = readSaved().filter((s) => !idSet.has(s.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setSaved(next);
  }, []);

  return { saved, isSaved, toggleSave, removeSaved, bulkSave, bulkRemove, savedCount: saved.length };
}