"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { LeaderboardEntry } from "@/types";

export interface LeaderboardRow extends LeaderboardEntry {
  rank: number;
  isCurrentUser: boolean;
}

export function useLeaderboard(currentUserId?: string | null) {
  const [entries, setEntries] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/leaderboard", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as {
        entries?: LeaderboardEntry[];
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? `Failed (${res.status})`);
      }

      const rows = (data?.entries ?? []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentUser: currentUserId ? entry.id === currentUserId : false,
      }));

      setEntries(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { entries, loading, error, refresh };
}
