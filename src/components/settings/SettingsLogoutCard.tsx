"use client";

import { LogOut } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/authStore";

export function SettingsLogoutCard() {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <GlassCard className="p-4">
      <button
        type="button"
        onClick={() => void logout()}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/80 transition-colors hover:border-red-400/20 hover:bg-red-500/10 hover:text-white"
      >
        <LogOut size={18} className="shrink-0 text-red-300" />
        <span className="min-w-0 flex-1">{t("settings.logoutBtn")}</span>
      </button>
    </GlassCard>
  );
}
