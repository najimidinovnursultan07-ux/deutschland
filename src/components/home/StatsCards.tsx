"use client";

import { Flame, BookMarked, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAppStore } from "@/store/appStore";

export function StatsCards() {
  const interfaceLang = useInterfaceLang();
  const streak = useAppStore((s) => s.streak);
  const totalWordsLearned = useAppStore((s) => s.totalWordsLearned);
  const recentLessonIds = useAppStore((s) => s.recentLessonIds);

  const stats = [
    {
      icon: Flame,
      label: getUiString(interfaceLang, "dailyStreak"),
      value: streak,
      suffix: interfaceLang === "ky" ? "күн" : "дн.",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: BookMarked,
      label: getUiString(interfaceLang, "wordsLearned"),
      value: totalWordsLearned,
      suffix: "",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: Clock,
      label: getUiString(interfaceLang, "recentLessons"),
      value: recentLessonIds.length,
      suffix: "",
      color: "from-sky-400 to-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="flex items-center gap-4 p-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}
          >
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {stat.value}
              {stat.suffix && (
                <span className="ml-1 text-sm font-normal text-white/50">
                  {stat.suffix}
                </span>
              )}
            </p>
            <p className="text-xs text-white/60">{stat.label}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
