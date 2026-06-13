"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { syncAuthSession } from "@/lib/auth/syncSession";

function sessionFingerprint(
  id: string,
  email: string,
  role: string,
  name: string
): string {
  return `${id}|${email}|${role}|${name}`;
}

/** Keeps httpOnly session cookie aligned with client auth — syncs only when identity fields change */
export function SessionSync() {
  const userId = useAuthStore((s) => s.user?.id);
  const userEmail = useAuthStore((s) => s.user?.email);
  const userRole = useAuthStore((s) => s.user?.role);
  const userName = useAuthStore((s) => s.user?.name);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const lastSyncedRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !userId || !userEmail || !userRole || !userName) {
      if (lastSyncedRef.current !== null) {
        lastSyncedRef.current = null;
        void syncAuthSession(null);
      }
      return;
    }

    const key = sessionFingerprint(userId, userEmail, userRole, userName);

    if (lastSyncedRef.current === key || inFlightRef.current) {
      return;
    }

    const user = useAuthStore.getState().user;
    if (!user) return;

    inFlightRef.current = true;
    let cancelled = false;

    void syncAuthSession(user)
      .then((directoryUser) => {
        if (cancelled) return;

        if (directoryUser) {
          useAuthStore.getState().syncUserFromServer(directoryUser);
        }

        const current = useAuthStore.getState().user;
        lastSyncedRef.current = current
          ? sessionFingerprint(
              current.id,
              current.email,
              current.role,
              current.name
            )
          : key;
      })
      .finally(() => {
        inFlightRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId, userEmail, userRole, userName]);

  return null;
}
