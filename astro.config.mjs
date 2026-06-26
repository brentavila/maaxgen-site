// @ts-check
import { defineConfig } from 'astro/config';

const toolbarOptimizeDeps = ["astro > aria-query", "astro > axobject-query", "astro/toolbar"];

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: [],
      exclude: toolbarOptimizeDeps,
    },
    plugins: [
      // Prevent Astro's dev-toolbar optimizer deps from being re-added in sandboxed builds.
      {
        name: "maaxgen-sandbox-optimize-deps",
        enforce: "post",
        configResolved(config) {
          config.optimizeDeps.noDiscovery = true;
          config.optimizeDeps.include = [];
          config.optimizeDeps.exclude = Array.from(
            new Set([...(config.optimizeDeps.exclude ?? []), ...toolbarOptimizeDeps])
          );
        },
      },
    ],
  },
});
