"use client";

import { Heart, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HEART_REFILL_XP_COST, HEART_REGEN_MINUTES } from "@/lib/gamification";
import { useAppStore } from "@/store/appStore";
import type { InterfaceLanguage } from "@/types";

interface HeartsModalProps {
  interfaceLang: InterfaceLanguage;
  onClose: () => void;
}

export function HeartsModal({ interfaceLang, onClose }: HeartsModalProps) {
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
            Жүрөкчөлөр түгөндү!
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {interfaceLang === "ky"
              ? "Кайра толтуруу же күтүү"
              : "Пополните или подождите"}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full"
            onClick={handleRefill}
            disabled={xp < HEART_REFILL_XP_COST}
          >
            <Sparkles size={16} />
            {interfaceLang === "ky"
              ? `${HEART_REFILL_XP_COST} XP менен толтуруу`
              : `Пополнить за ${HEART_REFILL_XP_COST} XP`}
            <span className="text-white/60">({xp} XP)</span>
          </Button>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Clock className="shrink-0 text-violet-300" size={20} />
            <p className="text-sm text-white/70">
              {interfaceLang === "ky"
                ? `Ар бир жүрөк ${HEART_REGEN_MINUTES} мүнөттө калыбына келет`
                : `Каждое сердце восстанавливается за ${HEART_REGEN_MINUTES} мин`}
            </p>
          </div>

          <Button variant="ghost" className="w-full" onClick={onClose}>
            {interfaceLang === "ky" ? "Жабуу" : "Закрыть"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
