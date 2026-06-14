"use client";

import { Heart, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HEART_REFILL_XP_COST, HEART_REGEN_MINUTES } from "@/lib/gamification";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/hooks/useTranslation";

interface HeartsModalProps {
  onClose: () => void;
}

export function HeartsModal({ onClose }: HeartsModalProps) {
  const { t } = useTranslation();
  const xp = useAppStore((s) => s.xp);
  const refillHeartsWithXp = useAppStore((s) => s.refillHeartsWithXp);

  const handleRefill = () => {
    if (refillHeartsWithXp()) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md border-red-400/20 bg-slate-950/70 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {t("gamification.heartsEmpty")}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {t("gamification.heartsSubtitle")}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full"
            onClick={handleRefill}
            disabled={xp < HEART_REFILL_XP_COST}
          >
            <Sparkles size={16} />
            {t("gamification.heartsRefill", { cost: HEART_REFILL_XP_COST })}
            <span className="text-white/60">({xp} XP)</span>
          </Button>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Clock className="shrink-0 text-violet-300" size={20} />
            <p className="text-sm text-white/70">
              {t("gamification.heartsRegen", { minutes: HEART_REGEN_MINUTES })}
            </p>
          </div>

          <Button variant="ghost" className="w-full" onClick={onClose}>
            {t("feedback.close")}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
