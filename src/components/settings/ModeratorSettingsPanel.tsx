"use client";

import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { UserSuggestionsInbox } from "@/components/admin/UserSuggestionsInbox";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAuthStore } from "@/store/authStore";
import { isAuthorizedToViewSuggestions } from "@/lib/suggestions/auth";

/** Block A — moderators and root admin only */
export function ModeratorSettingsPanel() {
  const interfaceLang = useInterfaceLang();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthorized = isAuthorizedToViewSuggestions(currentUser);

  if (!isAuthorized) return null;

  return (
    <div className="space-y-4">
      <GlassCard className="border-violet-400/20 bg-violet-500/5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-violet-100">
          <ShieldCheck size={18} className="shrink-0" />
          {getUiString(interfaceLang, "moderatorPanel")}
        </h2>
      </GlassCard>

      <UserSuggestionsInbox />
    </div>
  );
}
