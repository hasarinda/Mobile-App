import { isSecureServer, assertSecureServer } from "../url";

describe("isSecureServer", () => {
  it("accepts https servers", () => {
    expect(isSecureServer("https://api.thinger.io")).toBe(true);
    expect(isSecureServer(" HTTPS://example.com ")).toBe(true);
  });

  it("accepts http only for localhost", () => {
    expect(isSecureServer("http://localhost")).toBe(true);
    expect(isSecureServer("http://localhost:8080/api")).toBe(true);
    expect(isSecureServer("http://127.0.0.1:3000")).toBe(true);
  });

  it("rejects plain http and look-alike hosts", () => {
    expect(isSecureServer("http://api.thinger.io")).toBe(false);
    expect(isSecureServer("http://localhost.evil.com")).toBe(false);
    expect(isSecureServer("ftp://example.com")).toBe(false);
  });

  it("rejects empty values", () => {
    expect(isSecureServer("")).toBe(false);
    expect(isSecureServer(null)).toBe(false);
    expect(isSecureServer(undefined)).toBe(false);
  });
});

describe("assertSecureServer", () => {
  it("throws for insecure servers", () => {
    expect(() => assertSecureServer("http://x.com")).toThrow("INSECURE_SERVER");
    expect(() => assertSecureServer("https://x.com")).not.toThrow();
  });
});
