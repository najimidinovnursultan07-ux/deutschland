"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/authStore";

const MIN_WORDS = 100;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function SuggestionForm() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(text);
  const meetsMinimum = wordCount >= MIN_WORDS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim() || !meetsMinimum || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        const message =
          payload?.error ??
          (res.status === 401 ? t("suggestion.relogin") : t("feedback.error"));
        throw new Error(message);
      }

      setText("");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("feedback.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="suggest-idea" className="w-full min-w-0 scroll-mt-4">
      <GlassCard className="p-4 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
          <MessageSquarePlus size={18} />
          {t("submitSuggestion")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={t("suggestionPlaceholder")}
            className="w-full resize-none rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
            <span>
              {wordCount} / {MIN_WORDS} {t("suggestion.wordCount")}
            </span>
          </div>
          {!meetsMinimum && text.trim().length > 0 && (
            <p
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
              role="alert"
            >
              {t("suggestion.minWordsAlert")}
            </p>
          )}
          {sent && (
            <p className="text-sm text-emerald-300" role="status">
              {t("suggestionSent")}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!text.trim() || !meetsMinimum || submitting}
          >
            {t("sendSuggestion")}
          </Button>
        </form>
      </GlassCard>
    </section>
  );
}
