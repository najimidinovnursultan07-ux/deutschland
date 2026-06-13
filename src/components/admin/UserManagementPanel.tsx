"use client";

import { RefreshCw, Shield } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { isRootAdmin } from "@/lib/admin";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "bg-white/10 text-white/70",
  MODERATOR: "bg-violet-500/25 text-violet-200 ring-1 ring-violet-400/30",
  ADMIN: "bg-amber-500/25 text-amber-200 ring-1 ring-amber-400/30",
};

function RoleSelect({
  value,
  disabled,
  onChange,
  label,
}: {
  value: UserRole;
  disabled?: boolean;
  onChange: (role: UserRole) => void;
  label: string;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as UserRole)}
      aria-label={label}
      className={cn(
        "min-w-[9.5rem] cursor-pointer appearance-none rounded-xl border border-violet-400/40",
        "bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-inner",
        "bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat",
        "focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%23c4b5fd%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E')]"
      )}
    >
      <option value="USER" className="bg-slate-900 text-white">
        USER
      </option>
      <option value="MODERATOR" className="bg-slate-900 text-white">
        MODERATOR
      </option>
    </select>
  );
}

function UserRow({
  name,
  email,
  role,
  isUpdating,
  canEdit,
  onRoleChange,
  interfaceLang,
}: {
  name: string;
  email: string;
  role: UserRole;
  isUpdating: boolean;
  canEdit: boolean;
  onRoleChange: (role: UserRole) => void;
  interfaceLang: "ky" | "ru";
}) {
  return (
  <>
    <td className="px-4 py-3 md:px-6">
      <p className="font-medium text-white">{name}</p>
    </td>
    <td className="px-4 py-3 md:px-6">
      <p className="break-all text-white/80">{email}</p>
    </td>
    <td className="px-4 py-3 md:px-6">
      <span
        className={cn(
          "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
          ROLE_STYLES[role]
        )}
      >
        {role}
      </span>
    </td>
    <td className="px-4 py-3 md:px-6">
      {canEdit ? (
        <RoleSelect
          value={role === "MODERATOR" ? "MODERATOR" : "USER"}
          disabled={isUpdating}
          onChange={onRoleChange}
          label={`${getUiString(interfaceLang, "role")}: ${name}`}
        />
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-amber-300/80">
          <Shield size={14} />
          {interfaceLang === "ky" ? "Админ" : "Админ"}
        </span>
      )}
    </td>
  </>
  );
}

export function UserManagementPanel() {
  const interfaceLang = useInterfaceLang();
  const { users, loading, updatingId, error, refresh, updateRole, canManage } =
    useAdminUsers();

  if (!canManage) return null;

  const handleRoleChange = (userId: string, role: UserRole) => {
    void updateRole(userId, role);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
        <h2 className="text-lg font-semibold text-white">
          {getUiString(interfaceLang, "userManagement")}
        </h2>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {interfaceLang === "ky" ? "Жаңыртуу" : "Обновить"}
        </button>
      </div>

      {error && (
        <p className="border-b border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 md:px-6">
          {error}
        </p>
      )}

      {loading && users.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-white/40 md:px-6">
          …
        </p>
      ) : users.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-white/40 md:px-6">
          {interfaceLang === "ky"
            ? "Колдонуучулар азырынча катталган жок"
            : "Пользователи ещё не зарегистрированы"}
        </p>
      ) : (
        <>
          <div className="space-y-3 p-4 md:hidden">
            {users.map((u) => {
              const isAdmin = isRootAdmin(u.email);
              const isUpdating = updatingId === u.id;
              return (
                <article
                  key={u.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-medium text-white">{u.name}</p>
                  <p className="mt-0.5 break-all text-xs text-white/50">
                    {u.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-lg px-2 py-1 text-xs font-medium",
                        ROLE_STYLES[u.role]
                      )}
                    >
                      {u.role}
                    </span>
                    {!isAdmin && (
                      <RoleSelect
                        value={u.role === "MODERATOR" ? "MODERATOR" : "USER"}
                        disabled={isUpdating}
                        onChange={(role) => handleRoleChange(u.id, role)}
                        label={`${getUiString(interfaceLang, "role")}: ${u.name}`}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-0 text-left text-sm">
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
                    <UserRow
                      name={u.name}
                      email={u.email}
                      role={u.role}
                      isUpdating={updatingId === u.id}
                      canEdit={!isRootAdmin(u.email)}
                      onRoleChange={(role) => handleRoleChange(u.id, role)}
                      interfaceLang={interfaceLang}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
