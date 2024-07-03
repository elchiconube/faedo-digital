import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://faedodigital.com",
  integrations: [tailwind(), mdx(), sitemap(), icon(), react()],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  server: {
    host: '0.0.0.0'
  },
  vite: {
    assetsInclude: ['**/*.glb']
  }
});