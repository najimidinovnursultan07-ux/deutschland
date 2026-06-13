"use client";

import { create } from "zustand";
import type { ProfileUpdateData, SignUpData, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  fetchSession: () => Promise<User | null>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignUpData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  fetchSession: async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        set({ user: null, isAuthenticated: false, hydrated: true });
        return null;
      }

      const data = (await res.json()) as { user: User };
      set({ user: data.user, isAuthenticated: true, hydrated: true });
      return data.user;
    } catch {
      set({ user: null, isAuthenticated: false, hydrated: true });
      return null;
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) return false;

      const data = (await res.json()) as { user: User };
      set({ user: data.user, isAuthenticated: true, hydrated: true });
      return true;
    } catch {
      return false;
    }
  },

  signup: async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) return false;

      const payload = (await res.json()) as { user: User };
      set({ user: payload.user, isAuthenticated: true, hydrated: true });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          avatarUrl: data.avatarUrl,
          targetLanguage: data.targetLanguage,
          password: data.password || undefined,
          currentPassword: data.currentPassword,
        }),
      });

      if (!res.ok) return false;

      const payload = (await res.json()) as { user: User };
      set({ user: payload.user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
}));
