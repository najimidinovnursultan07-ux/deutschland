"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import type { TargetLanguage } from "@/types";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>("de");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Сырсөз кеминде 6 символ / Пароль минимум 6 символов");
      return;
    }
    const success = signup({ name, email, password, targetLanguage });
    if (!success) {
      setError("Бул почта колдонулуп жатат / Email уже используется");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Жаңы аккаунт түзүү</h2>
      <p className="text-sm text-white/50">Создать аккаунт</p>

      <Input
        label="Аты / Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Атыңыз"
        required
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Сырсөз / Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          Максаттуу тил / Целевой язык
        </label>
        <div className="flex gap-2">
          {(["de", "en"] as TargetLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setTargetLanguage(lang)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                targetLanguage === lang
                  ? "border-violet-400 bg-violet-500/30 text-white"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {lang === "de" ? "🇩🇪 Немисче" : "🇬🇧 Англисче"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg">
        <UserPlus size={18} />
        Катталуу / Регистрация
      </Button>

      <p className="text-center text-sm text-white/50">
        Аккаунтуңуз барбы? / Уже есть аккаунт?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-violet-300 hover:text-violet-200"
        >
          Кирүү / Войти
        </button>
      </p>
    </form>
  );
}
