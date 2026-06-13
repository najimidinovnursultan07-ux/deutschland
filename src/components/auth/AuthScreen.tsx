"use client";

import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
            LinguaBridge
            <Sparkles className="h-6 w-6 text-amber-300" />
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Немисче жана англисче үйрөнүңүз · Изучайте немецкий и английский
          </p>
        </div>

        <GlassCard className="border-white/10">
          <div className="mb-6 flex rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Кирүү / Войти
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Катталуу / Регистрация
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm onSwitchToSignup={() => setMode("signup")} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode("login")} />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
