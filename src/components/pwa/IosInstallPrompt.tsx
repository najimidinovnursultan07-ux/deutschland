"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function IosShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 4v9M12 4l-3.25 3.25M12 4l3.25 3.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface IosInstallPromptProps {
  onClose: () => void;
}

export function IosInstallPrompt({ onClose }: IosInstallPromptProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[110] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2",
      )}
      role="region"
      aria-label="iOS install instructions"
    >
      <div
        className={cn(
          "relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-violet-400/35",
          "bg-slate-950/75 shadow-2xl shadow-violet-900/40 backdrop-blur-xl",
          "ring-1 ring-fuchsia-400/20",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/15"
          aria-hidden
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative flex gap-3 p-4 pr-12">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200 ring-1 ring-white/15">
            <IosShareIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0 space-y-2 text-sm leading-relaxed text-white/90">
            <p>
              <span className="mr-1.5 rounded bg-fuchsia-500/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-fuchsia-200">
                KY
              </span>
              Орнотуу үчүн ылдыйдагы{" "}
              <strong className="text-white">«Бөлүшүү»</strong> баскычын басып,{" "}
              <strong className="text-violet-200">«Экранга кошуу»</strong>{" "}
              дегенди тандаңыз.
            </p>
            <p>
              <span className="mr-1.5 rounded bg-violet-500/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-violet-200">
                RU
              </span>
              Для установки нажмите кнопку{" "}
              <strong className="text-white">«Поделиться»</strong> внизу экрана,
              затем <strong className="text-violet-200">«На экран Домой»</strong>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
