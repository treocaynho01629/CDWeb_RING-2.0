import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.ts?(x)", "src/**/*.js?(x)", "index.tsx"],
  format: ["cjs", "esm"],
  banner: {
    js: "'use client'",
  },
  clean: true,
  sourcemap: true,
  dts: true,
  external: ["react", "@mui/material", "react-lazy-load-image-component"],
  ...options,
}));
