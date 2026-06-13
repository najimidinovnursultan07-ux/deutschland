"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookText, User, Settings, Trophy } from "lucide-react";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", icon: Home, key: "home" },
  { href: "/dictionary", icon: BookText, key: "dictionary" },
  { href: "/leaderboard", icon: Trophy, key: "leaderboard" },
  { href: "/profile", icon: User, key: "profile" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const interfaceLang = useInterfaceLang();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, icon: Icon, key }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs transition-colors",
                active ? "text-violet-300" : "text-white/50"
              )}
            >
              <Icon size={20} />
              <span>{getUiString(interfaceLang, key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
