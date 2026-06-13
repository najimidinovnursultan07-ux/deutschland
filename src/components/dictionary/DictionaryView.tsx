"use client";

import { useMemo, useState } from "react";
import { Search, Mic, MicOff } from "lucide-react";
import { getAllDictionaryWords } from "@/data/lessonFactory";
import { GlassCard } from "@/components/ui/GlassCard";
import { ListenButton } from "@/components/ui/ListenButton";
import { getUiString } from "@/lib/constants";
import {
  isVoiceSearchSupported,
  startVoiceSearch,
} from "@/lib/speech";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { getTargetLangFromPair, useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

type TranslationTab = "ky" | "ru";

export function DictionaryView() {
  const interfaceLang = useInterfaceLang();
  const languagePair = useAppStore((s) => s.languagePair);
  const targetLang = getTargetLangFromPair(languagePair);
  const [query, setQuery] = useState("");
  const [translationTab, setTranslationTab] = useState<TranslationTab>("ru");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(() => isVoiceSearchSupported());

  const allWords = useMemo(
    () => getAllDictionaryWords(targetLang),
    [targetLang]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allWords;
    return allWords.filter(
      (w) =>
        w.term.toLowerCase().includes(q) ||
        w.definitionKy.toLowerCase().includes(q) ||
        w.definitionRu.toLowerCase().includes(q) ||
        w.readingGuide.toLowerCase().includes(q)
    );
  }, [allWords, query]);

  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const stop = startVoiceSearch(
      translationTab === "ky" ? "ky-KG" : "ru-RU",
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
      },
      () => setIsListening(false)
    );

    if (stop) {
      setIsListening(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {getUiString(interfaceLang, "dictionary")}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {targetLang === "de" ? "🇩🇪 Немисче" : "🇬🇧 Англисче"} ·{" "}
          {filtered.length} {getUiString(interfaceLang, "vocabulary")}
        </p>
      </div>

      <GlassCard className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={18}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getUiString(interfaceLang, "search")}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            />
          </div>
          {voiceSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              aria-label={getUiString(interfaceLang, "voiceSearch")}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                isListening
                  ? "border-red-400/50 bg-red-500/20 text-red-200 animate-pulse"
                  : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
              )}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="hidden sm:inline">
                {getUiString(interfaceLang, "voiceSearch")}
              </span>
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {(["ky", "ru"] as TranslationTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTranslationTab(tab)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                translationTab === tab
                  ? "bg-violet-500/30 text-white border border-violet-400/50"
                  : "bg-white/5 text-white/60 border border-transparent hover:bg-white/10"
              )}
            >
              {getUiString(
                interfaceLang,
                tab === "ky" ? "translationKy" : "translationRu"
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <p className="text-white/50">
            {getUiString(interfaceLang, "noResults")}
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((word) => (
            <GlassCard key={word.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {word.term}
                  </p>
                  <p className="text-xs text-violet-300">
                    {word.pronunciation} · {word.readingGuide}
                  </p>
                  {word.partOfSpeech && (
                    <span className="mt-1 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      {word.partOfSpeech}
                    </span>
                  )}
                </div>
                <ListenButton
                  text={word.term}
                  targetLang={targetLang}
                />
              </div>
              <p className="mt-3 text-base font-medium text-white/90">
                {translationTab === "ky"
                  ? word.definitionKy
                  : word.definitionRu}
              </p>
              <p className="mt-2 text-xs text-white/40">{word.level}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
