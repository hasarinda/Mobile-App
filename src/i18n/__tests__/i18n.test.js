import { t, setLanguage, getDeviceLanguage } from "..";
import en from "../en";
import es from "../es";

afterEach(() => setLanguage("en"));

describe("t", () => {
  it("returns the English string by default", () => {
    expect(t("settings.logout")).toBe("Log out");
  });

  it("interpolates parameters", () => {
    expect(t("device.offline", { device: "ESP32" })).toBe("ESP32 is offline");
  });

  it("switches language", () => {
    setLanguage("es");
    expect(t("settings.logout")).toBe("Cerrar sesión");
  });

  it("falls back to English for unknown languages", () => {
    setLanguage("xx");
    expect(t("settings.logout")).toBe("Log out");
  });
});

describe("translations", () => {
  it("Spanish covers every English key", () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it("keeps the same placeholders in every language", () => {
    const placeholders = s => (s.match(/\{\w+\}/g) || []).sort();
    Object.keys(en).forEach(key => {
      expect([key, placeholders(es[key])]).toEqual([
        key,
        placeholders(en[key])
      ]);
    });
  });
});

describe("getDeviceLanguage", () => {
  it("reads the language from the device locale", () => {
    expect(getDeviceLanguage()).toBe("en");
  });
});
