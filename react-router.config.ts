import { rename, rm } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

// every page is static content: prerender them all to HTML and ship no server
export default {
  ssr: false,
  prerender: ["/", "/contact", "/projects", "/404"],
  // opt in to v8 behavior now so the major upgrade is a version bump
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  // Vercel serves build/client/404.html for unknown paths, so move the
  // prerendered not-found page there instead of leaving it at /404/
  async buildEnd({ reactRouterConfig }) {
    const client = path.join(reactRouterConfig.buildDirectory, "client");
    await rename(
      path.join(client, "404", "index.html"),
      path.join(client, "404.html"),
    );
    await rm(path.join(client, "404"), { recursive: true });
  },
} satisfies Config;
