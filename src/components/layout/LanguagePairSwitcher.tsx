"use client";

import { Languages } from "lucide-react";
import { LANGUAGE_PAIRS } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/appStore";
import type { LanguagePair } from "@/types";

interface LanguagePairSwitcherProps {
  compact?: boolean;
}

export function LanguagePairSwitcher({ compact = false }: LanguagePairSwitcherProps) {
  const { t } = useTranslation();
  const interfaceLang = useInterfaceLang();
  const languagePair = useAppStore((s) => s.languagePair);
  const setLanguagePair = useAppStore((s) => s.setLanguagePair);

  return (
    <div className={compact ? "w-full" : "relative"}>
      <label className="mb-1 flex items-center gap-1.5 text-xs text-white/50">
        <Languages size={12} />
        {!compact && t("gamification.languagePair")}
      </label>
      <select
        value={languagePair}
        onChange={(e) => setLanguagePair(e.target.value as LanguagePair)}
        className="w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
        aria-label={t("gamification.languagePair")}
      >
        {LANGUAGE_PAIRS.map((lp) => (
          <option key={lp.pair} value={lp.pair} className="bg-slate-900 text-white">
            {interfaceLang === "ky" ? lp.labelKy : lp.labelRu}
          </option>
        ))}
      </select>
    </div>
  );
}
