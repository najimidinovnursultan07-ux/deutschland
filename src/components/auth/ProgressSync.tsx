"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

function progressFingerprint(
  xp: number,
  dailyXp: number,
  passedLessonCount: number,
  name: string,
  avatarUrl: string
): string {
  return `${xp}|${dailyXp}|${passedLessonCount}|${name}|${avatarUrl}`;
}

/** Pushes real XP / lesson progress to the server for the global leaderboard */
export function ProgressSync() {
  const userId = useAuthStore((s) => s.user?.id);
  const userName = useAuthStore((s) => s.user?.name);
  const userAvatar = useAuthStore((s) => s.user?.avatarUrl);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const xp = useAppStore((s) => s.xp);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const passedLessonCount = useAppStore((s) => s.passedQuizLessonIds.length);

  const lastSyncedRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !userId ||
      !userName ||
      userAvatar === undefined
    ) {
      lastSyncedRef.current = null;
      return;
    }

    const key = progressFingerprint(
      xp,
      dailyXp,
      passedLessonCount,
      userName,
      userAvatar
    );

    if (lastSyncedRef.current === key || inFlightRef.current) {
      return;
    }

    // Skip sync for inactive accounts (no lessons, no XP)
    if (xp <= 0 && passedLessonCount <= 0) {
      lastSyncedRef.current = key;
      return;
    }

    inFlightRef.current = true;
    let cancelled = false;

    void fetch("/api/progress/sync", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        avatarUrl: userAvatar,
        xp,
        dailyXp,
        passedLessonCount,
      }),
    })
      .then((res) => {
        if (!cancelled && res.ok) {
          lastSyncedRef.current = key;
        }
      })
      .finally(() => {
        inFlightRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    userId,
    userName,
    userAvatar,
    xp,
    dailyXp,
    passedLessonCount,
  ]);

  return null;
}
