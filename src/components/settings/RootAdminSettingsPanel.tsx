"use client";

import { Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAuthStore } from "@/store/authStore";
import { isRootAdmin } from "@/lib/admin";

/** Block B — root creator only; hidden from moderators */
export function RootAdminSettingsPanel() {
  const interfaceLang = useInterfaceLang();
  const currentUser = useAuthStore((s) => s.user);

  if (!currentUser || !isRootAdmin(currentUser.email)) return null;

  return (
    <div className="space-y-4">
      <GlassCard className="border-amber-400/20 bg-amber-500/5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-100">
          <Shield size={18} className="shrink-0" />
          {getUiString(interfaceLang, "rootAdminPanel")}
        </h2>
        <p className="mt-1 text-sm text-white/50">
          {getUiString(interfaceLang, "roleManagementHint")}
        </p>
      </GlassCard>

      <UserManagementPanel />
    </div>
  );
}
