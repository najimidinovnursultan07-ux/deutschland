"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileUpdateData, SignUpData, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (data: SignUpData) => boolean;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => void;
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      login: (email, password) => {
        const found = get().users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );
        if (!found) return false;
        set({ user: found, isAuthenticated: true });
        return true;
      },

      signup: (data) => {
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (exists) return false;

        const newUser: User = {
          id: generateId(),
          name: data.name,
          email: data.email,
          password: data.password,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          targetLanguage: data.targetLanguage,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isAuthenticated: true,
        }));
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;

        const updated: User = {
          ...current,
          name: data.name ?? current.name,
          avatarUrl: data.avatarUrl ?? current.avatarUrl,
          password: data.password ?? current.password,
          targetLanguage: data.targetLanguage ?? current.targetLanguage,
        };

        set((state) => ({
          user: updated,
          users: state.users.map((u) =>
            u.id === updated.id ? updated : u
          ),
        }));
      },
    }),
    {
      name: "lingua-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }),
    }
  )
);
