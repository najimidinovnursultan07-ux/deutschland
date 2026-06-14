import { mapLoginResponseToResult, type AuthErrorCode } from "@/lib/auth/authResult";

type TranslateFn = (key: string) => string;

function messageForCode(t: TranslateFn, code?: AuthErrorCode): string | null {
  switch (code) {
    case "INVALID_EMAIL":
      return t("auth.invalidEmail");
    case "PASSWORD_REQUIRED":
      return t("auth.passwordRequired");
    case "NAME_REQUIRED":
      return t("auth.nameRequired");
    case "PASSWORD_TOO_SHORT":
      return t("auth.passwordMinLength");
    case "EMAIL_NOT_FOUND":
      return t("auth.emailNotFound");
    case "WRONG_PASSWORD":
      return t("auth.wrongPassword");
    case "EMAIL_EXISTS":
      return t("auth.emailAlreadyRegistered");
    case "STORAGE_ERROR":
      return t("auth.storageError");
    case "NETWORK_ERROR":
      return t("auth.networkError");
    case "SERVER_ERROR":
      return t("auth.serverError");
    case "INVALID_CREDENTIALS":
      return t("auth.invalidCredentials");
    default:
      return null;
  }
}

export function resolveAuthFormError(
  t: TranslateFn,
  status: number,
  payload: { code?: string; error?: string; message?: string } | null,
): string {
  const result = mapLoginResponseToResult(status, payload);
  return (
    messageForCode(t, result.errorCode) ??
    payload?.error ??
    payload?.message ??
    t("auth.serverError")
  );
}
