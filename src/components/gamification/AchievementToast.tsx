"use client";

import { useEffect } from "react";
import { Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/gamification";
import { useAppStore } from "@/store/appStore";
import { ConfettiOverlay } from "./ConfettiOverlay";
import type { InterfaceLanguage } from "@/types";

interface AchievementToastProps {
  interfaceLang: InterfaceLanguage;
}

export function AchievementToast({ interfaceLang }: AchievementToastProps) {
  const pendingAchievement = useAppStore((s) => s.pendingAchievement);
  const clearPendingAchievement = useAppStore((s) => s.clearPendingAchievement);
  const settings = useAppStore((s) => s.settings);

  const achievement = ACHIEVEMENTS.find((a) => a.id === pendingAchievement);

  useEffect(() => {
    if (!pendingAchievement) return;
    const timer = setTimeout(() => clearPendingAchievement(), 5000);
    return () => clearTimeout(timer);
  }, [pendingAchievement, clearPendingAchievement]);

  if (!achievement) return null;

  return (
    <>
      <ConfettiOverlay active={!!pendingAchievement} />
      <div className="fixed bottom-24 left-1/2 z-[150] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-slide-up md:bottom-8">
        <div className="flex items-center gap-4 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-fuchsia-500/20 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/30 text-2xl">
            {achievement.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-xs font-medium text-amber-300">
              <Trophy size={12} />
              {interfaceLang === "ky" ? "Жетишкендик!" : "Достижение!"}
            </p>
            <p className="truncate font-bold text-white">
              {interfaceLang === "ky"
                ? achievement.titleKy
                : achievement.titleRu}
            </p>
            <p className="text-xs text-white/60">
              +{achievement.xpReward} XP
            </p>
          </div>
          <button
            type="button"
            onClick={clearPendingAchievement}
            className="text-white/40 hover:text-white"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
      {settings.achievementSounds && typeof window !== "undefined" && (
        <audio autoPlay src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBAC" />
      )}
    </>
  );
}
