"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const theme = useAppStore((s) => s.settings.theme);
  const interfaceLang = useInterfaceLang();
  const isLessonRoute = pathname.startsWith("/lessons/");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1526779251127-948a231b0eba?auto=format&fit=crop&w=1920&q=80')`,
        }}
        aria-hidden
      />
      <div
        className={`fixed inset-0 -z-10 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-950/90 via-violet-950/80 to-fuchsia-950/70"
            : "bg-gradient-to-br from-violet-200/80 via-fuchsia-100/70 to-sky-200/80"
        }`}
        aria-hidden
      />

      {!isLessonRoute && <Header />}
      <main
        className={cn(
          "flex w-full flex-col overflow-x-hidden",
          isLessonRoute
            ? "w-full items-center p-0"
            : "items-center px-4 py-6 pb-24 md:pb-8 lg:px-6"
        )}
      >
        {children}
      </main>
      {!isLessonRoute && <BottomNav />}
      <AchievementToast interfaceLang={interfaceLang} />
    </div>
  );
}
