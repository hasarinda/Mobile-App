//@flow

import { NativeModules, Platform } from "react-native";
import en from "./en";
import es from "./es";

export type TranslationKey = $Keys<typeof en>;
export type Translations = { [key: TranslationKey]: string };

const translations: { [language: string]: Translations } = { en, es };

// Reads the device language without extra native dependencies.
export function getDeviceLanguage(): string {
  let locale;
  try {
    locale =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;
  } catch (e) {
    locale = null;
  }
  return (locale || "en").slice(0, 2).toLowerCase();
}

let current: Translations = translations[getDeviceLanguage()] || en;

export function setLanguage(language: string) {
  current = translations[language] || en;
}

// t("device.offline", { device: "ESP32" }) -> "ESP32 is offline"
// Falls back to English, then to the key itself.
export function t(
  key: TranslationKey,
  params?: { [name: string]: string | number }
): string {
  const template = current[key] || en[key] || key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    params && params[name] !== undefined ? String(params[name]) : match
  );
}
