/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "avoid",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  bracketSpacing: false,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindConfig: "./packages/config/tailwind",
  endOfLine: "auto",
  bracketSameLine: true,
};
