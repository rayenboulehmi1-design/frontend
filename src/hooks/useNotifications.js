import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "scouty_notifications";
const EVENT = "scouty-notifications-change";

function readNotifications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(readNotifications);

  useEffect(() => {
    const handler = () => setNotifications(readNotifications());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 50)));
    window.dispatchEvent(new Event(EVENT));
    setNotifications(next);
  }, []);

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
  }, [persist]);

  const dismiss = useCallback((id) => {
    persist(readNotifications().filter((n) => n.id !== id));
  }, [persist]);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const markAllRead = useCallback(() => {
    persist(readNotifications().map((n) => ({ ...n, read: true })));
  }, [persist]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, addNotification, dismiss, clearAll, markAllRead, unreadCount };
}