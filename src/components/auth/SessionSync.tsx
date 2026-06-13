"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { syncAuthSession } from "@/lib/auth/syncSession";

/** Keeps httpOnly session cookie aligned with client auth state for API routes */
export function SessionSync() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncUserFromServer = useAuthStore((s) => s.syncUserFromServer);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      void syncAuthSession(null);
      return;
    }

    void syncAuthSession(user).then((directoryUser) => {
      if (directoryUser) {
        syncUserFromServer(directoryUser);
      }
    });
  }, [isAuthenticated, user, syncUserFromServer]);

  return null;
}
