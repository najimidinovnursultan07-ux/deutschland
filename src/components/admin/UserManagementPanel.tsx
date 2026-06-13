"use client";

import { useAuthStore } from "@/store/authStore";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export function UserManagementPanel() {
  const interfaceLang = useInterfaceLang();
  const users = useAuthStore((s) => s.users);
  const setUserRole = useAuthStore((s) => s.setUserRole);

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUserRole(userId, role);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-3 md:px-6">
        <h2 className="text-lg font-semibold text-white">
          {getUiString(interfaceLang, "userManagement")}
        </h2>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {users.map((u) => (
          <article
            key={u.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <p className="font-medium text-white">{u.name}</p>
            <p className="mt-0.5 break-all text-xs text-white/50">{u.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium",
                  u.role === "MODERATOR"
                    ? "bg-violet-500/20 text-violet-200"
                    : u.role === "ADMIN"
                      ? "bg-amber-500/20 text-amber-200"
                      : "bg-white/10 text-white/60"
                )}
              >
                {u.role}
              </span>
              {u.role === "ADMIN" ? (
                <span className="text-xs text-white/40">—</span>
              ) : (
                <select
                  value={u.role === "MODERATOR" ? "MODERATOR" : "USER"}
                  onChange={(e) =>
                    handleRoleChange(u.id, e.target.value as UserRole)
                  }
                  className="max-w-full rounded-lg border border-white/15 bg-slate-900 px-2 py-1.5 text-xs text-white"
                  aria-label={`${getUiString(interfaceLang, "role")}: ${u.name}`}
                >
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                </select>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-4 py-3 font-medium md:px-6">
                {getUiString(interfaceLang, "name")}
              </th>
              <th className="px-4 py-3 font-medium md:px-6">Email</th>
              <th className="px-4 py-3 font-medium md:px-6">
                {getUiString(interfaceLang, "role")}
              </th>
              <th className="px-4 py-3 font-medium md:px-6">
                {getUiString(interfaceLang, "actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 text-white/80"
              >
                <td className="px-4 py-3 md:px-6">{u.name}</td>
                <td className="max-w-[12rem] truncate px-4 py-3 md:max-w-none md:px-6">
                  {u.email}
                </td>
                <td className="px-4 py-3 md:px-6">
                  <span
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs font-medium",
                      u.role === "MODERATOR"
                        ? "bg-violet-500/20 text-violet-200"
                        : u.role === "ADMIN"
                          ? "bg-amber-500/20 text-amber-200"
                          : "bg-white/10 text-white/60"
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 md:px-6">
                  {u.role === "ADMIN" ? (
                    <span className="text-xs text-white/40">—</span>
                  ) : (
                    <select
                      value={u.role === "MODERATOR" ? "MODERATOR" : "USER"}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as UserRole)
                      }
                      className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1.5 text-xs text-white"
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">MODERATOR</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
