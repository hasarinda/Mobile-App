//@flow

import base64 from "base-64";
import type { DeviceMap } from "../types/Device";
import { THINGER_SERVER } from "../constants/ThingerConstants";
import { AppError, ErrorCode } from "./errors";

type DeviceTokenPayload = {
  dev: string,
  jti: string,
  usr: string,
  iat?: number,
  exp?: number,
  res?: Array<string>
};

function decodePayload(jwt: string): DeviceTokenPayload {
  try {
    return JSON.parse(base64.decode(jwt.trim().split(".")[1]));
  } catch (e) {
    throw new AppError(ErrorCode.INVALID_DEVICE_TOKEN);
  }
}

// Parses a Thinger.io device token (from a QR code or the clipboard).
// NOTE: the signature can't be verified on the client; the server still
// rejects forged tokens with 401.
export function parseJWT(jwt: string): DeviceMap {
  const json = decodePayload(jwt);
  if (!json || !json.dev || !json.usr || !json.jti) {
    throw new AppError(ErrorCode.INVALID_DEVICE_TOKEN);
  }
  if (isExpired(json.exp)) {
    throw new AppError(ErrorCode.EXPIRED_DEVICE_TOKEN);
  }
  return {
    [json.jti]: {
      dev: json.dev,
      id: json.jti,
      usr: json.usr,
      iat: json.iat,
      exp: json.exp,
      res: json.res,
      jwt,
      isFetching: false,
      isOnline: false,
      isAuthorized: false,
      server: THINGER_SERVER,
      hasServerConnection: false
    }
  };
}

// `exp` is in seconds since epoch; tokens without `exp` never expire.
export function isExpired(exp: ?number, now: number = Date.now()): boolean {
  return typeof exp === "number" && exp * 1000 <= now;
}
