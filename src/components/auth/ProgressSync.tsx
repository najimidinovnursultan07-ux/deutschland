"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

/** Debounced full progress sync to the server */
export function ProgressSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const exportPersistedState = useAppStore((s) => s.exportPersistedState);

  const snapshot = useAppStore((s) =>
    JSON.stringify({
      xp: s.xp,
      dailyXp: s.dailyXp,
      passed: s.passedQuizLessonIds.length,
      hearts: s.hearts,
      streak: s.streak,
      pair: s.languagePair,
      level: s.selectedLevel,
      session: s.activeLessonSession?.lessonId ?? null,
      settings: s.settings,
    })
  );

  const lastSyncedRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) {
      lastSyncedRef.current = null;
      return;
    }

    if (lastSyncedRef.current === snapshot) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const state = exportPersistedState();
      void fetch("/api/progress", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      }).then((res) => {
        if (res.ok) lastSyncedRef.current = snapshot;
      });
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hydrated, isAuthenticated, snapshot, exportPersistedState]);

  return null;
}
