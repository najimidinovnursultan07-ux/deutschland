"use client";

import { useEffect, useState } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { SessionSync } from "@/components/auth/SessionSync";
import { AppShell } from "./AppShell";
import { useAuthStore } from "@/store/authStore";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526779251127-948a231b0eba?auto=format&fit=crop&w=1920&q=80')`,
          }}
          aria-hidden
        />
        <div
          className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950/90 via-violet-950/80 to-fuchsia-950/70"
          aria-hidden
        />
        <AuthScreen />
      </div>
    );
  }

  return (
    <>
      <SessionSync />
      <AppShell>{children}</AppShell>
    </>
  );
}
