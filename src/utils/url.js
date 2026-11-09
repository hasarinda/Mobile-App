//@flow

import { AppError, ErrorCode } from "./errors";

// Only HTTPS servers are allowed so credentials and tokens are never sent
// in clear text. http://localhost is permitted for local development.
export function isSecureServer(server: ?string): boolean {
  if (!server) return false;
  const url = server.trim().toLowerCase();
  return (
    url.startsWith("https://") ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url)
  );
}

export function assertSecureServer(server: ?string) {
  if (!isSecureServer(server)) {
    throw new AppError(ErrorCode.INSECURE_SERVER);
  }
}
