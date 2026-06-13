import type { TargetLanguage } from "@/types";
import type { SampleSentence } from "@/types/vocabulary";
import type { WordSeed } from "./wordSeed";

function ensurePeriod(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function pickTemplateIndex(key: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % count;
  }
  return hash;
}

function isPhrase(seed: WordSeed): boolean {
  return (
    seed.partOfSpeech === "phrase" ||
    seed.partOfSpeech === "interjection" ||
    seed.foreign.includes(" ")
  );
}

function buildGermanSentence(word: string, kg: string, ru: string, pos: string): SampleSentence {
  if (pos === "number") {
    const templates: Array<() => SampleSentence> = [
      () => ({
        foreign: `Es ist ${word} Uhr.`,
        nativeKy: `Саат ${kg.toLowerCase()} болду.`,
        nativeRu: `Сейчас ${ru.toLowerCase()} часа.`,
      }),
      () => ({
        foreign: `Ich habe ${word} Bücher.`,
        nativeKy: `Менде ${kg.toLowerCase()} китеп бар.`,
        nativeRu: `У меня ${ru.toLowerCase()} книги.`,
      }),
      () => ({
        foreign: `Wir sind zu ${word}.`,
        nativeKy: `Биз ${kg.toLowerCase()}бүз.`,
        nativeRu: `Нас ${ru.toLowerCase()}.`,
      }),
    ];
    return templates[pickTemplateIndex(word, templates.length)]();
  }

  if (pos === "noun") {
    return {
      foreign: `Das ist ein ${word}.`,
      nativeKy: `Бул ${kg.toLowerCase()}.`,
      nativeRu: `Это ${ru.toLowerCase()}.`,
    };
  }

  if (pos === "verb") {
    return {
      foreign: `Ich ${word}.`,
      nativeKy: `Мен ${kg.toLowerCase()}.`,
      nativeRu: `Я ${ru.toLowerCase()}.`,
    };
  }

  if (pos === "adjective" || pos === "adverb") {
    return {
      foreign: `Das ist ${word}.`,
      nativeKy: `Бул ${kg.toLowerCase()}.`,
      nativeRu: `Это ${ru.toLowerCase()}.`,
    };
  }

  return {
    foreign: ensurePeriod(word),
    nativeKy: ensurePeriod(kg),
    nativeRu: ensurePeriod(ru),
  };
}

function buildEnglishSentence(word: string, kg: string, ru: string, pos: string): SampleSentence {
  if (pos === "number") {
    const templates: Array<() => SampleSentence> = [
      () => ({
        foreign: `It is ${word} o'clock.`,
        nativeKy: `Саат ${kg.toLowerCase()} болду.`,
        nativeRu: `Сейчас ${ru.toLowerCase()} часа.`,
      }),
      () => ({
        foreign: `I have ${word} books.`,
        nativeKy: `Менде ${kg.toLowerCase()} китеп бар.`,
        nativeRu: `У меня ${ru.toLowerCase()} книги.`,
      }),
      () => ({
        foreign: `We are ${word}.`,
        nativeKy: `Биз ${kg.toLowerCase()}бүз.`,
        nativeRu: `Нас ${ru.toLowerCase()}.`,
      }),
    ];
    return templates[pickTemplateIndex(word, templates.length)]();
  }

  if (pos === "noun") {
    return {
      foreign: `This is a ${word}.`,
      nativeKy: `Бул ${kg.toLowerCase()}.`,
      nativeRu: `Это ${ru.toLowerCase()}.`,
    };
  }

  if (pos === "verb") {
    return {
      foreign: `I ${word}.`,
      nativeKy: `Мен ${kg.toLowerCase()}.`,
      nativeRu: `Я ${ru.toLowerCase()}.`,
    };
  }

  if (pos === "adjective" || pos === "adverb") {
    return {
      foreign: `It is ${word}.`,
      nativeKy: `Бул ${kg.toLowerCase()}.`,
      nativeRu: `Это ${ru.toLowerCase()}.`,
    };
  }

  return {
    foreign: ensurePeriod(word),
    nativeKy: ensurePeriod(kg),
    nativeRu: ensurePeriod(ru),
  };
}

/** Build a contextual sample sentence from lemma + POS (never from broken expanded forms). */
export function buildSampleSentence(
  seed: WordSeed,
  targetLang: TargetLanguage
): SampleSentence {
  if (seed.sampleSentence) {
    return seed.sampleSentence;
  }

  const lemma = (seed.lemma ?? seed.foreign).trim();
  const kg = seed.translationKg.trim();
  const ru = seed.translationRu.trim();

  if (isPhrase(seed)) {
    return {
      foreign: ensurePeriod(seed.foreign),
      nativeKy: ensurePeriod(kg),
      nativeRu: ensurePeriod(ru),
    };
  }

  if (targetLang === "de") {
    return buildGermanSentence(lemma, kg, ru, seed.partOfSpeech);
  }

  return buildEnglishSentence(lemma, kg, ru, seed.partOfSpeech);
}
