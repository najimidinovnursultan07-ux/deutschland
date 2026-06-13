"use client";

import {
  Bell,
  Smartphone,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Toggle } from "@/components/ui/Toggle";
import { LanguagePairSwitcher } from "@/components/layout/LanguagePairSwitcher";
import { SupportAccordion } from "./SupportAccordion";
import { SuggestionForm } from "./SuggestionForm";
import { RootAdminSettingsPanel } from "./RootAdminSettingsPanel";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import {
  getTargetLangFromPair,
  useAppStore,
} from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { isRootAdmin } from "@/lib/admin";
import type { LanguagePair, Theme } from "@/types";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const interfaceLang = useInterfaceLang();
  const currentUser = useAuthStore((s) => s.user);
  const settings = useAppStore((s) => s.settings);
  const languagePair = useAppStore((s) => s.languagePair);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setLanguagePair = useAppStore((s) => s.setLanguagePair);

  const showRootAdminPanel =
    !!currentUser && isRootAdmin(currentUser.email);

  const setInterfaceBase = (base: "ky" | "ru") => {
    const target = getTargetLangFromPair(languagePair);
    setLanguagePair(`${base}-${target}` as LanguagePair);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {getUiString(interfaceLang, "settings")}
      </h1>

      <GlassCard>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
          <Bell size={18} />
          {getUiString(interfaceLang, "notifications")}
        </h2>
        <Toggle
          enabled={settings.dailyReminders}
          onChange={(v) => updateSettings({ dailyReminders: v })}
          label={getUiString(interfaceLang, "dailyReminders")}
        />
        <Toggle
          enabled={settings.achievementSounds}
          onChange={(v) => updateSettings({ achievementSounds: v })}
          label={getUiString(interfaceLang, "achievementSounds")}
        />
        <Toggle
          enabled={settings.systemNotifications}
          onChange={(v) => updateSettings({ systemNotifications: v })}
          label={getUiString(interfaceLang, "systemNotifications")}
        />
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Globe size={18} />
          {getUiString(interfaceLang, "preferences")}
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-white/80">
            {getUiString(interfaceLang, "interfaceLanguage")}
          </label>
          <p className="mb-2 text-xs text-white/40">
            {getUiString(interfaceLang, "uiFollowsPair")}
          </p>
          <div className="flex gap-2">
            {(["ky", "ru"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setInterfaceBase(lang)}
                className={cn(
                  "min-w-0 flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
                  interfaceLang === lang
                    ? "border-violet-400 bg-violet-500/30 text-white"
                    : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {lang === "ky" ? "🇰🇬 Кыргызча" : "🇷🇺 Русский"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <LanguagePairSwitcher compact />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            {getUiString(interfaceLang, "theme")}
          </label>
          <div className="flex gap-2">
            {(["dark", "light"] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateSettings({ theme: t })}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all",
                  settings.theme === t
                    ? "border-violet-400 bg-violet-500/30 text-white"
                    : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {t === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                {getUiString(interfaceLang, t === "dark" ? "dark" : "light")}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <SuggestionForm />

      <GlassCard>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Smartphone size={18} />
          {getUiString(interfaceLang, "support")} /{" "}
          {getUiString(interfaceLang, "help")}
        </h2>
        <SupportAccordion interfaceLang={interfaceLang} />
      </GlassCard>

      {showRootAdminPanel && <RootAdminSettingsPanel />}
    </div>
  );
}
