"use client";

import { ListenButton } from "@/components/ui/ListenButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getUiString } from "@/lib/constants";
import type { VocabularyCard } from "@/types";
import type { TargetLanguage } from "@/types";

interface Stage1VocabularyProps {
  cards: VocabularyCard[];
  index: number;
  interfaceLang: "ky" | "ru";
  targetLang: TargetLanguage;
  embedded?: boolean;
}

export function Stage1Vocabulary({
  cards,
  index,
  interfaceLang,
  targetLang,
  embedded = false,
}: Stage1VocabularyProps) {
  const card = cards[index];
  const total = cards.length;

  return (
    <div className="w-full min-w-0 space-y-5 animate-slide-up">
      <ProgressBar value={index + 1} max={total} />
      <p className="text-center text-xs text-white/50">
        {index + 1} / {total}
      </p>

      <div className={embedded ? "space-y-4" : undefined}>
        <p className="text-xs uppercase tracking-wide text-violet-300">
          {getUiString(interfaceLang, "stage1Hint")}
        </p>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {card.term}
            </p>
            <p className="mt-1 text-sm text-violet-300">
              {card.pronunciation} · {card.readingGuide}
            </p>
          </div>
          <ListenButton text={card.term} targetLang={targetLang} size="md" />
        </div>
        <p className="text-lg text-white/90">
          {interfaceLang === "ky" ? card.definitionKy : card.definitionRu}
        </p>
      </div>
    </div>
  );
}
