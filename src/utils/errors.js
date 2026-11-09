//@flow

import { t } from "../i18n";

// Error codes thrown inside the app. Throw `new AppError(code)` and let the
// UI layer turn the code into a message, so every failure is reported the
// same way.
export const ErrorCode = {
  INSECURE_SERVER: "INSECURE_SERVER",
  INVALID_DEVICE_TOKEN: "INVALID_DEVICE_TOKEN",
  EXPIRED_DEVICE_TOKEN: "EXPIRED_DEVICE_TOKEN",
  DEVICE_EXISTS: "DEVICE_EXISTS",
  HTTP: "HTTP"
};

export type ErrorCodeType = $Keys<typeof ErrorCode>;

export class AppError extends Error {
  code: ErrorCodeType;
  status: ?number;

  constructor(code: ErrorCodeType, status?: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export function errorCode(error: mixed): ?string {
  if (error instanceof AppError) return error.code;
  if (error instanceof Error) return error.message;
  return null;
}

// Network failures (fetch rejects with TypeError) and rejected insecure URLs
// both mean the server can't be reached.
export function isConnectionError(error: mixed): boolean {
  return (
    error instanceof TypeError || errorCode(error) === ErrorCode.INSECURE_SERVER
  );
}

// User-facing message for an error thrown while adding a device token.
export function deviceTokenErrorMessage(error: mixed): string {
  switch (errorCode(error)) {
    case ErrorCode.DEVICE_EXISTS:
      return t("token.exists");
    case ErrorCode.EXPIRED_DEVICE_TOKEN:
      return t("token.expired");
    default:
      return t("token.invalid");
  }
}
