"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { InstallPwaButton } from "@/components/pwa/InstallPwaButton";
import { LanguagePairSwitcher } from "./LanguagePairSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/dictionary", labelKey: "nav.dictionary" },
  { href: "/leaderboard", labelKey: "nav.leaderboard" },
  { href: "/profile", labelKey: "nav.profile" },
  { href: "/settings", labelKey: "nav.settings" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:max-w-4xl md:px-8 lg:max-w-7xl">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo size={40} className="h-9 w-auto" />
          <span className="hidden font-bold text-white sm:inline">
            LinguaBridge
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <InstallPwaButton size="sm" />
          <div className="hidden w-48 lg:block">
            <LanguagePairSwitcher />
          </div>
          {user && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="hidden h-8 w-8 rounded-full border border-white/20 sm:block"
            />
          )}
        </div>
      </div>
    </header>
  );
}
