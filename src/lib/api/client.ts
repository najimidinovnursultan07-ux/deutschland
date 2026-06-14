/**
 * Same-origin relative API paths only.
 * Next.js resolves `/api/*` against the current host (localhost, LAN IP, or production).
 */
export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(normalizedPath, {
    credentials: init?.credentials ?? "include",
    ...init,
  });
}
