"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StatsCards } from "@/components/home/StatsCards";
import { LevelGrid } from "@/components/home/LevelGrid";
import { LessonList } from "@/components/home/LessonList";
import { LanguagePairSwitcher } from "@/components/layout/LanguagePairSwitcher";
import { DailyGoalRing } from "@/components/gamification/DailyGoalRing";
import { SRSReviewBanner } from "@/components/gamification/SRSReviewBanner";
import { HeartsDisplay } from "@/components/gamification/HeartsDisplay";
import { ConfettiOverlay } from "@/components/gamification/ConfettiOverlay";
import { GlassCard } from "@/components/ui/GlassCard";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

function HomeContent() {
  const interfaceLang = useInterfaceLang();
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const setSelectedLevel = useAppStore((s) => s.setSelectedLevel);
  const xp = useAppStore((s) => s.xp);
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (searchParams.get("completed") === "1") {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 4000);
      window.history.replaceState({}, "", "/");
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  return (
    <div className="w-full min-w-0 space-y-8">
      <ConfettiOverlay active={showCelebration} />

      {showCelebration && (
        <GlassCard className="border-emerald-400/30 bg-emerald-500/10 text-center animate-slide-up">
          <p className="font-semibold text-emerald-200">
            {getUiString(interfaceLang, "lessonComplete")}{" "}
            {getUiString(interfaceLang, "completionXp")}
          </p>
        </GlassCard>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {getUiString(interfaceLang, "welcome")}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {getUiString(interfaceLang, "selectLevel")} · {xp} XP
          </p>
        </div>
        <div className="flex items-center gap-4">
          <HeartsDisplay />
          <div className="w-full sm:max-w-xs lg:hidden">
            <LanguagePairSwitcher />
          </div>
        </div>
      </div>

      <GlassCard className="border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <DailyGoalRing interfaceLang={interfaceLang} />
      </GlassCard>

      <SRSReviewBanner interfaceLang={interfaceLang} />

      <StatsCards />

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          {getUiString(interfaceLang, "progress")}
        </h2>
        <LevelGrid onSelectLevel={setSelectedLevel} />
      </section>

      <GlassCard className="border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <LessonList level={selectedLevel} />
      </GlassCard>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
