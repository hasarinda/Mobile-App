module.exports = {
  parser: "babel-eslint",
  env: { es6: true, node: true, jest: true },
  globals: { __DEV__: true, fetch: true, window: true },
  plugins: ["react", "flowtype"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended"
  ],
  settings: { react: { version: "16.3" } },
  rules: {
    "no-console": ["warn", { allow: ["warn"] }],
    "no-unused-vars": ["warn", { args: "none" }],
    "react/prop-types": "off",
    "react/display-name": "off",
    "no-case-declarations": "off"
  }
};
