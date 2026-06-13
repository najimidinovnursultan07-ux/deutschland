"use client";

import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PHONETIC_TIPS } from "@/lib/gamification";
import type { InterfaceLanguage, TargetLanguage } from "@/types";

interface PhoneticTipCardsProps {
  targetLang: TargetLanguage;
  interfaceLang: InterfaceLanguage;
}

export function PhoneticTipCards({
  targetLang,
  interfaceLang,
}: PhoneticTipCardsProps) {
  const tips = PHONETIC_TIPS.filter((t) => t.targetLang === targetLang);
  if (!tips.length) return null;

  return (
    <div className="mb-4 space-y-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
        <Lightbulb size={16} />
        {interfaceLang === "ky" ? "Лайфхактар" : "Лайфхаки"}
      </p>
      {tips.map((tip) => (
        <GlassCard
          key={tip.id}
          className="border-amber-400/20 bg-amber-500/5 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg font-bold text-amber-200">
              {tip.sound}
            </span>
            <div>
              <p className="font-medium text-white">
                {interfaceLang === "ky" ? tip.titleKy : tip.titleRu}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {interfaceLang === "ky" ? tip.bodyKy : tip.bodyRu}
              </p>
              <p className="mt-2 text-xs text-violet-300">
                {tip.exampleWord} → {tip.kyrgyzMapping}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
