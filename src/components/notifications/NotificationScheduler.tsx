"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/appStore";
import {
  maybeFireStudyReminder,
  registerReminderServiceWorkerBridge,
} from "@/lib/notifications/reminderEngine";

const CHECK_INTERVAL_MS = 60_000;

/** Polls every minute + on visibility change for 5-hour study reminders */
export function NotificationScheduler() {
  const dailyReminders = useAppStore((s) => s.settings.dailyReminders);
  const systemNotifications = useAppStore((s) => s.settings.systemNotifications);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remindersEnabled = dailyReminders || systemNotifications;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!remindersEnabled) return;

    const tick = () => {
      maybeFireStudyReminder();
      void registerReminderServiceWorkerBridge();
    };

    tick();
    timerRef.current = setInterval(tick, CHECK_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [remindersEnabled]);

  return null;
}
