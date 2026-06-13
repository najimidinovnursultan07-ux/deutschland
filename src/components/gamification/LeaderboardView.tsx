"use client";

import { RefreshCw, Trophy, Medal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuthStore } from "@/store/authStore";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { cn } from "@/lib/utils";

export function LeaderboardView() {
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const { entries, loading, error, refresh } = useLeaderboard(user?.id);

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Trophy className="text-amber-400" size={28} />
            {interfaceLang === "ky" ? "Жумалык лига" : "Недельная лига"}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {interfaceLang === "ky"
              ? "Активдүү оюнчулар · чыныгы XP"
              : "Активные игроки · реальный XP"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {interfaceLang === "ky" ? "Жаңыртуу" : "Обновить"}
        </button>
      </div>

      {loading && entries.length === 0 ? (
        <GlassCard className="py-12 text-center text-sm text-white/40">
          …
        </GlassCard>
      ) : error ? (
        <GlassCard className="py-12 text-center text-sm text-red-300/80">
          {error}
        </GlassCard>
      ) : entries.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <p className="text-sm text-white/50">
            {interfaceLang === "ky"
              ? "Азырынча активдүү оюнчулар жок. Сабак өтүп, XP топтогондо бул жерде көрүнөсүз!"
              : "Пока нет активных игроков. Пройдите урок и заработайте XP, чтобы попасть в рейтинг!"}
          </p>
        </GlassCard>
      ) : (
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
                {entry.rank <= 3 ? <Medal size={18} /> : entry.rank}
              </div>
              {entry.avatarUrl ? (
                <img
                  src={entry.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full border border-white/20"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-violet-500/20 text-sm font-bold text-violet-200">
                  {entry.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs text-violet-300">
                      ({interfaceLang === "ky" ? "Сиз" : "Вы"})
                    </span>
                  )}
                </p>
                <p className="text-xs text-white/40">
                  {interfaceLang === "ky"
                    ? `${entry.passedLessonCount} сабак`
                    : `${entry.passedLessonCount} ур.`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-violet-200">{entry.weeklyXp}</p>
                <p className="text-xs text-white/40">XP</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
