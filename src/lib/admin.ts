import type { User, UserRole } from "@/types";

export const ROOT_ADMIN_EMAIL = "najimidinovnursultan07@gmail.com";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isRootAdmin(email: string): boolean {
  return normalizeEmail(email) === ROOT_ADMIN_EMAIL;
}

export function resolveUserRole(email: string, role?: UserRole): UserRole {
  if (isRootAdmin(email)) return "ADMIN";
  return role ?? "USER";
}

/** Root admin or assigned moderators may open the admin panel */
export function canAccessAdminPanel(user: User | null): boolean {
  if (!user) return false;
  if (isRootAdmin(user.email)) return true;
  return user.role === "MODERATOR";
}

/** Only the root owner may change user roles */
export function canManageUsers(user: User | null): boolean {
  if (!user) return false;
  return isRootAdmin(user.email);
}
