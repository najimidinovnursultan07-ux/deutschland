"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { InstallPwaButton } from "@/components/pwa/InstallPwaButton";
import { useTranslation } from "@/hooks/useTranslation";

type AuthMode = "login" | "signup";

export function AuthScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>("login");

  const switchMode = (next: AuthMode) => {
    setMode(next);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <Logo size={80} className="mx-auto" />
          </div>
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
            LinguaBridge
            <Sparkles className="h-6 w-6 text-amber-300" />
          </h1>
          <p className="mt-2 text-sm text-white/60">{t("auth.subtitle")}</p>
          <div className="mt-4 flex justify-center">
            <InstallPwaButton size="md" />
          </div>
        </div>

        <GlassCard className="border-white/10">
          <div
            className="mb-6 flex rounded-xl bg-white/5 p-1"
            role="tablist"
            aria-label={t("auth.subtitle")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t("auth.loginButton")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t("auth.signupButton")}
            </button>
          </div>

          <div role="tabpanel">
            {mode === "login" ? (
              <LoginForm
                key="login-form"
                onSwitchToSignup={() => switchMode("signup")}
              />
            ) : (
              <SignUpForm
                key="signup-form"
                onSwitchToLogin={() => switchMode("login")}
              />
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
