"use client";

import { Download, Loader2 } from "lucide-react";
import { usePwa } from "@/context/PwaContext";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface InstallPwaButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showIcon?: boolean;
}

export function InstallPwaButton({
  className,
  size = "md",
  fullWidth = false,
  showIcon = true,
}: InstallPwaButtonProps) {
  const { t } = useTranslation();
  const {
    isInstallable,
    isInstalling,
    isInstagramInApp,
    isIosSafari,
    installApp,
    openInstagramInstallHint,
    openIosInstallHint,
  } = usePwa();

  const visible = isInstallable || isInstagramInApp || isIosSafari;
  if (!visible) return null;

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const handleClick = () => {
    if (isInstagramInApp) {
      openInstagramInstallHint();
      return;
    }
    if (isIosSafari) {
      openIosInstallHint();
      return;
    }
    void installApp();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isInstalling}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium text-white transition-all",
        "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25",
        "hover:from-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70",
        fullWidth && "w-full",
        sizeClasses[size],
        className,
      )}
    >
      {isInstalling ? (
        <Loader2 size={size === "sm" ? 14 : 18} className="animate-spin" />
      ) : showIcon ? (
        <Download size={size === "sm" ? 14 : 18} />
      ) : null}
      <span>{t("pwa.install")}</span>
    </button>
  );
}
