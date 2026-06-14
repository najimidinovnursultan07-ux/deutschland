"use client";

import { RefreshCw, Trophy, Medal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function LeaderboardView() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { entries, loading, error, refresh } = useLeaderboard(user?.id);

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Trophy className="text-amber-400" size={28} />
            {t("leaderboard.title")}
          </h1>
          <p className="mt-1 text-sm text-white/50">{t("leaderboard.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {t("leaderboard.refresh")}
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
          <p className="text-sm text-white/50">{t("leaderboard.empty")}</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <GlassCard
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 sm:gap-4 sm:p-4",
                entry.isCurrentUser && "border-violet-400/40 bg-violet-500/10",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-10 sm:w-10",
                  entry.rank === 1 && "bg-amber-500/20 text-amber-300",
                  entry.rank === 2 && "bg-slate-400/20 text-slate-300",
                  entry.rank === 3 && "bg-orange-600/20 text-orange-300",
                  entry.rank > 3 && "bg-white/5 text-white/50",
                )}
              >
                {entry.rank <= 3 ? (
                  <Medal
                    size={18}
                    className={cn(
                      entry.rank === 1 && "text-amber-400",
                      entry.rank === 2 && "text-slate-300",
                      entry.rank === 3 && "text-orange-400",
                    )}
                  />
                ) : (
                  entry.rank
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="ml-1.5 text-xs font-normal text-violet-300">
                      ({t("leaderboard.you")})
                    </span>
                  )}
                </p>
                <p className="text-xs text-white/40">
                  {entry.passedLessonCount} {t("leaderboard.lessons")}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-amber-300">{entry.totalXp}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/40">
                  {t("leaderboard.totalXp")}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
