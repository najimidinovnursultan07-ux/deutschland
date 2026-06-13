"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { isAuthorizedToViewSuggestions } from "@/lib/suggestions/auth";
import type { UserSuggestion } from "@/types";

export function useSuggestionsInbox() {
  const currentUser = useAuthStore((s) => s.user);
  const isAuthorized = isAuthorizedToViewSuggestions(currentUser);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthorized) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/suggestions", {
        credentials: "include",
        cache: "no-store",
      });

      const data = (await res.json().catch(() => null)) as {
        suggestions?: UserSuggestion[];
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? `Failed (${res.status})`);
      }

      setSuggestions(data?.suggestions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (!isAuthorized) {
      setSuggestions([]);
      setError(null);
      return;
    }
    void refresh();
  }, [isAuthorized, refresh]);

  return {
    currentUser,
    isAuthorized,
    suggestions,
    loading,
    error,
    refresh,
  };
}
