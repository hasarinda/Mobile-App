//@flow

import base64 from "base-64";
import type { DeviceMap } from "../types/Device";

export function parseJWT(jwt: string): DeviceMap {
  try {
    const data: string = jwt.split(".")[1];
    const payload = base64.decode(data);
    const json: {
      dev: string,
      jti: string,
      usr: string,
      iat: number,
      exp: number,
      res: Array<string>
    } = JSON.parse(payload);
    // Reject QR codes that aren't Thinger.io device tokens.
    // NOTE: the signature can't be verified on the client; the server
    // still rejects forged tokens with 401.
    if (!json || !json.dev || !json.usr || !json.jti) {
      throw new Error("INVALID_DEVICE_TOKEN");
    }
    if (isExpired(json.exp)) {
      throw new Error("EXPIRED_DEVICE_TOKEN");
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
        server: "https://api.thinger.io",
        hasServerConnection: false
      }
    };
  } catch (error) {
    throw error;
  }
}

// `exp` is in seconds since epoch; tokens without `exp` never expire.
export function isExpired(exp: ?number, now: number = Date.now()): boolean {
  return typeof exp === "number" && exp * 1000 <= now;
}
