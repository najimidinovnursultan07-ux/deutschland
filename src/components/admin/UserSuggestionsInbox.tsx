"use client";

import { useSuggestionsInbox } from "@/hooks/useSuggestionsInbox";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";

export function UserSuggestionsInbox() {
  const interfaceLang = useInterfaceLang();
  const { isAuthorized, suggestions, loading, error } = useSuggestionsInbox();

  if (!isAuthorized) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-3 md:px-6">
        <h3 className="text-lg font-semibold text-white">
          {getUiString(interfaceLang, "userSuggestionsTitle")}
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {loading ? (
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
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/50">
                <span className="break-all font-medium text-violet-300">
                  {s.userEmail}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={s.createdAt}>
                  {new Date(s.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-white/90">
                {s.text}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
