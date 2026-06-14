"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import type { AuthErrorCode } from "@/lib/auth/authResult";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

function resolveLoginError(
  t: (key: string) => string,
  errorCode?: AuthErrorCode,
): string {
  switch (errorCode) {
    case "INVALID_EMAIL":
      return t("auth.invalidEmail");
    case "PASSWORD_REQUIRED":
      return t("auth.passwordRequired");
    case "EMAIL_NOT_FOUND":
      return t("auth.emailNotFound");
    case "WRONG_PASSWORD":
      return t("auth.wrongPassword");
    case "SERVER_ERROR":
    case "STORAGE_ERROR":
      return t("auth.serverError");
    case "NETWORK_ERROR":
      return t("auth.networkError");
    default:
      return t("auth.invalidCredentials");
  }
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError(t("auth.invalidEmail"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    if (!trimmedPassword) {
      setError(t("auth.passwordRequired"));
      return;
    }

    setLoading(true);
    try {
      const result = await login(trimmedEmail, trimmedPassword);
      if (!result.success) {
        setError(resolveLoginError(t, result.errorCode));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h2 className="text-xl font-semibold text-white">{t("auth.loginTitle")}</h2>
      <p className="text-sm text-white/50">{t("auth.subtitle")}</p>

      <Input
        label={t("auth.email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
        disabled={loading}
      />
      <PasswordInput
        label={t("auth.passwordLabel")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
        disabled={loading}
      />

      {error && (
        <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <LogIn size={18} />
        )}
        {loading ? t("auth.loading") : t("auth.loginButton")}
      </Button>

      <p className="text-center text-sm text-white/50">
        {t("auth.noAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-violet-300 hover:text-violet-200"
          disabled={loading}
        >
          {t("auth.switchToSignup")}
        </button>
      </p>
    </form>
  );
}
