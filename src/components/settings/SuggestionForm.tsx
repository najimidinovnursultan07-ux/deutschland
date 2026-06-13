"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAuthStore } from "@/store/authStore";

export function SuggestionForm() {
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim() || submitting) return;

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
          (res.status === 401
            ? interfaceLang === "ky"
              ? "Кайра кириңиз"
              : "Войдите снова"
            : `Submit failed (${res.status})`);
        throw new Error(message);
      }

      setText("");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="suggest-idea" className="scroll-mt-4">
      <GlassCard>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
          <MessageSquarePlus size={18} />
          {getUiString(interfaceLang, "submitSuggestion")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={getUiString(interfaceLang, "suggestionPlaceholder")}
            className="w-full resize-none rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
          />
          {sent && (
            <p className="text-sm text-emerald-300" role="status">
              {getUiString(interfaceLang, "suggestionSent")}
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
            disabled={!text.trim() || submitting}
          >
            {getUiString(interfaceLang, "sendSuggestion")}
          </Button>
        </form>
      </GlassCard>
    </section>
  );
}
