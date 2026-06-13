"use client";

import { CEFR_LEVELS, LEVEL_META } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAppStore } from "@/store/appStore";
import type { CEFRLevel } from "@/types";
import { cn } from "@/lib/utils";

interface LevelGridProps {
  onSelectLevel: (level: CEFRLevel) => void;
}

export function LevelGrid({ onSelectLevel }: LevelGridProps) {
  const interfaceLang = useInterfaceLang();
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const levelProgress = useAppStore((s) => s.levelProgress);
  const passedQuizLessonIds = useAppStore((s) => s.passedQuizLessonIds);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {CEFR_LEVELS.map((level) => {
        const meta = LEVEL_META[level];
        const progress = levelProgress[level];
        const passedCount = passedQuizLessonIds.filter((id) =>
          id.startsWith(level)
        ).length;
        const isSelected = selectedLevel === level;

        return (
          <button
            key={level}
            type="button"
            onClick={() => onSelectLevel(level)}
            className="text-left"
          >
            <GlassCard
              className={cn(
                "cursor-pointer p-4 transition-all hover:scale-[1.02] hover:border-violet-400/40",
                isSelected && "border-violet-400/60 ring-2 ring-violet-400/30"
              )}
            >
              <div
                className={`mb-3 inline-flex rounded-lg bg-gradient-to-r px-2.5 py-1 text-sm font-bold text-white ${meta.color}`}
              >
                {level}
              </div>
              <p className="mb-2 text-xs text-white/60">
                {interfaceLang === "ky" ? meta.labelKy : meta.labelRu}
              </p>
              <ProgressBar
                value={passedCount || progress.completedLessons}
                max={progress.totalLessons}
                colorClass={meta.color}
              />
              <p className="mt-1.5 text-xs text-white/40">
                {passedCount || progress.completedLessons}/{progress.totalLessons}
              </p>
            </GlassCard>
          </button>
        );
      })}
    </div>
  );
}
