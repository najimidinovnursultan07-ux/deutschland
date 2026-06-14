"use client";

import { X, Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePwa } from "@/context/PwaContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const DISMISS_KEY = "lingua:pwa-banner-dismissed";

export function InstallPwaBanner() {
  const { t } = useTranslation();
  const { isInstallable, isInstalling, installApp } = usePwa();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }, []);

  if (!isInstallable || dismissed) return null;

  return (
    <div
      className={cn(
        "sticky top-0 z-[60] flex w-full items-center justify-center gap-2 border-b border-violet-400/30",
        "bg-gradient-to-r from-violet-600/95 via-fuchsia-600/95 to-indigo-600/95 px-3 py-2.5 backdrop-blur-md",
        "sm:gap-3 sm:px-4",
      )}
      role="region"
      aria-label={t("pwa.install")}
    >
      <button
        type="button"
        onClick={() => void installApp()}
        disabled={isInstalling}
        className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center text-sm font-medium text-white sm:text-base"
      >
        {isInstalling ? (
          <Loader2 size={16} className="shrink-0 animate-spin" />
        ) : (
          <Download size={16} className="shrink-0" />
        )}
        <span className="break-words">📲 {t("pwa.install")}</span>
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label={t("pwa.dismiss")}
      >
        <X size={18} />
      </button>
    </div>
  );
}
