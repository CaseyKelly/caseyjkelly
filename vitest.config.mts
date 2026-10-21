import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// deliberately not vite.config.ts: the React Router plugin builds the whole
// app and doesn't belong in unit tests
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "app/test-utils.tsx", "app/routes.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
});
