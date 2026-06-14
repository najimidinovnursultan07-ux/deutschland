"use client";

import { create } from "zustand";
import {
  mapLoginResponseToResult,
  type AuthActionResult,
} from "@/lib/auth/authResult";
import {
  isValidEmail,
  normalizeAuthEmail,
  normalizeAuthPassword,
} from "@/lib/auth/validation";
import { apiFetch } from "@/lib/api/client";
import type { ProfileUpdateData, SignUpData, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  fetchSession: () => Promise<User | null>;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  signup: (data: SignUpData) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
}

async function parseJsonResponse<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  fetchSession: async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const res = await apiFetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        set({ user: null, isAuthenticated: false, hydrated: true });
        return null;
      }

      const data = await parseJsonResponse<{ user: User }>(res);
      if (!data?.user) {
        set({ user: null, isAuthenticated: false, hydrated: true });
        return null;
      }

      set({ user: data.user, isAuthenticated: true, hydrated: true });
      return data.user;
    } catch {
      set({ user: null, isAuthenticated: false, hydrated: true });
      return null;
    }
  },

  login: async (email, password) => {
    const trimmedEmail = normalizeAuthEmail(email);
    const trimmedPassword = normalizeAuthPassword(password);

    if (!trimmedEmail) {
      return { success: false, errorCode: "INVALID_EMAIL" };
    }

    if (!isValidEmail(trimmedEmail)) {
      return { success: false, errorCode: "INVALID_EMAIL" };
    }

    if (!trimmedPassword) {
      return { success: false, errorCode: "PASSWORD_REQUIRED" };
    }

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (!res.ok) {
        const payload = await parseJsonResponse<{
          code?: string;
          error?: string;
        }>(res);
        return mapLoginResponseToResult(res.status, payload);
      }

      const data = await parseJsonResponse<{ user: User }>(res);
      if (!data?.user) {
        return { success: false, errorCode: "SERVER_ERROR" };
      }

      set({ user: data.user, isAuthenticated: true, hydrated: true });
      return { success: true };
    } catch {
      return { success: false, errorCode: "NETWORK_ERROR" };
    }
  },

  signup: async (data) => {
    const name = data.name.trim();
    const email = normalizeAuthEmail(data.email);
    const password = normalizeAuthPassword(data.password);

    if (!name) {
      return { success: false, errorCode: "NAME_REQUIRED" };
    }

    if (!email || !isValidEmail(email)) {
      return { success: false, errorCode: "INVALID_EMAIL" };
    }

    if (!password) {
      return { success: false, errorCode: "PASSWORD_REQUIRED" };
    }

    if (password.length < 6) {
      return { success: false, errorCode: "PASSWORD_TOO_SHORT" };
    }

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          targetLanguage: data.targetLanguage,
        }),
      });

      if (!res.ok) {
        const payload = await parseJsonResponse<{
          code?: string;
          error?: string;
        }>(res);
        return mapLoginResponseToResult(res.status, payload);
      }

      const payload = await parseJsonResponse<{ user: User }>(res);
      if (!payload?.user) {
        return { success: false, errorCode: "SERVER_ERROR" };
      }

      set({ user: payload.user, isAuthenticated: true, hydrated: true });
      return { success: true };
    } catch {
      return { success: false, errorCode: "NETWORK_ERROR" };
    }
  },

  logout: async () => {
    try {
      await apiFetch("/api/auth/session", {
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
      const res = await apiFetch("/api/auth/profile", {
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

      const payload = await parseJsonResponse<{ user: User }>(res);
      if (!payload?.user) return false;

      set({ user: payload.user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
}));
