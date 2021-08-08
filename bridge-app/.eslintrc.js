module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "react-app"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 1,
    "@typescript-eslint/no-var-requires": 1,
    "@typescript-eslint/no-empty-function": 1,
  },
};
