import { useState, useCallback, useEffect } from "react";
import { useDemoMode } from "@/lib/demoMode";

const PROD_STORAGE = "scouty_alerts";
const PROD_EVENT = "scouty-alerts-change";
const DEMO_STORAGE = "demo_scouty_alerts";
const DEMO_EVENT = "demo-scouty-alerts-change";

export function useAlerts() {
  const isDemo = useDemoMode();
  const STORAGE_KEY = isDemo ? DEMO_STORAGE : PROD_STORAGE;
  const EVENT = isDemo ? DEMO_EVENT : PROD_EVENT;

  const readAlerts = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }, [STORAGE_KEY]);

  const [alerts, setAlerts] = useState(readAlerts);

  useEffect(() => {
    setAlerts(readAlerts());
    const handler = () => setAlerts(readAlerts());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [EVENT, readAlerts]);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setAlerts(next);
  }, [STORAGE_KEY, EVENT]);

  const createAlert = useCallback((data) => {
    const alert = {
      id: Date.now().toString(),
      name: data.name || "Untitled Alert",
      category: data.category || "",
      location: data.location || "",
      keywords: data.keywords || "",
      minConfidence: data.minConfidence ?? 50,
      createdAt: new Date().toISOString(),
    };
    persist([alert, ...readAlerts()]);
    return alert;
  }, [persist, readAlerts]);

  const deleteAlert = useCallback((id) => {
    persist(readAlerts().filter((a) => a.id !== id));
  }, [persist, readAlerts]);

  return { alerts, createAlert, deleteAlert };
}