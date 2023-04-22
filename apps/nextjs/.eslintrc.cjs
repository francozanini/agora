/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs", "next"],
  rules: {
    "no-console": "warn",
  "react/prop-types": "off",
  "react/jsx-uses-react": "off",
  "react/react-in-jsx-scope": "off",
  "prettier/prettier": [
  "warn",
  {
    "printWidth": 80,
    "trailingComma": "none",
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true,
    "bracketSpacing": false,
    "arrowParens": "avoid",
    "endOfLine": "auto",
    "bracketSameLine": true
  },
  ],
}
};
