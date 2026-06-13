"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";
import { LanguagePairSwitcher } from "./LanguagePairSwitcher";
import { Button } from "@/components/ui/Button";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/dictionary", key: "dictionary" },
  { href: "/leaderboard", key: "leaderboard" },
  { href: "/profile", key: "profile" },
  { href: "/settings", key: "settings" },
] as const;

export function Header() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const interfaceLang = useInterfaceLang();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:max-w-4xl md:px-8 lg:max-w-7xl">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
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
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {getUiString(interfaceLang, item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
          <Button variant="ghost" size="sm" onClick={logout} aria-label="Logout">
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {getUiString(interfaceLang, "logout")}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
