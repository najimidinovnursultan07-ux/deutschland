const LAST_REMINDER_KEY = "lingua:last-study-reminder";
const REMINDER_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours

export const STUDY_REMINDER_MESSAGE =
  "Тил үйрөнүү убактысы келди! Кирип, билимиңизди тереңдетиңиз. 🚀";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function shouldFireStudyReminder(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(LAST_REMINDER_KEY);
  if (!raw) return true;
  const last = Number(raw);
  if (Number.isNaN(last)) return true;
  return Date.now() - last >= REMINDER_INTERVAL_MS;
}

export function markStudyReminderFired(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_REMINDER_KEY, String(Date.now()));
}

export function showStudyReminderNotification(): boolean {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return false;
  }

  try {
    new Notification("LinguaBridge", {
      body: STUDY_REMINDER_MESSAGE,
      icon: "/icon-192x192.png",
      tag: "lingua-study-reminder",
    });
    markStudyReminderFired();
    return true;
  } catch {
    return false;
  }
}

export function maybeFireStudyReminder(): boolean {
  if (!shouldFireStudyReminder()) return false;
  return showStudyReminderNotification();
}

/** Register SW message listener for background tick checks */
export async function registerReminderServiceWorkerBridge(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: "LINGUA_REMINDER_CHECK" });
  } catch {
    /* optional */
  }
}
