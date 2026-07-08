import { useState, useCallback, useEffect } from "react";
import { useDemoMode } from "@/lib/demoMode";

const PROD_STORAGE = "scouty_notifications";
const PROD_EVENT = "scouty-notifications-change";
const DEMO_STORAGE = "demo_scouty_notifications";
const DEMO_EVENT = "demo-scouty-notifications-change";

export function useNotifications() {
  const isDemo = useDemoMode();
  const STORAGE_KEY = isDemo ? DEMO_STORAGE : PROD_STORAGE;
  const EVENT = isDemo ? DEMO_EVENT : PROD_EVENT;

  const readNotifications = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }, [STORAGE_KEY]);

  const [notifications, setNotifications] = useState(readNotifications);

  useEffect(() => {
    setNotifications(readNotifications());
    const handler = () => setNotifications(readNotifications());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [EVENT, readNotifications]);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 50)));
    window.dispatchEvent(new Event(EVENT));
    setNotifications(next);
  }, [STORAGE_KEY, EVENT]);

  const addNotification = useCallback((deal) => {
    const current = readNotifications();
    if (current.some((n) => n.dealId === deal.id)) return;
    const notif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dealId: deal.id,
      company: deal.company || deal.entity_name || deal.title,
      country: deal.country || deal.location,
      confidence: deal.confidence,
      type: deal.type || deal.category,
      receivedAt: new Date().toISOString(),
      read: false,
    };
    persist([notif, ...current]);
  }, [persist, readNotifications]);

  const dismiss = useCallback((id) => {
    persist(readNotifications().filter((n) => n.id !== id));
  }, [persist, readNotifications]);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const markAllRead = useCallback(() => {
    persist(readNotifications().map((n) => ({ ...n, read: true })));
  }, [persist, readNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, addNotification, dismiss, clearAll, markAllRead, unreadCount };
}