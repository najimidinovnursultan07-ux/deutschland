export type AuthErrorCode =
  | "INVALID_EMAIL"
  | "PASSWORD_REQUIRED"
  | "NAME_REQUIRED"
  | "PASSWORD_TOO_SHORT"
  | "VALIDATION_ERROR"
  | "EMAIL_NOT_FOUND"
  | "WRONG_PASSWORD"
  | "INVALID_CREDENTIALS"
  | "EMAIL_EXISTS"
  | "SERVER_ERROR"
  | "STORAGE_ERROR"
  | "NETWORK_ERROR";

export interface AuthActionResult {
  success: boolean;
  errorCode?: AuthErrorCode;
  message?: string;
}

export function mapLoginResponseToResult(
  status: number,
  payload: { code?: string; error?: string } | null,
): AuthActionResult {
  const code = payload?.code as AuthErrorCode | undefined;
  const message = payload?.error;

  if (status === 401) {
    if (code === "EMAIL_NOT_FOUND" || code === "WRONG_PASSWORD") {
      return { success: false, errorCode: code, message };
    }
    return {
      success: false,
      errorCode: "INVALID_CREDENTIALS",
      message,
    };
  }

  if (status === 409) {
    return { success: false, errorCode: "EMAIL_EXISTS", message };
  }

  if (status === 400) {
    if (code === "PASSWORD_TOO_SHORT") {
      return { success: false, errorCode: "PASSWORD_TOO_SHORT", message };
    }
    if (code === "VALIDATION_ERROR") {
      return { success: false, errorCode: "INVALID_EMAIL", message };
    }
    return { success: false, errorCode: "INVALID_CREDENTIALS", message };
  }

  if (status === 503) {
    return { success: false, errorCode: "STORAGE_ERROR", message };
  }

  if (status >= 500) {
    return { success: false, errorCode: "SERVER_ERROR", message };
  }

  return { success: false, errorCode: "INVALID_CREDENTIALS", message };
}
