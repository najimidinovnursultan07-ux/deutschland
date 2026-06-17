"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookText, User, Settings, Trophy } from "lucide-react";
import { InstallPwaButton } from "@/components/pwa/InstallPwaButton";
import { usePwa } from "@/context/PwaContext";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/dictionary", icon: BookText, labelKey: "nav.dictionary" },
  { href: "/leaderboard", icon: Trophy, labelKey: "nav.leaderboard" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isInstallable, isInstagramInApp, isIosSafari } = usePwa();

  const showInstallBar = isInstallable || isInstagramInApp || isIosSafari;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-900/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      {showInstallBar && (
        <div className="border-b border-white/10 px-3 py-2">
          <InstallPwaButton size="sm" fullWidth />
        </div>
      )}
      <div className="flex w-full items-center justify-around px-1 py-2 sm:px-2">
        {NAV.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] transition-colors sm:px-3 sm:text-xs",
                active ? "text-violet-300" : "text-white/50",
              )}
            >
              <Icon size={20} className="shrink-0" />
              <span className="truncate">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
