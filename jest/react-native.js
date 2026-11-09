// Minimal react-native stub for unit tests that run in plain node.
module.exports = {
  Platform: { OS: "ios" },
  NativeModules: {
    SettingsManager: { settings: { AppleLocale: "en_US" } },
    I18nManager: { localeIdentifier: "en_US" }
  }
};
