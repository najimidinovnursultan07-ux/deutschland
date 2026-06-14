/**
 * API base URL for browser fetch calls.
 *
 * Next.js serves API routes on the SAME host as the UI (`/api/...`).
 * Leave `NEXT_PUBLIC_API_ORIGIN` empty — relative URLs work on localhost AND
 * on phone via `http://192.168.x.x:3000`.
 *
 * Set only when the API runs on a different origin (e.g. separate backend):
 *   NEXT_PUBLIC_API_ORIGIN=http://192.168.1.10:5000
 */
const rawOrigin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim() ?? "";

export function getApiOrigin(): string {
  return rawOrigin.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = getApiOrigin();
  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}

export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(apiUrl(path), init);
}
