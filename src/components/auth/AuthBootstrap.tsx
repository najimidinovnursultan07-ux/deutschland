"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import type { PersistedAppState } from "@/lib/progress/appStateRepository";

/** Loads session + cloud progress after authentication */
export function AuthBootstrap() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const hydrateFromServer = useAppStore((s) => s.hydrateFromServer);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    void fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      resetProgress();
      return;
    }

    let cancelled = false;

    void apiFetch("/api/progress", { credentials: "include", cache: "no-store" })
      .then(async (res) => {
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { state: PersistedAppState | null };
        if (data.state) {
          hydrateFromServer(data.state);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, hydrateFromServer, resetProgress]);

  return null;
}
