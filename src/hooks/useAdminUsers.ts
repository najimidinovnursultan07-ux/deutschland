"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";
import { canManageUsers } from "@/lib/admin";
import type { DirectoryUser } from "@/types";
import type { UserRole } from "@/types";

export function useAdminUsers() {
  const currentUser = useAuthStore((s) => s.user);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const canManage = canManageUsers(currentUser);
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!canManage) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/users", { credentials: "include" });
      const data = (await res.json().catch(() => null)) as {
        users?: DirectoryUser[];
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? `Failed (${res.status})`);
      }

      setUsers(data?.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  const updateRole = useCallback(
    async (userId: string, role: UserRole) => {
      if (!canManage) return false;

      setUpdatingId(userId);
      setError(null);

      try {
        const res = await apiFetch("/api/users", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role }),
        });

        const data = (await res.json().catch(() => null)) as {
          user?: DirectoryUser;
          error?: string;
        } | null;

        if (!res.ok) {
          throw new Error(data?.error ?? `Failed (${res.status})`);
        }

        if (data?.user) {
          setUsers((prev) =>
            prev.map((u) => (u.id === data.user!.id ? data.user! : u))
          );
          if (currentUser?.id === userId) {
            await fetchSession();
          }
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [canManage, currentUser?.id, fetchSession]
  );

  useEffect(() => {
    if (!canManage) {
      setUsers([]);
      return;
    }
    void refresh();
  }, [canManage, refresh]);

  return {
    canManage,
    users,
    loading,
    updatingId,
    error,
    refresh,
    updateRole,
  };
}
