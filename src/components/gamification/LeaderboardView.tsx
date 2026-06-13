"use client";

import { Trophy, Medal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MOCK_LEADERBOARD } from "@/lib/gamification";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { cn } from "@/lib/utils";

export function LeaderboardView() {
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const dailyXp = useAppStore((s) => s.dailyXp);
  const xp = useAppStore((s) => s.xp);

  const weeklyXp = dailyXp + Math.floor(xp * 0.3);

  const entries = [
    ...MOCK_LEADERBOARD.map((e) => ({ ...e, isCurrentUser: false })),
    {
      id: user?.id ?? "me",
      name: user?.name ?? "You",
      avatarUrl: user?.avatarUrl ?? "",
      weeklyXp,
      country: "🇰🇬",
      isCurrentUser: true,
    },
  ]
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .slice(0, 10)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Trophy className="text-amber-400" size={28} />
          {interfaceLang === "ky" ? "Жумалык лига" : "Недельная лига"}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {interfaceLang === "ky"
            ? "Дүйнөлүк рейтинг · 10 оюнчу"
            : "Мировой рейтинг · топ 10"}
        </p>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <GlassCard
            key={entry.id}
            className={cn(
              "flex items-center gap-4 p-4 transition-all",
              entry.isCurrentUser &&
                "border-transparent bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-cyan-500/20 ring-2 ring-violet-400/50 shadow-lg shadow-violet-500/10"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                entry.rank <= 3
                  ? "bg-amber-500/30 text-amber-200"
                  : "bg-white/10 text-white/60"
              )}
            >
              {entry.rank <= 3 ? (
                <Medal size={18} />
              ) : (
                entry.rank
              )}
            </div>
            <img
              src={entry.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full border border-white/20"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs text-violet-300">
                    ({interfaceLang === "ky" ? "Сиз" : "Вы"})
                  </span>
                )}
              </p>
              <p className="text-xs text-white/40">{entry.country}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-violet-200">{entry.weeklyXp}</p>
              <p className="text-xs text-white/40">XP</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
