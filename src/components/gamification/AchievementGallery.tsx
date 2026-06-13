"use client";

import { ACHIEVEMENTS } from "@/lib/gamification";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/appStore";
import type { InterfaceLanguage } from "@/types";
import { cn } from "@/lib/utils";

interface AchievementGalleryProps {
  interfaceLang: InterfaceLanguage;
}

export function AchievementGallery({ interfaceLang }: AchievementGalleryProps) {
  const unlocked = useAppStore((s) => s.unlockedAchievements);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        {interfaceLang === "ky" ? "Жетишкендиктер" : "Достижения"}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <GlassCard
              key={ach.id}
              className={cn(
                "relative overflow-hidden p-4 text-center transition-all",
                isUnlocked
                  ? "border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-violet-500/10"
                  : "opacity-50 grayscale"
              )}
            >
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                {ach.icon}
              </div>
              <p className="font-semibold text-white">
                {interfaceLang === "ky" ? ach.titleKy : ach.titleRu}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {interfaceLang === "ky"
                  ? ach.descriptionKy
                  : ach.descriptionRu}
              </p>
              {isUnlocked && (
                <span className="mt-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                  +{ach.xpReward} XP
                </span>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
