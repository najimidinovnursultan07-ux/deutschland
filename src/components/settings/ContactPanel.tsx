"use client";

import { Mail, Clock, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const OWNER_EMAIL = "najimidinovnursultan07@gmail.com";

export function ContactPanel() {
  return (
    <GlassCard className="w-full min-w-0 border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-slate-900/40 to-fuchsia-500/10 p-4 backdrop-blur-xl sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
        <MessageCircle size={20} className="shrink-0 text-violet-300" />
        📞 Байланышуу
      </h3>

      <ul className="space-y-4 text-sm leading-relaxed text-white/80 sm:text-base">
        <li className="flex min-w-0 items-start gap-3">
          <Mail size={18} className="mt-0.5 shrink-0 text-violet-300" />
          <div className="min-w-0 break-words">
            <span className="block text-white/50">Электрондук почта:</span>
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="font-medium text-violet-200 underline decoration-violet-400/50 underline-offset-2 transition hover:text-white"
            >
              {OWNER_EMAIL}
            </a>
          </div>
        </li>

        <li className="flex min-w-0 items-start gap-3">
          <Clock size={18} className="mt-0.5 shrink-0 text-violet-300" />
          <div className="min-w-0 break-words">
            <span className="block text-white/50">Жумуш убактысы:</span>
            <span className="text-white/90">
              Дш — Жм, 09:00—18:00 (Бишкек убактысы боюнча)
            </span>
          </div>
        </li>

        <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
          Биз сиздин суроолоруңузга 24 сааттын ичинде жооп беребиз.
        </li>
      </ul>
    </GlassCard>
  );
}
