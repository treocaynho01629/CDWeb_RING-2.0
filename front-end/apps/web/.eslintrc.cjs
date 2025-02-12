/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@ring/eslint-config/index.js"],
  plugins: ["eslint-plugin-react-compiler"],
  rules: {
    "react-compiler/react-compiler": "error",
  },
};
