import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { sharedConfig } from "@ring/vitest-config";

export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    plugins: [react()],
    environment: "jsdom",
    css: true,
  },
});
