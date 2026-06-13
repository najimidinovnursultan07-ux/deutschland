import { isRootAdmin } from "@/lib/admin";
import type { User, UserRole } from "@/types";

/** Client & server guard — moderators and root admin only */
export function isAuthorizedToViewSuggestions(
  currentUser: Pick<User, "email" | "role"> | null | undefined
): boolean {
  if (!currentUser) return false;
  return (
    currentUser.role === "MODERATOR" ||
    isRootAdmin(currentUser.email)
  );
}

export function isAuthorizedToViewSuggestionsByClaims(
  email: string,
  role: UserRole
): boolean {
  return role === "MODERATOR" || isRootAdmin(email);
}
