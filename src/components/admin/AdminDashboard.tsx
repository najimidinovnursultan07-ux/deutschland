"use client";

import { useAuthStore } from "@/store/authStore";
import { canManageUsers } from "@/lib/admin";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { PageContainer } from "@/components/layout/PageContainer";
import { UserManagementPanel } from "./UserManagementPanel";

export function AdminDashboard() {
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const canManage = canManageUsers(user);

  if (!canManage) {
    return null;
  }

  return (
    <PageContainer className="space-y-8 py-6">
      <header>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {getUiString(interfaceLang, "adminDashboard")}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {getUiString(interfaceLang, "adminSubtitle")}
        </p>
      </header>

      <UserManagementPanel />
    </PageContainer>
  );
}
