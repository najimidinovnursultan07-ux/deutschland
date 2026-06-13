"use client";

import { getUiString } from "@/lib/constants";
import type { LessonStage } from "@/types";
import { cn } from "@/lib/utils";

const STAGE_KEYS = [
  "stage1Title",
  "stage2Title",
  "stage3Title",
  "stage4Title",
  "stage5Title",
] as const;

interface LessonStageTrackerProps {
  current: LessonStage;
  interfaceLang: "ky" | "ru";
}

export function LessonStageTracker({
  current,
  interfaceLang,
}: LessonStageTrackerProps) {
  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="shrink-0 text-sm font-medium text-violet-300">
          {getUiString(interfaceLang, "stageLabel")} {current}/5
        </span>
        <span className="min-w-0 truncate text-xs text-white/50 sm:max-w-[65%] sm:text-right sm:text-sm">
          {getUiString(interfaceLang, STAGE_KEYS[current - 1])}
        </span>
      </div>
      <div className="grid w-full min-w-0 grid-cols-5 gap-1 sm:gap-1.5">
        {([1, 2, 3, 4, 5] as LessonStage[]).map((step) => (
          <div
            key={step}
            className={cn(
              "h-1.5 min-w-0 rounded-full transition-all duration-500",
              step < current && "bg-emerald-400/80",
              step === current &&
                "bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]",
              step > current && "bg-white/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}
