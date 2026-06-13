"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isRootAdmin, resolveUserRole } from "@/lib/admin";
import { syncAuthSession } from "@/lib/auth/syncSession";
import type { ProfileUpdateData, SignUpData, User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (data: SignUpData) => boolean;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => void;
  setUserRole: (userId: string, role: UserRole) => boolean;
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function withResolvedRole(user: User): User {
  return {
    ...user,
    role: resolveUserRole(user.email, user.role),
  };
}

function migrateUser(user: User): User {
  const role = resolveUserRole(user.email, user.role ?? "USER");
  return { ...user, role };
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
        const user = withResolvedRole(found);
        set({
          user,
          isAuthenticated: true,
          users: get().users.map((u) =>
            u.id === user.id ? user : migrateUser(u)
          ),
        });
        void syncAuthSession(user);
        return true;
      },

      signup: (data) => {
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (exists) return false;

        const newUser: User = withResolvedRole({
          id: generateId(),
          name: data.name,
          email: data.email,
          password: data.password,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          targetLanguage: data.targetLanguage,
          createdAt: new Date().toISOString(),
          role: isRootAdmin(data.email) ? "ADMIN" : "USER",
        });

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isAuthenticated: true,
        }));
        void syncAuthSession(newUser);
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        void syncAuthSession(null);
      },

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;

        const updated = withResolvedRole({
          ...current,
          name: data.name ?? current.name,
          avatarUrl: data.avatarUrl ?? current.avatarUrl,
          password: data.password ?? current.password,
          targetLanguage: data.targetLanguage ?? current.targetLanguage,
        });

        set((state) => ({
          user: updated,
          users: state.users.map((u) =>
            u.id === updated.id ? updated : migrateUser(u)
          ),
        }));
      },

      setUserRole: (userId, role) => {
        const actor = get().user;
        if (!actor || !isRootAdmin(actor.email)) return false;

        const target = get().users.find((u) => u.id === userId);
        if (!target || isRootAdmin(target.email)) return false;

        const nextRole: UserRole = role === "MODERATOR" ? "MODERATOR" : "USER";

        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, role: nextRole } : migrateUser(u)
          ),
          user:
            state.user?.id === userId
              ? { ...state.user, role: nextRole }
              : state.user,
        }));
        return true;
      },
    }),
    {
      name: "lingua-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.users = state.users.map(migrateUser);
        if (state.user) {
          state.user = migrateUser(state.user);
        }
      },
    }
  )
);
