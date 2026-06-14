"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import type { AuthErrorCode } from "@/lib/auth/authResult";
import type { TargetLanguage } from "@/types";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

function resolveSignupError(
  t: (key: string) => string,
  errorCode?: AuthErrorCode,
): string {
  switch (errorCode) {
    case "INVALID_EMAIL":
      return t("auth.invalidEmail");
    case "PASSWORD_REQUIRED":
      return t("auth.passwordRequired");
    case "NAME_REQUIRED":
      return t("auth.nameRequired");
    case "PASSWORD_TOO_SHORT":
      return t("auth.passwordMinLength");
    case "EMAIL_EXISTS":
      return t("auth.emailAlreadyRegistered");
    case "SERVER_ERROR":
    case "STORAGE_ERROR":
      return t("auth.serverError");
    case "NETWORK_ERROR":
      return t("auth.networkError");
    default:
      return t("auth.serverError");
  }
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const { t } = useTranslation();
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>("de");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setError(t("auth.nameRequired"));
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    if (!trimmedPassword) {
      setError(t("auth.passwordRequired"));
      return;
    }

    if (trimmedPassword.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }

    setLoading(true);
    try {
      const result = await signup({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        targetLanguage,
      });

      if (!result.success) {
        setError(resolveSignupError(t, result.errorCode));
      }
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h2 className="text-xl font-semibold text-white">{t("auth.signupTitle")}</h2>
      <p className="text-sm text-white/50">{t("auth.createAccount")}</p>

      <Input
        label={t("auth.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("auth.namePlaceholder")}
        required
        autoComplete="name"
        disabled={loading}
      />
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
        autoComplete="new-password"
        disabled={loading}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          {t("targetLanguage")}
        </label>
        <div className="flex gap-2">
          {(["de", "en"] as TargetLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setTargetLanguage(lang)}
              disabled={loading}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                targetLanguage === lang
                  ? "border-violet-400 bg-violet-500/30 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {lang === "de" ? t("auth.targetGerman") : t("auth.targetEnglish")}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <UserPlus size={18} />
        )}
        {loading ? t("auth.loading") : t("auth.signupButton")}
      </Button>

      <p className="text-center text-sm text-white/50">
        {t("auth.haveAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-violet-300 hover:text-violet-200"
          disabled={loading}
        >
          {t("auth.switchToLogin")}
        </button>
      </p>
    </form>
  );
}
