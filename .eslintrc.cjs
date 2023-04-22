/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  plugins: ["prettier", "@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  rules: {
        "no-console": "warn",
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
            }
        ],
  }

};
