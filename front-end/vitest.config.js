import { defineConfig } from "vitest/config";
import { sharedConfig } from "@ring/vitest-config";

export default defineConfig({
  ...sharedConfig,
  projects: [
    {
      name: "packages",
      root: "./packages",
      test: {
        ...sharedConfig.test,
      },
    },
    {
      name: "apps",
      root: "./apps",
      test: {
        ...sharedConfig.test,
        environment: "jsdom",
      },
    },
  ],
});
