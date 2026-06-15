"use client";

import { ExternalLink, MoreVertical, Smartphone, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface InstagramBrowserHintModalProps {
  onClose: () => void;
}

export function InstagramBrowserHintModal({
  onClose,
}: InstagramBrowserHintModalProps) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instagram-hint-title"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <GlassCard className="relative w-full max-w-md border-violet-400/25 bg-gradient-to-br from-slate-950/80 via-violet-950/60 to-fuchsia-950/50 p-0 shadow-2xl shadow-violet-900/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="border-b border-white/10 px-6 pb-5 pt-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 ring-1 ring-white/15">
            <Smartphone className="h-7 w-7 text-violet-200" />
          </div>
          <h2
            id="instagram-hint-title"
            className="text-center text-xl font-bold text-white"
          >
            📲 Установка приложения
          </h2>
          <p className="mt-1 text-center text-sm text-white/50">
            Instagram браузери / Instagram браузери
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
              <span className="rounded bg-white/10 px-1.5 py-0.5">RU</span>
              <MoreVertical size={14} />
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              Чтобы установить приложение, нажмите на{" "}
              <strong className="text-white">3 точки</strong> в верхнем правом углу
              и выберите{" "}
              <strong className="text-violet-200">
                «Открыть в браузере» (Chrome)
              </strong>
              .
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
              <span className="rounded bg-white/10 px-1.5 py-0.5">KY</span>
              <MoreVertical size={14} />
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              Бул тиркемени орнотуу үчүн жогорку оң бурчтагы{" "}
              <strong className="text-white">3 чекитти</strong> басып,{" "}
              <strong className="text-fuchsia-200">«Браузерден ачуу»</strong>{" "}
              дегенди тандаңыз.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3">
            <ExternalLink className="mt-0.5 shrink-0 text-cyan-300" size={18} />
            <p className="text-xs leading-relaxed text-cyan-100/90">
              Chrome&apos;до сайтты ачкандан кийин «Установить приложение»
              баскычы иштейт.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <Button className="w-full" onClick={onClose}>
            Түшүндүм / Понятно
          </Button>
        </div>
      </GlassCard>
      </div>
    </div>
  );
}
