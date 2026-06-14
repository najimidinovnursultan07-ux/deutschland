"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/hooks/useTranslation";

export function SRSReviewBanner() {
  const { t } = useTranslation();
  const getDueReviewCount = useAppStore((s) => s.getDueReviewCount);
  const dueCount = useAppStore((s) => {
    const today = new Date().toISOString().split("T")[0];
    return Object.values(s.srsRecords).filter(
      (r) => r.nextReviewDate <= today,
    ).length;
  });

  useEffect(() => {
    getDueReviewCount();
  }, [getDueReviewCount]);

  if (dueCount === 0) return null;

  return (
    <Link href="/dictionary">
      <GlassCard className="flex items-center gap-4 border-cyan-400/20 bg-cyan-500/10 p-4 transition-all hover:border-cyan-400/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
          <RotateCcw className="text-cyan-300" size={22} />
        </div>
        <div>
          <p className="font-semibold text-white">{t("gamification.review")}</p>
          <p className="text-sm text-white/60">
            {t("gamification.srsDue", { count: dueCount })}
          </p>
        </div>
        <span className="ml-auto rounded-full bg-cyan-500/30 px-3 py-1 text-sm font-bold text-cyan-200">
          {dueCount}
        </span>
      </GlassCard>
    </Link>
  );
}
