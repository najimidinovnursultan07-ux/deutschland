import type { CEFRLevel, LanguagePair, TargetLanguage } from "@/types";

export const CEFR_LEVELS: CEFRLevel[] = [
  "A0",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
];

export { LESSONS_PER_LEVEL, WORDS_PER_LESSON as VOCAB_PER_LESSON } from "@/data/curriculum/lessonCatalog";

export const LANGUAGE_PAIRS: {
  pair: LanguagePair;
  base: "ky" | "ru";
  target: TargetLanguage;
  labelKy: string;
  labelRu: string;
}[] = [
  {
    pair: "ky-de",
    base: "ky",
    target: "de",
    labelKy: "Кыргызча → Немисче",
    labelRu: "Кыргызский → Немецкий",
  },
  {
    pair: "ky-en",
    base: "ky",
    target: "en",
    labelKy: "Кыргызча → Англисче",
    labelRu: "Кыргызский → Английский",
  },
  {
    pair: "ru-de",
    base: "ru",
    target: "de",
    labelKy: "Орусча → Немисче",
    labelRu: "Русский → Немецкий",
  },
  {
    pair: "ru-en",
    base: "ru",
    target: "en",
    labelKy: "Орусча → Англисче",
    labelRu: "Русский → Английский",
  },
];

export const TARGET_LOCALES: Record<TargetLanguage, string> = {
  de: "de-DE",
  en: "en-US",
};

export const LEVEL_META: Record<
  CEFRLevel,
  { color: string; labelKy: string; labelRu: string }
> = {
  A0: {
    color: "from-emerald-400 to-teal-500",
    labelKy: "Абсолюттук башталгыч",
    labelRu: "Абсолютный новичок",
  },
  A1: {
    color: "from-sky-400 to-blue-500",
    labelKy: "Башталгыч",
    labelRu: "Начальный",
  },
  A2: {
    color: "from-violet-400 to-purple-500",
    labelKy: "Элементардык",
    labelRu: "Элементарный",
  },
  B1: {
    color: "from-amber-400 to-orange-500",
    labelKy: "Орто деңгээл",
    labelRu: "Средний",
  },
  B2: {
    color: "from-rose-400 to-pink-500",
    labelKy: "Жогорку орто",
    labelRu: "Выше среднего",
  },
  C1: {
    color: "from-fuchsia-400 to-purple-600",
    labelKy: "Өнүккөн",
    labelRu: "Продвинутый",
  },
};

export { getUiString } from "@/i18n";
