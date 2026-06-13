"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/store/authStore";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (!success) {
      setError("Туура эмес почта же сырсөз / Неверный email или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Кайра кош келиңиз</h2>
      <p className="text-sm text-white/50">С возвращением</p>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <PasswordInput
        label="Сырсөз / Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg">
        <LogIn size={18} />
        Кирүү / Войти
      </Button>

      <p className="text-center text-sm text-white/50">
        Аккаунтуңуз жокпу? / Нет аккаунта?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-violet-300 hover:text-violet-200"
        >
          Катталуу / Регистрация
        </button>
      </p>
    </form>
  );
}
