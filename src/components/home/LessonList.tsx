"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, BookOpen, Lock } from "lucide-react";
import { getLessonsForLevel, isLessonUnlocked } from "@/data/lessonFactory";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { getTargetLangFromPair, useAppStore } from "@/store/appStore";
import type { CEFRLevel } from "@/types";
import { cn } from "@/lib/utils";

interface LessonListProps {
  level: CEFRLevel;
}

export function LessonList({ level }: LessonListProps) {
  const interfaceLang = useInterfaceLang();
  const languagePair = useAppStore((s) => s.languagePair);
  const passedQuizLessonIds = useAppStore((s) => s.passedQuizLessonIds);
  const targetLang = getTargetLangFromPair(languagePair);

  const lessons = useMemo(
    () => getLessonsForLevel(level, targetLang),
    [level, targetLang]
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleLessons = lessons.slice(0, visibleCount);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">
        {getUiString(interfaceLang, "lessons")} — {level}
      </h3>

      <div className="space-y-2">
        {visibleLessons.map((lesson) => {
          const isPassed = passedQuizLessonIds.includes(lesson.id);
          const isUnlocked = isLessonUnlocked(
            level,
            lesson.number,
            passedQuizLessonIds,
            targetLang
          );

          const content = (
            <>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  !isUnlocked
                    ? "bg-white/5 text-white/30"
                    : isPassed
                      ? "bg-emerald-500/30 text-emerald-300"
                      : "bg-white/10 text-white/70"
                )}
              >
                {!isUnlocked ? (
                  <Lock size={18} />
                ) : isPassed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <BookOpen size={20} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {interfaceLang === "ky" ? lesson.titleKy : lesson.titleRu}
                </p>
                <p className="text-xs text-white/50">
                  {lesson.estimatedMinutes}{" "}
                  {getUiString(interfaceLang, "minutes")} ·{" "}
                  {lesson.vocabulary.length}{" "}
                  {getUiString(interfaceLang, "vocabulary")}
                  {!isUnlocked &&
                    ` · ${getUiString(interfaceLang, "locked")}`}
                </p>
              </div>
              {isUnlocked && (
                <ChevronRight size={18} className="shrink-0 text-white/40" />
              )}
            </>
          );

          return (
            <GlassCard
              key={lesson.id}
              className={cn("overflow-hidden p-0", !isUnlocked && "opacity-60")}
            >
              {isUnlocked ? (
                <Link
                  href={`/lessons/${encodeURIComponent(lesson.id)}`}
                  className="flex w-full items-center gap-3 p-4 transition-colors hover:bg-white/5"
                >
                  {content}
                </Link>
              ) : (
                <div
                  className="flex w-full cursor-not-allowed items-center gap-3 p-4"
                  aria-disabled
                >
                  {content}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {visibleCount < lessons.length && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setVisibleCount((c) => c + 20)}
        >
          {interfaceLang === "ky"
            ? `Көбүрөөк көрсөтүү (${visibleCount}/${lessons.length})`
            : `Показать ещё (${visibleCount}/${lessons.length})`}
        </Button>
      )}
    </div>
  );
}
