"use client";

import { RefreshCw } from "lucide-react";
import { useSuggestionsInbox } from "@/hooks/useSuggestionsInbox";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";

function formatSuggestionDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export function UserSuggestionsInbox() {
  const interfaceLang = useInterfaceLang();
  const { isAuthorized, suggestions, loading, error, refresh } =
    useSuggestionsInbox();

  if (!isAuthorized) return null;

  const locale = interfaceLang === "ky" ? "ky-KG" : "ru-RU";

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
        <h3 className="text-lg font-semibold text-white">
          {getUiString(interfaceLang, "userSuggestionsTitle")}
        </h3>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {interfaceLang === "ky" ? "Жаңыртуу" : "Обновить"}
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {loading && suggestions.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/40 md:px-6">
            …
          </p>
        ) : error ? (
          <p className="px-4 py-8 text-center text-sm text-red-300/80 md:px-6">
            {error}
          </p>
        ) : suggestions.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/40 md:px-6">
            {getUiString(interfaceLang, "noSuggestions")}
          </p>
        ) : (
          suggestions.map((s) => (
            <article key={s.id} className="px-4 py-4 md:px-6">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                <span className="break-all text-sm font-medium text-violet-300">
                  {s.userEmail}
                </span>
                <time
                  dateTime={s.createdAt}
                  className="text-xs text-white/45"
                >
                  {formatSuggestionDate(s.createdAt, locale)}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/90">
                {s.text}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
