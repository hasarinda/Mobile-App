import base64 from "base-64";
import { parseJWT, isExpired } from "../jwt";

const token = payload =>
  "header." + base64.encode(JSON.stringify(payload)) + ".signature";
const now = Math.floor(Date.now() / 1000);

describe("parseJWT", () => {
  it("parses a valid device token", () => {
    const jwt = token({
      dev: "d1",
      usr: "u1",
      jti: "id1",
      iat: now,
      exp: now + 60
    });
    const device = parseJWT(jwt).id1;
    expect(device).toMatchObject({
      id: "id1",
      dev: "d1",
      usr: "u1",
      jwt,
      server: "https://api.thinger.io",
      isAuthorized: false
    });
  });

  it("accepts tokens without expiry", () => {
    expect(() =>
      parseJWT(token({ dev: "d", usr: "u", jti: "j" }))
    ).not.toThrow();
  });

  it("rejects expired tokens", () => {
    expect(() =>
      parseJWT(token({ dev: "d", usr: "u", jti: "j", exp: now - 1 }))
    ).toThrow("EXPIRED_DEVICE_TOKEN");
  });

  it("rejects tokens that aren't device tokens", () => {
    expect(() => parseJWT(token({ foo: "bar" }))).toThrow(
      "INVALID_DEVICE_TOKEN"
    );
  });

  it("rejects strings that aren't JWTs", () => {
    expect(() => parseJWT("not a token")).toThrow();
  });
});

describe("isExpired", () => {
  it("treats a missing exp as never expiring", () => {
    expect(isExpired(undefined)).toBe(false);
  });

  it("compares exp (seconds) with now (ms)", () => {
    expect(isExpired(100, 99999)).toBe(false);
    expect(isExpired(100, 100000)).toBe(true);
  });
});
