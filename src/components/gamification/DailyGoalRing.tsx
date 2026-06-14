"use client";

import { DAILY_GOAL_CONFIG } from "@/lib/gamification";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";

export function DailyGoalRing() {
  const { t } = useTranslation();
  const interfaceLang = useInterfaceLang();
  const dailyXp = useAppStore((s) => s.dailyXp);
  const dailyGoalTier = useAppStore((s) => s.dailyGoalTier);
  const setDailyGoalTier = useAppStore((s) => s.setDailyGoalTier);
  const config = DAILY_GOAL_CONFIG[dailyGoalTier];
  const target = config.xpTarget;
  const progress = Math.min(1, dailyXp / target);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="relative h-36 w-36 shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#goalGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{dailyXp}</span>
          <span className="text-xs text-white/50">/ {target} XP</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium text-white/80">
          {t("gamification.dailyGoal")}
        </p>
        <div className="flex flex-wrap gap-2">
          {(["casual", "serious", "insane"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setDailyGoalTier(tier)}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                dailyGoalTier === tier
                  ? "border-violet-400/60 bg-violet-500/25 text-white"
                  : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {interfaceLang === "ky"
                ? DAILY_GOAL_CONFIG[tier].labelKy
                : DAILY_GOAL_CONFIG[tier].labelRu}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40">
          {t("gamification.dailyGoalMeta", {
            minutes: config.minutes,
            target,
          })}
        </p>
      </div>
    </div>
  );
}
