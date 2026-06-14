"use client";

import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { cn } from "@/lib/utils";

const FEEDBACK_SEEN_KEY = "lingua:feedback-prompt-seen";
const FEEDBACK_DELAY_MS = 12 * 60 * 1000; // 12 minutes

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Submit failed");
      }

      setText("");
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/95 p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="feedback-title"
            className="flex items-center gap-2 text-lg font-semibold text-white"
          >
            <MessageSquare size={20} className="text-violet-300" />
            Отзыв калтыруу
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={
              interfaceLang === "ky"
                ? "Колдонмо жөнүндө ой-пикириңизди жазыңыз..."
                : "Напишите ваш отзыв о приложении..."
            }
            className="w-full resize-none rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
            required
          />
          {sent && (
            <p className="text-sm text-emerald-300" role="status">
              {interfaceLang === "ky" ? "Рахмат! Жөнөтүлдү." : "Спасибо! Отправлено."}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="w-full flex-1"
              onClick={onClose}
            >
              {interfaceLang === "ky" ? "Жабуу" : "Закрыть"}
            </Button>
            <Button
              type="submit"
              className="w-full flex-1"
              disabled={!text.trim() || submitting || !user}
            >
              {submitting ? "..." : interfaceLang === "ky" ? "Жөнөтүү" : "Отправить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FeedbackPrompt() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (sessionStorage.getItem(FEEDBACK_SEEN_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(FEEDBACK_SEEN_KEY, "1");
    }, FEEDBACK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40",
          "flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-600/90 px-4 py-2.5",
          "text-xs font-medium text-white shadow-lg backdrop-blur-md sm:text-sm md:bottom-8"
        )}
      >
        <MessageSquare size={16} />
        Отзыв
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
