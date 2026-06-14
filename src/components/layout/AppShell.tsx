"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { PageContainer } from "./PageContainer";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { InstallPwaBanner } from "@/components/pwa/InstallPwaBanner";
import { NotificationScheduler } from "@/components/notifications/NotificationScheduler";
import { FeedbackPrompt } from "@/components/feedback/FeedbackPrompt";
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
  const isAdminRoute = pathname.startsWith("/admin");
  const isFullBleed = isLessonRoute || isAdminRoute;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <InstallPwaBanner />
      <NotificationScheduler />
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

      {!isFullBleed && <Header />}
      <main
        className={cn(
          "flex w-full min-w-0 flex-col overflow-x-hidden",
          isFullBleed
            ? "items-center p-0"
            : "pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8"
        )}
      >
        {isFullBleed ? (
          children
        ) : (
          <PageContainer className="flex w-full min-w-0 flex-1 flex-col py-6">
            {children}
          </PageContainer>
        )}
      </main>
      {!isFullBleed && <BottomNav />}
      {!isFullBleed && <FeedbackPrompt />}
      <AchievementToast interfaceLang={interfaceLang} />
    </div>
  );
}
