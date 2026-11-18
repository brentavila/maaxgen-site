// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { SITE_URL } from './src/data/site.ts';

const toolbarOptimizeDeps = ["astro > aria-query", "astro > axobject-query", "astro/toolbar"];

// https://astro.build/config
export default defineConfig({
  site: SITE_URL, // single constant in src/data/site.ts
  // Static by default: every page is prerendered. Only src/pages/api/lead.ts opts out
  // (prerender = false) and deploys as a Vercel function.
  output: 'static',
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
  redirects: {
    "/service": "/services/",
    "/book-call": "/growth-system/book/",
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
