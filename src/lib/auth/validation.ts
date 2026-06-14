const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeAuthPassword(password: string): string {
  return password.trim();
}
