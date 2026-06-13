/**
 * Human-verified translation pairs and reverse-lookup constraints.
 * Used by applyTranslationQA() before lessons are materialized.
 */

export interface VerifiedPair {
  foreign: string;
  translationKg: string;
  translationRu: string;
  /** Kyrgyz gloss must not imply these foreign lemmas on reverse lookup */
  rejectReverse?: string[];
}

/** Authoritative overrides keyed by exact foreign term (DE/EN) */
export const VERIFIED_BY_FOREIGN: Record<string, VerifiedPair> = {
  Ambivalenz: {
    foreign: "Ambivalenz",
    translationKg: "Эки анжылык",
    translationRu: "Амбивалентность",
    rejectReverse: ["Doppelte Beziehung", "double relationship", "Кош мамиле"],
  },
  ambivalence: {
    foreign: "ambivalence",
    translationKg: "Эки анжылык",
    translationRu: "Амбивалентность",
    rejectReverse: ["Doppelte Beziehung", "double relationship", "Кош мамиле"],
  },
  Relativität: {
    foreign: "Relativität",
    translationKg: "Салыштырмалуулук",
    translationRu: "Относительность",
  },
  relativity: {
    foreign: "relativity",
    translationKg: "Салыштырмалуулук",
    translationRu: "Относительность",
  },
  Bewusstsein: {
    foreign: "Bewusstsein",
    translationKg: "Аң-сезим",
    translationRu: "Сознание",
  },
  consciousness: {
    foreign: "consciousness",
    translationKg: "Аң-сезим",
    translationRu: "Сознание",
  },
  "Auf Wiedersehen": {
    foreign: "Auf Wiedersehen",
    translationKg: "Кайра көрүшкөнчө",
    translationRu: "До свидания",
    rejectReverse: ["Willkommen", "Welcome", "Кош келиңиз"],
  },
  "Die Daumen drücken": {
    foreign: "Die Daumen drücken",
    translationKg: "Ийгилик каалоо",
    translationRu: "Ни пуха ни пера",
    rejectReverse: ["thumb", "баш бармак", "давить"],
  },
  "break a leg": {
    foreign: "break a leg",
    translationKg: "Ийгилик каалоо",
    translationRu: "Ни пуха ни пера",
    rejectReverse: ["leg fracture", "сындыруу"],
  },
  Bank: {
    foreign: "Bank",
    translationKg: "Банк",
    translationRu: "Банк",
    rejectReverse: ["bench", "Sitzbank", "Отургуч"],
  },
  bank: {
    foreign: "bank",
    translationKg: "Банк",
    translationRu: "Банк",
    rejectReverse: ["bench", "Отургуч"],
  },
  Sitzbank: {
    foreign: "Sitzbank",
    translationKg: "Отургуч",
    translationRu: "Скамейка",
    rejectReverse: ["Bank", "Банк"],
  },
  bench: {
    foreign: "bench",
    translationKg: "Отургуч",
    translationRu: "Скамейка",
    rejectReverse: ["Bank", "Банк"],
  },
};

/** Forbidden Kyrgyz glosses that indicate machine-translation drift */
export const FORBIDDEN_KY_GLOSSES = new Set([
  "Кош мамиле", // literal for ambivalence — means "dual attitude/relationship"
  "Бежевый", // Russian adjective in KY slot
]);

/** Kyrgyz gloss → acceptable foreign headwords for reverse QA */
export const REVERSE_ACCEPT: Record<string, string[]> = {
  "Эки анжылык": ["Ambivalenz", "ambivalence"],
  "Салыштырмалуулук": ["Relativität", "relativity"],
  "Аң-сезим": ["Bewusstsein", "consciousness", "Gewissen"],
  "Ийгилик каалоо": [
    "Die Daumen drücken",
    "break a leg",
    "Viel Glück",
    "Hals- und Beinbruch",
  ],
  "Кайра көрүшкөнчө": ["Auf Wiedersehen", "Goodbye", "See you"],
  "Кош келиңиз": ["Willkommen", "Welcome", "Herzlich willkommen"],
  "Банк": ["Bank", "bank"],
  "Отургуч": ["Sitzbank", "bench", "Parkbank"],
};

export interface TranslationIssue {
  foreign: string;
  translationKg: string;
  translationRu: string;
  reason: string;
}

export function auditTranslation(
  foreign: string,
  translationKg: string,
  translationRu: string
): TranslationIssue | null {
  if (FORBIDDEN_KY_GLOSSES.has(translationKg)) {
    return {
      foreign,
      translationKg,
      translationRu,
      reason: `Forbidden Kyrgyz gloss: "${translationKg}"`,
    };
  }

  const verified = VERIFIED_BY_FOREIGN[foreign];
  if (verified && translationKg !== verified.translationKg) {
    return {
      foreign,
      translationKg,
      translationRu,
      reason: `Expected KY "${verified.translationKg}" for "${foreign}"`,
    };
  }

  const accept = REVERSE_ACCEPT[translationKg];
  if (accept && !accept.some((a) => foreign.toLowerCase().includes(a.toLowerCase()))) {
    return {
      foreign,
      translationKg,
      translationRu,
      reason: `Reverse mismatch: "${translationKg}" not valid for "${foreign}"`,
    };
  }

  return null;
}

export function applyVerifiedPair<T extends { foreign: string; translationKg: string; translationRu: string }>(
  seed: T
): T {
  const verified = VERIFIED_BY_FOREIGN[seed.foreign];
  if (!verified) return seed;
  return {
    ...seed,
    translationKg: verified.translationKg,
    translationRu: verified.translationRu,
  };
}
