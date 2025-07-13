/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./packages/shared/src/utils/setupTests.js",
    css: true,
    testTimeout: 5000,
    reporters: ["verbose"],
    ...(process.env.CI && {
      minThreads: 4,
      maxThreads: 4,
    }),
  },
});
